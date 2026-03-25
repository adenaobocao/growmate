import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Endpoint temporario para popular dados de teste
// DELETE depois de usar: GET /api/seed
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // ── Setups ──
  const setups = [
    {
      user_id: user.id,
      name: "Grow Principal",
      grow_type: "INDOOR",
      city: "Curitiba",
      state: "PR",
      country: "BR",
      tent_type: "Grow Tent",
      tent_width_cm: 120,
      tent_depth_cm: 120,
      tent_height_cm: 200,
      tent_brand: "Mars Hydro",
      max_plants: 4,
    },
    {
      user_id: user.id,
      name: "Estufa Fundo",
      grow_type: "GREENHOUSE",
      city: "Curitiba",
      state: "PR",
      country: "BR",
      tent_type: null,
      tent_width_cm: 300,
      tent_depth_cm: 200,
      tent_height_cm: 250,
      tent_brand: null,
      max_plants: 8,
    },
    {
      user_id: user.id,
      name: "Grow Secagem",
      grow_type: "INDOOR",
      city: "Curitiba",
      state: "PR",
      country: "BR",
      tent_type: "Grow Tent",
      tent_width_cm: 60,
      tent_depth_cm: 60,
      tent_height_cm: 160,
      tent_brand: "Spider Farmer",
      max_plants: 2,
    },
  ];

  const { data: insertedSetups, error: setupError } = await supabase
    .from("setups")
    .insert(setups)
    .select("id, name");

  if (setupError) {
    return NextResponse.json({ error: "Erro setups", details: setupError }, { status: 500 });
  }

  // ── Sub-items para o primeiro setup ──
  const mainSetupId = insertedSetups[0].id;

  const lights = [
    {
      setup_id: mainSetupId,
      type: "LED Quantum Board",
      watts: 240,
      ppfd: 850,
      height_cm: 45,
      cycle: "18/6",
      brand: "Samsung",
      model: "LM301H",
    },
    {
      setup_id: mainSetupId,
      type: "LED Bar",
      watts: 120,
      ppfd: 600,
      height_cm: 50,
      cycle: "18/6",
      brand: "Mars Hydro",
      model: "SP3000",
    },
  ];

  const soils = [
    {
      setup_id: mainSetupId,
      type: "Solo organico",
      brand: "Carolina Soil",
      n_value: 3,
      p_value: 1,
      k_value: 2,
      ph: 6.5,
      volume_liters: 20,
    },
  ];

  const vents = [
    {
      setup_id: mainSetupId,
      type: "Exaustor",
      brand: "Cultilene",
      cfm: 200,
      has_carbon_filter: true,
    },
    {
      setup_id: mainSetupId,
      type: "Ventilador oscilante",
      brand: "Ventisol",
      cfm: 80,
      has_carbon_filter: false,
    },
  ];

  const ferts = [
    {
      setup_id: mainSetupId,
      name: "Bio Grow",
      brand: "BioBizz",
      n_value: 4,
      p_value: 1,
      k_value: 3,
      ec: 1.2,
      ph: 6.2,
      notes: "Fase vegetativa",
    },
    {
      setup_id: mainSetupId,
      name: "Bio Bloom",
      brand: "BioBizz",
      n_value: 1,
      p_value: 3,
      k_value: 4,
      ec: 1.5,
      ph: 6.0,
      notes: "Fase de floracao",
    },
  ];

  // ── Sub-items para a estufa ──
  const greenhouseId = insertedSetups[1].id;

  const lightsGreenhouse = [
    {
      setup_id: greenhouseId,
      type: "Sol natural",
      watts: null,
      ppfd: null,
      height_cm: null,
      cycle: "Fotoperiodo natural",
      brand: null,
      model: null,
    },
  ];

  const soilsGreenhouse = [
    {
      setup_id: greenhouseId,
      type: "Solo vivo",
      brand: "Tropikush",
      n_value: 5,
      p_value: 3,
      k_value: 4,
      ph: 6.8,
      volume_liters: 50,
    },
  ];

  // ── Plantas ──
  const plants = [
    {
      user_id: user.id,
      setup_id: mainSetupId,
      name: "Northern Lights #1",
      strain: "Northern Lights",
      gen_type: "FEM",
      phase: "FLOWER",
      substrate: "SOIL",
      seed_bank: "Royal Queen Seeds",
      health: 92,
      start_date: "2026-01-15",
      notes: "Semana 4 de flora, buds engordando bem",
      archived: false,
    },
    {
      user_id: user.id,
      setup_id: mainSetupId,
      name: "Gorilla Glue Auto",
      strain: "Gorilla Glue",
      gen_type: "AUTO",
      phase: "VEG",
      substrate: "COCO",
      seed_bank: "FastBuds",
      health: 85,
      start_date: "2026-02-20",
      notes: "Crescimento rapido, LST iniciado",
      archived: false,
    },
    {
      user_id: user.id,
      setup_id: greenhouseId,
      name: "Amnesia Haze",
      strain: "Amnesia Haze",
      gen_type: "PHOTO",
      phase: "SEEDLING",
      substrate: "SOIL",
      seed_bank: "Barney's Farm",
      health: 100,
      start_date: "2026-03-18",
      notes: "Recem germinada, primeiras folhas verdadeiras",
      archived: false,
    },
    {
      user_id: user.id,
      setup_id: mainSetupId,
      name: "White Widow Colheita",
      strain: "White Widow",
      gen_type: "FEM",
      phase: "CURING",
      substrate: "SOIL",
      seed_bank: "Greenhouse Seeds",
      health: 70,
      start_date: "2025-10-01",
      notes: "Curando ha 2 semanas em pote de vidro",
      archived: false,
    },
  ];

  // Insert all
  await Promise.all([
    supabase.from("lights").insert([...lights, ...lightsGreenhouse]),
    supabase.from("soils").insert([...soils, ...soilsGreenhouse]),
    supabase.from("vents").insert(vents),
    supabase.from("ferts").insert(ferts),
    supabase.from("plants").insert(plants),
  ]);

  return NextResponse.json({
    ok: true,
    created: {
      setups: insertedSetups.map((s) => s.name),
      lights: lights.length + lightsGreenhouse.length,
      soils: soils.length + soilsGreenhouse.length,
      vents: vents.length,
      ferts: ferts.length,
      plants: plants.length,
    },
  });
}
