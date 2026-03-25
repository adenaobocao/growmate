export default function DiaryPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          diario de cultivo
        </div>

        {/* Empty state */}
        <div className="card flex flex-col items-center py-10 gap-3">
          <span className="text-4xl opacity-50">📓</span>
          <p className="text-xs text-grow-muted text-center font-semibold leading-relaxed max-w-[200px]">
            Registre observacoes diarias com fotos, notas e tags de cada planta.
          </p>
          <p className="text-[10px] text-grow-muted/60">Cadastre uma planta primeiro</p>
        </div>
      </div>
    </div>
  );
}
