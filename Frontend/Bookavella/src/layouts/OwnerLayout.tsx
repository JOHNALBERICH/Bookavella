import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../@/components/ui/sheet';
import { Button } from '../../@/components/ui/button';
import { Menu } from 'lucide-react';
import OwnerSidebar from '@/components/OwnerSidebar';

export default function OwnerLayout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex bg-background text-text-primary font-body">
      {/* DESKTOP SIDEBAR (Exibida apenas em telas lg e superiores - largura de 240px) */}
      <div className="hidden lg:block w-60 shrink-0 h-screen sticky top-0 z-40">
        <OwnerSidebar collapsed={false} />
      </div>

      {/* TABLET SIDEBAR (Exibida entre md e lg - largura compacta de 64px) */}
      <div className="hidden md:block lg:hidden w-16 shrink-0 h-screen sticky top-0 z-40">
        <OwnerSidebar collapsed={true} />
      </div>

      {/* WRAPPER PRINCIPAL DE CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* BARRA SUPERIOR MOBILE (Exibida apenas abaixo do ponto de quebra md, ou seja, <640px) */}
        <header className="md:hidden h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-40">
          <Link to="/owner" className="font-heading text-xl font-bold tracking-wider text-accent">
            BV / OWNER
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 h-10 w-10 hover:bg-background/50 focus:outline-none">
                <Menu className="h-6 w-6 text-text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-surface border-r border-border p-0 text-text-primary">
              <SheetHeader className="p-6 border-b border-border text-left">
                <SheetTitle className="font-heading text-xl font-bold text-accent">
                  BOOKAVELLA
                </SheetTitle>
              </SheetHeader>
              <OwnerSidebar onItemClick={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* CONTAINER DINÂMICO DE CONTEÚDO */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto overflow-y-auto animate-in fade-in duration-normal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}