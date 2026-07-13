export default function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#FAFAFA] font-body">
      {/* Mock Navbar (Cabeçalho de Simulação) */}
      <div className="h-16 border-b border-[#1F1F23] bg-[#111113]/50 px-6 flex items-center justify-between animate-pulse">
        {/* Brand Logo Box */}
        <div className="h-5 w-32 bg-[#1F1F23] rounded-sm" />
        {/* Nav Links Box */}
        <div className="flex items-center gap-6">
          <div className="h-3 w-16 bg-[#1F1F23]/60 rounded-sm hidden sm:block" />
          <div className="h-3 w-16 bg-[#1F1F23]/60 rounded-sm hidden sm:block" />
          <div className="h-8 w-8 bg-[#1F1F23]/60 rounded-full" />
        </div>
      </div>

      {/* Mock Content Area (Corpo de Simulação) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10 animate-pulse">
        {/* Page Header Simulado */}
        <div className="space-y-3">
          <div className="h-8 w-56 bg-[#1F1F23] rounded-sm" />
          <div className="h-3.5 w-full max-w-md bg-[#1F1F23]/60 rounded-sm" />
        </div>

        {/* Mosaico ou Grade Simétrica de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-[#111113] border border-[#1F1F23] rounded-lg space-y-4"
            >
              <div className="aspect-video w-full bg-[#1F1F23]/80 rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-[#1F1F23] rounded-sm" />
                <div className="h-3 w-1/2 bg-[#1F1F23]/60 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}