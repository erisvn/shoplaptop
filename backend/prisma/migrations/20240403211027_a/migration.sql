/*
  Warnings:

  - You are about to drop the column `user_address_id` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_user_address_id_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "user_address_id",
ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "payment_method" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "UserAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
