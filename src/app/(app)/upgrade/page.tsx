export default function UpgradePage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-6 pb-24 flex flex-col items-center">
        {/* Badge */}
        <div className="w-20 h-20 rounded-3xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center text-4xl mb-6">
          🌿
        </div>

        <h2 className="font-display text-xl font-black text-white text-center">
          GrowMate <span className="text-grow-primary">PRO</span>
        </h2>
        <p className="text-xs text-grow-muted mt-2 text-center">
          Leve seu cultivo ao proximo nivel
        </p>

        {/* Price */}
        <div className="mt-6 text-center">
          <span className="text-3xl font-black text-white">R$9,90</span>
          <span className="text-xs text-grow-muted font-semibold">/mes</span>
        </div>

        {/* Features */}
        <div className="w-full mt-8 flex flex-col gap-3">
          {[
            { icon: "🌱", title: "Ate 6 plantas", desc: "vs 1 no plano gratuito" },
            { icon: "🤖", title: "Chat IA ilimitado", desc: "vs 10 msgs/dia no gratuito" },
            { icon: "📊", title: "Historico completo", desc: "Chat e diario sem limite" },
            { icon: "📸", title: "Diagnostico por foto", desc: "IA analisa suas folhas" },
            { icon: "🔔", title: "Alertas proativos", desc: "Risco de pragas, nutrientes" },
          ].map((f) => (
            <div key={f.title} className="card flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <div className="text-xs font-bold text-grow-text">{f.title}</div>
                <div className="text-[10px] text-grow-muted font-medium mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-primary w-full mt-8 text-sm font-bold py-3.5">
          Assinar PRO — R$9,90/mes
        </button>
        <p className="text-[10px] text-grow-muted mt-3 text-center">
          PIX, cartao ou boleto. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}
