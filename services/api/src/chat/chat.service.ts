import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateThread(propertyId: string, buyerId: string, sellerId: string) {
    return this.prisma.messageThread.upsert({
      where: { propertyId_buyerId_sellerId: { propertyId, buyerId, sellerId } },
      update: {},
      create: { propertyId, buyerId, sellerId },
    });
  }

  async send(threadId: string, senderId: string, body: string) {
    // Mask phone-like patterns (anti-leak)
    const masked = body.replace(/(\+92|0)?3\d{2}[\s-]?\d{7}/g, "+92***");
    return this.prisma.message.create({
      data: { threadId, senderId, body: masked, type: "text" },
    });
  }

  async listMessages(threadId: string) {
    return this.prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
  }

  async threadsForUser(userId: string) {
    return this.prisma.messageThread.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      orderBy: { updatedAt: "desc" },
      include: { messages: { take: 1, orderBy: { createdAt: "desc" } } },
    });
  }
}
