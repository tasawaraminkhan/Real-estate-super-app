import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { randomUUID } from "crypto";

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Phase 1: presigned URL stub — MinIO/S3 real PUT in production */
  presign(propertyId: string, filename: string, contentType: string) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(contentType)) {
      throw new BadRequestException({
        error: { code: "INVALID_MIME", message: "Only JPEG/PNG/WebP allowed" },
      });
    }
    const key = `properties/${propertyId}/${randomUUID()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const endpoint = process.env.S3_PUBLIC_URL ?? "http://localhost:9000/propverse";
    const uploadUrl = `${endpoint}/${key}?X-Amz-Expires=600&X-Amz-Signature=dev-mock`;
    return {
      uploadUrl,
      publicUrl: `${endpoint}/${key}`,
      objectKey: key,
      expiresIn: 600,
      headers: { "Content-Type": contentType },
    };
  }

  async confirm(propertyId: string, objectKey: string, sortOrder = 0) {
    const endpoint = process.env.S3_PUBLIC_URL ?? "http://localhost:9000/propverse";
    const url = objectKey.startsWith("http") ? objectKey : `${endpoint}/${objectKey}`;
    return this.prisma.propertyMedia.create({
      data: {
        propertyId,
        type: "PHOTO",
        url,
        thumbnail: url,
        sortOrder,
        watermarkApplied: false,
      },
    });
  }
}
