import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: Array<{ url: string; isPrimary?: boolean }>;
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback caso a propriedade não contenha imagens registradas no banco
  const galleryImages = images.length > 0 
    ? images 
    : [{ url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200', isPrimary: true }];

  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative font-body">
      {/* DESKTOP: Grid Mosaico (1 Grande + 4 Pequenas) */}
      <div className="hidden md:grid grid-cols-4 gap-3 h-[420px] rounded-lg overflow-hidden border border-border">
        {/* Foto Primária (Destaque Esquerdo) */}
        <div 
          onClick={() => handleOpenLightbox(0)}
          className="relative col-span-2 row-span-2 group overflow-hidden bg-surface cursor-pointer"
        >
          <img 
            src={galleryImages[0].url} 
            alt={alt} 
            className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-normal flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Maximize2 className="h-6 w-6 text-[#FFFFFF]" />
          </div>
        </div>

        {/* Fotos Secundárias (Grid Direito 2x2) */}
        {Array.from({ length: 4 }).map((_, idx) => {
          const targetIdx = idx + 1;
          const img = galleryImages[targetIdx] || galleryImages[0]; // repete a primeira se faltar
          return (
            <div 
              key={idx}
              onClick={() => handleOpenLightbox(targetIdx % galleryImages.length)}
              className="relative group overflow-hidden bg-surface cursor-pointer"
            >
              <img 
                src={img.url} 
                alt={`${alt} view ${targetIdx}`} 
                className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-normal flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Maximize2 className="h-5 w-5 text-[#FFFFFF]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE: Carrossel Deslizante de Alta Performance (CSS Scroll Snap) */}
      <div className="flex md:hidden snap-x snap-mandatory overflow-x-auto gap-3 scrollbar-none h-64 rounded-md border border-border">
        {galleryImages.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => handleOpenLightbox(idx)}
            className="snap-center shrink-0 w-full h-full relative"
          >
            <img 
              src={img.url} 
              alt={`${alt} view mobile ${idx}`} 
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border px-2 py-0.5 rounded-sm text-[10px] text-text-secondary font-bold">
              {idx + 1} / {galleryImages.length}
            </span>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL (Full-screen Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0A0A0B]/95 flex items-center justify-center p-4 md:p-8 transition-opacity duration-normal"
          onClick={() => setIsOpen(false)}
        >
          {/* Botão de Fechar */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 h-10 w-10 bg-surface border border-border text-text-secondary hover:text-text-primary rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navegação - Esquerda */}
          <button 
            onClick={handlePrev}
            className="absolute left-6 h-12 w-12 bg-surface/80 border border-border text-text-secondary hover:text-[#FFFFFF] rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Imagem Ampliada */}
          <div className="max-w-5xl max-h-[80vh] overflow-hidden rounded-md border border-border shadow-2xl bg-black">
            <img 
              src={galleryImages[currentIndex].url} 
              alt={alt} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navegação - Direita */}
          <button 
            onClick={handleNext}
            className="absolute right-6 h-12 w-12 bg-surface/80 border border-border text-text-secondary hover:text-[#FFFFFF] rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 active:scale-95"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Contador de Imagem */}
          <span className="absolute bottom-6 font-body text-xs text-text-secondary">
            {currentIndex + 1} of {galleryImages.length}
          </span>
        </div>
      )}
    </div>
  );
}