const GUIDES = [
  { id: "setup", icon: "🏕️", bg: "bg-grow-primary/10", title: "Set & Setting", desc: "Espaco, luz, ventilacao, temperatura e VPD" },
  { id: "phases", icon: "🌿", bg: "bg-grow-secondary/10", title: "Fases do Cultivo", desc: "Germinacao, muda, veg, floracao, colheita" },
  { id: "nutrients", icon: "🧪", bg: "bg-grow-warning/10", title: "Nutricao & pH", desc: "NPK, micronutrientes, deficiencias, EC" },
  { id: "diseases", icon: "🔬", bg: "bg-grow-danger/10", title: "Doencas & Pragas", desc: "Fungos, acaros, mosca-branca, oidio" },
  { id: "training", icon: "✂️", bg: "bg-grow-info/10", title: "Tecnicas de Treino", desc: "LST, topping, FIM, SCROG, defolha" },
  { id: "harvest", icon: "🔭", bg: "bg-purple-500/10", title: "Colheita & Cura", desc: "Tricomas, flush, secagem, cura em pote" },
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
              className="bg-grow-surface-alt border border-grow-border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-grow-tint transition-colors text-left w-full"
            >
              <div
                className={`w-11 h-11 rounded-[15px] flex-shrink-0 flex items-center justify-center text-xl ${guide.bg}`}
              >
                {guide.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-grow-text">{guide.title}</div>
                <div className="text-[11px] text-grow-muted font-medium mt-0.5 leading-relaxed">{guide.desc}</div>
              </div>
              <span className="text-base text-grow-tertiary flex-shrink-0">&#8250;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
