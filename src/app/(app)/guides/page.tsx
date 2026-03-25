const GUIDES = [
  { id: "setup", icon: "🏕️", bg: "rgba(41,181,84,0.09)", title: "Set & Setting", desc: "Espaco, luz, ventilacao, temperatura e VPD" },
  { id: "phases", icon: "🌿", bg: "rgba(126,211,72,0.09)", title: "Fases do Cultivo", desc: "Germinacao, muda, veg, floracao, colheita" },
  { id: "nutrients", icon: "🧪", bg: "rgba(245,158,11,0.09)", title: "Nutricao & pH", desc: "NPK, micronutrientes, deficiencias, EC" },
  { id: "diseases", icon: "🔬", bg: "rgba(244,63,94,0.09)", title: "Doencas & Pragas", desc: "Fungos, acaros, mosca-branca, oidio" },
  { id: "training", icon: "✂️", bg: "rgba(6,182,212,0.09)", title: "Tecnicas de Treino", desc: "LST, topping, FIM, SCROG, defolha" },
  { id: "harvest", icon: "🔭", bg: "rgba(167,139,250,0.09)", title: "Colheita & Cura", desc: "Tricomas, flush, secagem, cura em pote" },
];

export default function GuidesPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          guias de cultivo
        </div>
        <div className="flex flex-col gap-2">
          {GUIDES.map((guide) => (
            <button
              key={guide.id}
              className="bg-[rgba(10,22,12,0.55)] border border-[rgba(41,181,84,0.08)] rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[rgba(41,181,84,0.05)] transition-colors text-left w-full"
            >
              <div
                className="w-11 h-11 rounded-[15px] flex-shrink-0 flex items-center justify-center text-xl"
                style={{ background: guide.bg }}
              >
                {guide.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[#d0e8d4]">{guide.title}</div>
                <div className="text-[11px] text-grow-muted font-medium mt-0.5 leading-relaxed">{guide.desc}</div>
              </div>
              <span className="text-base text-[#2a4a32] flex-shrink-0">&#8250;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
