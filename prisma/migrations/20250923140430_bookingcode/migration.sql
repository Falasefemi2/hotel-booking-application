/*
  Warnings:

  - A unique constraint covering the columns `[bookingConfirmationCode]` on the table `BookedRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookedRoom_bookingConfirmationCode_key" ON "public"."BookedRoom"("bookingConfirmationCode");
