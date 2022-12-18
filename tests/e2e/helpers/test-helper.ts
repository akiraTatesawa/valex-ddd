import { prisma } from "@infra/data/databases/prisma/config/prisma.database";

export class TestHelper {
  public static async cleanDB(): Promise<void> {
    await prisma.cleanDb();
  }
}
