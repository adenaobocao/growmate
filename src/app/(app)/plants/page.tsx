export default function PlantsPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          minhas plantas
        </div>

        {/* Empty state */}
        <button className="w-full border-[1.5px] border-dashed border-[rgba(41,181,84,0.18)] bg-[rgba(41,181,84,0.02)] flex items-center justify-center gap-2 min-h-[68px] cursor-pointer rounded-2xl hover:bg-[rgba(41,181,84,0.06)] transition-colors">
          <span className="text-xl opacity-40">+</span>
          <span className="text-xs font-bold text-[#3d7a45]">Adicionar planta</span>
        </button>
      </div>
    </div>
  );
}
