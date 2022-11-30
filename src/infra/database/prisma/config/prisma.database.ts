import { PrismaClient } from "@prisma/client";

export class PrismaDatabase {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  public get company() {
    return this._prisma.prismaCompany;
  }
}

export const prisma = new PrismaDatabase();
