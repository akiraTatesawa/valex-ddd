import { prisma } from "@infra/database/prisma/config/prisma.database";

export class TestHelper {
  public static async cleanDB(): Promise<void> {
    await prisma.cleanDb();
  }
}
