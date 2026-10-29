export const UserRole = {
  BUYER: "BUYER",
  OWNER: "OWNER",
  AGENT: "AGENT",
  AGENCY_ADMIN: "AGENCY_ADMIN",
  DEVELOPER: "DEVELOPER",
  CONTRACTOR: "CONTRACTOR",
  ARCHITECT: "ARCHITECT",
  VENDOR: "VENDOR",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PropertyPurpose = {
  SALE: "SALE",
  RENT: "RENT",
  SHORT_STAY: "SHORT_STAY",
} as const;
export type PropertyPurpose = (typeof PropertyPurpose)[keyof typeof PropertyPurpose];

export const PropertyCategory = {
  RESIDENTIAL: "RESIDENTIAL",
  COMMERCIAL: "COMMERCIAL",
  AGRICULTURAL: "AGRICULTURAL",
  INDUSTRIAL: "INDUSTRIAL",
} as const;
export type PropertyCategory = (typeof PropertyCategory)[keyof typeof PropertyCategory];

export const PropertyType = {
  PLOT: "PLOT",
  HOUSE: "HOUSE",
  FLAT: "FLAT",
  SHOP: "SHOP",
  OFFICE: "OFFICE",
  WAREHOUSE: "WAREHOUSE",
  FARMHOUSE: "FARMHOUSE",
  VILLA: "VILLA",
  PORTION: "PORTION",
  BUILDING: "BUILDING",
  AGRICULTURAL_LAND: "AGRICULTURAL_LAND",
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const ConstructionState = {
  PLOT_ONLY: "PLOT_ONLY",
  GREY_STRUCTURE: "GREY_STRUCTURE",
  SEMI_FINISHED: "SEMI_FINISHED",
  FINISHED: "FINISHED",
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION",
} as const;
export type ConstructionState = (typeof ConstructionState)[keyof typeof ConstructionState];

export const Possession = {
  PHYSICAL: "PHYSICAL",
  FILE_ONLY: "FILE_ONLY",
  UNDER_DEVELOPMENT: "UNDER_DEVELOPMENT",
} as const;
export type Possession = (typeof Possession)[keyof typeof Possession];

export const PropertyStatus = {
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  SOLD: "SOLD",
  RENTED: "RENTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

export const PlotStatus = {
  AVAILABLE: "AVAILABLE",
  SOLD: "SOLD",
  ON_HOLD: "ON_HOLD",
  FILE_ONLY: "FILE_ONLY",
  POSSESSION: "POSSESSION",
} as const;
export type PlotStatus = (typeof PlotStatus)[keyof typeof PlotStatus];

export const PriceType = {
  FIXED: "FIXED",
  NEGOTIABLE: "NEGOTIABLE",
  ON_CALL: "ON_CALL",
} as const;
export type PriceType = (typeof PriceType)[keyof typeof PriceType];

export const VerificationStatus = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

/** Map / plot colour contract — keep in sync with mobile + web */
export const PLOT_STATUS_COLOURS: Record<PlotStatus | "NO_DATA", string> = {
  AVAILABLE: "#1F7A4C",
  SOLD: "#8A8F8C",
  ON_HOLD: "#C6890B",
  FILE_ONLY: "#0D6B5F",
  POSSESSION: "#0A5148",
  NO_DATA: "#C9CFCB",
};
