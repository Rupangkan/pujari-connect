-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pujaId" TEXT,
    "pujariId" TEXT,
    "packageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "bookingDate" DATETIME NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "couponCode" TEXT,
    "discount" REAL NOT NULL DEFAULT 0,
    "addressId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_pujaId_fkey" FOREIGN KEY ("pujaId") REFERENCES "Puja" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_pujariId_fkey" FOREIGN KEY ("pujariId") REFERENCES "Pujari" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("addressId", "bookingDate", "couponCode", "createdAt", "discount", "id", "notes", "packageId", "paymentId", "paymentStatus", "pujaId", "pujariId", "status", "totalAmount", "updatedAt", "userId") SELECT "addressId", "bookingDate", "couponCode", "createdAt", "discount", "id", "notes", "packageId", "paymentId", "paymentStatus", "pujaId", "pujariId", "status", "totalAmount", "updatedAt", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
