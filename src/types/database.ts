export type SubscriptionPlan = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE";
export type PlantPhase = "GERM" | "SEEDLING" | "VEG" | "FLOWER" | "HARVEST" | "CURING";
export type PlantGenType = "FEM" | "AUTO" | "PHOTO" | "REGULAR";
export type SubstrateType = "SOIL" | "COCO" | "HYDRO" | "MIX";
export type GrowType = "INDOOR" | "OUTDOOR" | "GREENHOUSE";
export type ChatRole = "user" | "assistant" | "system";

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setup {
  id: string;
  user_id: string;
  name: string;
  grow_type: GrowType | null;
  city: string | null;
  state: string | null;
  country: string | null;
  tent_type: string | null;
  tent_width_cm: number | null;
  tent_depth_cm: number | null;
  tent_height_cm: number | null;
  tent_brand: string | null;
  max_plants: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  lights?: Light[];
  soils?: Soil[];
  vents?: Vent[];
  ferts?: Fert[];
}

export interface Light {
  id: string;
  setup_id: string;
  type: string;
  watts: number | null;
  ppfd: number | null;
  height_cm: number | null;
  cycle: string | null;
  brand: string | null;
  model: string | null;
  created_at: string;
}

export interface Soil {
  id: string;
  setup_id: string;
  type: string;
  brand: string | null;
  n_value: number | null;
  p_value: number | null;
  k_value: number | null;
  ph: number | null;
  volume_liters: number | null;
  created_at: string;
}

export interface Vent {
  id: string;
  setup_id: string;
  type: string;
  brand: string | null;
  cfm: number | null;
  has_carbon_filter: boolean;
  created_at: string;
}

export interface Fert {
  id: string;
  setup_id: string;
  name: string | null;
  brand: string | null;
  n_value: number | null;
  p_value: number | null;
  k_value: number | null;
  ec: number | null;
  ph: number | null;
  notes: string | null;
  created_at: string;
}

export interface Plant {
  id: string;
  user_id: string;
  setup_id: string | null;
  name: string;
  strain: string | null;
  gen_type: PlantGenType;
  phase: PlantPhase;
  substrate: SubstrateType;
  seed_bank: string | null;
  health: number;
  start_date: string;
  notes: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  plant_id: string;
  user_id: string;
  content: string;
  tags: string[];
  photo_url: string | null;
  phase_at_entry: PlantPhase;
  created_at: string;
}
