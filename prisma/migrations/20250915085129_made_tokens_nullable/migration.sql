-- AlterTable
ALTER TABLE "public"."app_users" ALTER COLUMN "accessToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "refreshTokenExp" DROP NOT NULL;
