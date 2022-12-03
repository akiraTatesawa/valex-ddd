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

  public get card() {
    return this._prisma.prismaCard;
  }

  public async connect(): Promise<void> {
    await this._prisma.$connect();

    console.log("Prisma Connected!");
  }

  public async cleanDb(): Promise<void> {
    await this._prisma.$queryRaw`TRUNCATE TABLE companies CASCADE`;
    await this._prisma.$queryRaw`TRUNCATE TABLE employees CASCADE`;
    await this._prisma.$queryRaw`TRUNCATE TABLE cards CASCADE`;
  }
}

export const prisma = new PrismaDatabase();
