// Subscription limits
export const PLAN_LIMITS = {
  FREE: {
    maxPlants: 1,
    maxMessagesPerDay: 10,
    chatHistoryDays: 7,
    maxSetups: 1,
  },
  PRO: {
    maxPlants: 6,
    maxMessagesPerDay: Infinity,
    chatHistoryDays: Infinity,
    maxSetups: 1,
  },
} as const;

// Subscription pricing
export const PRO_PRICE_BRL = 9.9; // R$9,90/mes

// Plant phases
export const PLANT_PHASES = {
  GERM: { label: "Germinacao", emoji: "🌰" },
  SEEDLING: { label: "Muda", emoji: "🌿" },
  VEG: { label: "Vegetativo", emoji: "🌱" },
  FLOWER: { label: "Floracao", emoji: "🌸" },
  HARVEST: { label: "Colheita", emoji: "🔬" },
  CURING: { label: "Cura", emoji: "🫙" },
} as const;

// Plant genetics
export const PLANT_GENETICS = {
  FEM: { label: "Feminizada", emoji: "🌸" },
  AUTO: { label: "Autoflowering", emoji: "⚡" },
  PHOTO: { label: "Fotoperiodico", emoji: "📸" },
  REGULAR: { label: "Regular", emoji: "🌿" },
} as const;

// Substrate types
export const SUBSTRATES = {
  SOIL: { label: "Solo", emoji: "🪴" },
  COCO: { label: "Coco", emoji: "🥥" },
  HYDRO: { label: "Hidroponia", emoji: "💧" },
  MIX: { label: "Mix", emoji: "🌍" },
} as const;

// Grow types
export const GROW_TYPES = {
  INDOOR: { label: "Indoor", emoji: "🏠" },
  OUTDOOR: { label: "Outdoor", emoji: "🌿" },
  GREENHOUSE: { label: "Estufa", emoji: "🏡" },
} as const;

// Health thresholds
export const HEALTH_COLORS = {
  good: { min: 80, color: "#29b554" },
  warning: { min: 55, color: "#f59e0b" },
  danger: { min: 0, color: "#f43f5e" },
} as const;

export function getHealthColor(health: number): string {
  if (health >= 80) return HEALTH_COLORS.good.color;
  if (health >= 55) return HEALTH_COLORS.warning.color;
  return HEALTH_COLORS.danger.color;
}

export function getPlantDays(startDate: string | Date): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
}

export function getPlantWeek(startDate: string | Date): number {
  return Math.max(1, Math.ceil(getPlantDays(startDate) / 7));
}
