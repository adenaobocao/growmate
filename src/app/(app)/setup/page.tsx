export default function SetupPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          configuracao do setup
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: "💡", name: "Iluminacao", desc: "LED, HPS, Luz Solar..." },
            { icon: "🌍", name: "Ambiente", desc: "Indoor/Outdoor, cidade" },
            { icon: "🪴", name: "Substrato", desc: "Solo, coco, hidro..." },
            { icon: "💨", name: "Ventilacao", desc: "Exaustor, circulador..." },
            { icon: "🧪", name: "Nutricao", desc: "Produtos, NPK, EC..." },
            { icon: "⛺", name: "Espaco", desc: "Dimensoes do tent" },
          ].map((item) => (
            <button key={item.name} className="card text-left cursor-pointer hover:border-[rgba(41,181,84,0.20)] transition-colors">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <div className="text-[11px] font-bold text-[#d0e8d4]">{item.name}</div>
              <div className="text-[10px] text-grow-muted font-semibold mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
