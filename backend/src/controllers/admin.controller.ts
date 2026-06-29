import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { resources, getResource, ResourceDef } from '../admin/resources';

const prisma = new PrismaClient();

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set. Refusing to start with an insecure default.`);
  return v;
}

const JWT_SECRET = requireEnv('JWT_SECRET');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

/** Constant-time string compare to avoid leaking the username via timing. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Access a Prisma model delegate by its registry name. */
function delegate(model: string): any {
  return (prisma as any)[model];
}

/** Whitelist + type-coerce an incoming body against a resource definition. */
function coerceData(resource: ResourceDef, body: Record<string, any>, partial: boolean) {
  const data: Record<string, any> = {};

  for (const f of resource.fields) {
    const provided = Object.prototype.hasOwnProperty.call(body ?? {}, f.name);

    if (!provided) {
      if (!partial && f.required) {
        throw new HttpError(`Field '${f.label}' is required.`, 400);
      }
      continue;
    }

    let v = body[f.name];

    // Treat empty/blank as "not set"
    if (v === '' || v === null || v === undefined) {
      if (f.required) {
        if (!partial) throw new HttpError(`Field '${f.label}' is required.`, 400);
        continue; // never null out a required field on partial update
      }
      data[f.name] = null;
      continue;
    }

    switch (f.type) {
      case 'number': {
        const n = Number(v);
        if (Number.isNaN(n)) throw new HttpError(`Field '${f.label}' must be a number.`, 400);
        data[f.name] = n;
        break;
      }
      case 'boolean':
        data[f.name] = v === true || v === 'true' || v === 'on' || v === 1 || v === '1';
        break;
      case 'datetime': {
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) throw new HttpError(`Field '${f.label}' is not a valid date.`, 400);
        data[f.name] = d;
        break;
      }
      case 'select':
        if (f.options && !f.options.includes(String(v))) {
          throw new HttpError(`Field '${f.label}' must be one of: ${f.options.join(', ')}.`, 400);
        }
        data[f.name] = String(v);
        break;
      default:
        data[f.name] = String(v);
    }
  }

  return data;
}

/** Lightweight error carrying an HTTP status, handled locally below. */
class HttpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Translate common Prisma errors into friendly 400 messages. */
function handleWriteError(err: any, res: Response, next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  if (err?.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'value';
    return res.status(400).json({ success: false, message: `A record with this ${target} already exists.` });
  }
  if (err?.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Invalid reference: a related record does not exist.' });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }
  return next(err);
}

// ─── Auth ──────────────────────────────────────────────────────────────────

/** POST /api/admin/login */
export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!ADMIN_PASSWORD_HASH) {
    return res.status(503).json({ success: false, message: 'Admin login is not configured.' });
  }
  const userOk = typeof username === 'string' && safeEqual(username, ADMIN_USERNAME);
  const passOk = typeof password === 'string' && (await bcrypt.compare(password, ADMIN_PASSWORD_HASH));
  if (!userOk || !passOk) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
  const token = jwt.sign({ userId: 'admin', role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, data: { token, username } });
};

// ─── Metadata ────────────────────────────────────────────────────────────────

/** GET /api/admin/resources — drives the frontend nav + forms */
export const getResources = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: resources.map((r) => ({ key: r.key, label: r.label, fields: r.fields })),
  });
};

/** GET /api/admin/stats — record counts per entity for the dashboard */
export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Promise.all(
      resources.map(async (r) => ({
        key: r.key,
        label: r.label,
        count: await delegate(r.model).count(),
      }))
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ─── Generic CRUD ────────────────────────────────────────────────────────────

/** GET /api/admin/:resource */
export const listResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = getResource(req.params.resource);
    if (!r) return res.status(404).json({ success: false, message: 'Unknown resource' });

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    const q = String(req.query.q || '').trim();
    if (q && r.searchField) where[r.searchField] = { contains: q };

    const [data, total] = await Promise.all([
      delegate(r.model).findMany({ where, include: r.include, orderBy: r.orderBy ?? { id: 'desc' }, skip, take: limit }),
      delegate(r.model).count({ where }),
    ]);

    res.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/:resource/:id */
export const getResourceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = getResource(req.params.resource);
    if (!r) return res.status(404).json({ success: false, message: 'Unknown resource' });

    const item = await delegate(r.model).findUnique({ where: { id: req.params.id }, include: r.include });
    if (!item) return res.status(404).json({ success: false, message: 'Record not found' });

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/:resource */
export const createResourceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = getResource(req.params.resource);
    if (!r) return res.status(404).json({ success: false, message: 'Unknown resource' });

    const data = coerceData(r, req.body, false);
    const item = await delegate(r.model).create({ data });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    handleWriteError(err, res, next);
  }
};

/** PUT /api/admin/:resource/:id */
export const updateResourceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = getResource(req.params.resource);
    if (!r) return res.status(404).json({ success: false, message: 'Unknown resource' });

    const data = coerceData(r, req.body, true);
    const item = await delegate(r.model).update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: item });
  } catch (err) {
    handleWriteError(err, res, next);
  }
};

/** DELETE /api/admin/:resource/:id */
export const removeResourceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = getResource(req.params.resource);
    if (!r) return res.status(404).json({ success: false, message: 'Unknown resource' });

    await delegate(r.model).delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    handleWriteError(err, res, next);
  }
};
