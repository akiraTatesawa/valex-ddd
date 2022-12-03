import { PrismaClient } from "@prisma/client";

export class PrismaDatabase {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  public get company() {
    return this._prisma.prismaCompany;
  }

  public get employee() {
    return this._prisma.prismaEmployee;
  }

  public async connect(): Promise<void> {
    await this._prisma.$connect();

    console.log("Prisma Connected!");
  }
}

export const prisma = new PrismaDatabase();
