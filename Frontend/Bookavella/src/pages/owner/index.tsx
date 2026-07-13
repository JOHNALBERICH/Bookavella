export default function OwnerDashboardPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 font-heading">
          Visão Geral do Parceiro
        </h1>
        <p className="text-xs text-zinc-500">Métricas financeiras e reservas consolidadas para suas propriedades.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#18181B] border border-[#27272A] rounded-md space-y-2">
          <p className="text-xs text-zinc-400">Faturamento Mensal</p>
          <p className="text-2xl font-medium text-[#C5A880]">R$ 0,00</p>
        </div>
        <div className="p-6 bg-[#18181B] border border-[#27272A] rounded-md space-y-2">
          <p className="text-xs text-zinc-400">Quartos Ocupados</p>
          <p className="text-2xl font-medium text-zinc-100">0%</p>
        </div>
        <div className="p-6 bg-[#18181B] border border-[#27272A] rounded-md space-y-2">
          <p className="text-xs text-zinc-400">Reservas Ativas</p>
          <p className="text-2xl font-medium text-zinc-100">0</p>
        </div>
      </div>
    </div>
  );
}