-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."app_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "resetToken" TEXT,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "public"."app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_accessToken_key" ON "public"."app_users"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_refreshToken_key" ON "public"."app_users"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_resetToken_key" ON "public"."app_users"("resetToken");
