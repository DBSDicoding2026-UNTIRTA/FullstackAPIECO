-- AlterTable
ALTER TABLE "User" ALTER COLUMN "theme" SET DEFAULT 'system',
ADD COLUMN     "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiResultNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketingNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false;
