import { Injectable } from "@nestjs/common";

export type FraudInput = {
  priceAmount: number;
  societyMedian?: number;
  description?: string;
  photoCount: number;
  userListingCount24h: number;
  accountAgeDays: number;
  verified: boolean;
  latitude?: number;
  longitude?: number;
};

@Injectable()
export class FraudService {
  score(input: FraudInput) {
    const signals: { code: string; weight: number; detail: string }[] = [];
    let score = 0;

    if (input.photoCount < 3) {
      signals.push({ code: "LOW_PHOTOS", weight: 15, detail: "Less than 3 photos" });
      score += 15;
    }
    if (input.description && /(\+92|03\d{2}[\s-]?\d{7}|whatsapp|wa\.me)/i.test(input.description)) {
      signals.push({ code: "CONTACT_IN_DESC", weight: 20, detail: "Phone/WhatsApp in description" });
      score += 20;
    }
    if (input.societyMedian && input.priceAmount > 0) {
      const ratio = input.priceAmount / input.societyMedian;
      if (ratio > 3 || ratio < 0.4) {
        signals.push({ code: "PRICE_ANOMALY", weight: 25, detail: `Price ratio ${ratio.toFixed(2)} vs society median` });
        score += 25;
      }
    }
    if (input.userListingCount24h > 8) {
      signals.push({ code: "VELOCITY", weight: 20, detail: "Too many listings in 24h" });
      score += 20;
    }
    if (input.accountAgeDays < 7 && input.userListingCount24h > 3) {
      signals.push({ code: "NEW_ACCOUNT_BURST", weight: 15, detail: "New account high velocity" });
      score += 15;
    }
    if (!input.verified) {
      signals.push({ code: "UNVERIFIED", weight: 10, detail: "User not KYC verified" });
      score += 10;
    }
    if (input.latitude != null && (input.latitude < 23 || input.latitude > 37)) {
      signals.push({ code: "GEO_OUTSIDE_PK", weight: 30, detail: "Coordinates outside Pakistan band" });
      score += 30;
    }

    score = Math.min(100, score);
    const action = score >= 70 ? "auto_hold" : score >= 30 ? "hold" : "auto_approve";
    return { score, signals, action };
  }
}
