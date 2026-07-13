export default function AdminDashboardPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 font-heading">
          Painel de Administração Global
        </h1>
        <p className="text-xs text-zinc-500">Controles de infraestrutura, moderação de conteúdo e auditoria.</p>
      </div>
      <div className="h-64 border border-dashed border-[#27272A] rounded-lg flex items-center justify-center text-xs text-zinc-600 bg-[#09090B]">
        Widgets e Painel Estatístico (Charts) serão montados aqui
      </div>
    </div>
  );
}