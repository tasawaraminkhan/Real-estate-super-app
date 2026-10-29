import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

/** In-memory fallback if SavedSearch table not migrated yet */
const mem = new Map<string, { id: string; userId: string; name: string; filters: unknown; createdAt: string }[]>();

@Injectable()
export class SavedSearchService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return mem.get(userId) ?? [];
  }

  create(userId: string, name: string, filters: unknown) {
    const row = {
      id: crypto.randomUUID(),
      userId,
      name,
      filters,
      createdAt: new Date().toISOString(),
    };
    const arr = mem.get(userId) ?? [];
    arr.unshift(row);
    mem.set(userId, arr);
    return row;
  }

  remove(userId: string, id: string) {
    const arr = (mem.get(userId) ?? []).filter((x) => x.id !== id);
    mem.set(userId, arr);
    return { deleted: true };
  }
}
