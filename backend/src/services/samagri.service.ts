import { PrismaClient } from '@prisma/client';
import type { PaginationParams } from '../types/index.js';
import { buildPaginatedResponse } from '../utils/helpers.js';

const prisma = new PrismaClient();

/**
 * Get all samagri items with optional category filter and pagination
 */
export async function getAllSamagriItems(
  category: string | undefined,
  pagination: PaginationParams
) {
  const where = {
    inStock: true,
    ...(category ? { category } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.samagriItem.findMany({
      where,
      orderBy: { category: 'asc' },
      skip: pagination.skip,
      take: pagination.limit,
    }),
    prisma.samagriItem.count({ where }),
  ]);

  return buildPaginatedResponse(items, total, pagination);
}

/**
 * Get samagri categories with counts
 */
export async function getSamagriCategories() {
  const categories = await prisma.samagriItem.groupBy({
    by: ['category'],
    where: { inStock: true },
    _count: { id: true },
  });

  return categories.map((cat) => ({
    category: cat.category,
    count: cat._count.id,
  }));
}

/**
 * Place a samagri order (simplified – returns the order summary)
 */
export async function placeSamagriOrder(
  userId: string,
  items: Array<{ samagriItemId: string; quantity: number }>
) {
  // Fetch all items
  const itemIds = items.map((i) => i.samagriItemId);
  const samagriItems = await prisma.samagriItem.findMany({
    where: { id: { in: itemIds }, inStock: true },
  });

  if (samagriItems.length !== itemIds.length) {
    const foundIds = new Set(samagriItems.map((i) => i.id));
    const missingIds = itemIds.filter((id) => !foundIds.has(id));
    return {
      success: false,
      message: `Some items not found or out of stock: ${missingIds.join(', ')}`,
    };
  }

  // Build order summary
  const orderItems = items.map((item) => {
    const samagri = samagriItems.find((s) => s.id === item.samagriItemId)!;
    return {
      id: samagri.id,
      name: samagri.name,
      category: samagri.category,
      quantity: item.quantity,
      unitPrice: samagri.price,
      totalPrice: samagri.price * item.quantity,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    success: true,
    orderId: `SAM-${Date.now()}`,
    userId,
    items: orderItems,
    totalAmount,
    status: 'PENDING',
    message: 'Samagri order placed successfully. Payment pending.',
  };
}
