import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { Settings, ShieldAlert, Monitor, Info, AlertTriangle } from 'lucide-react';

export default function SystemSettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">System Settings</h1>
        <p className="text-xs text-text-secondary">Audit core app variables, API states, and global layouts.</p>
      </div>

      {/* FUTURE PAGE WARNING */}
      <div className="p-4 rounded-sm bg-info/10 border border-info/20 flex items-start gap-3">
        <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-info uppercase">Future Configuration Page</span>
          <p className="text-[11px] text-text-secondary leading-relaxed max-w-2xl">
            {/* GAP WARNING: No backend do Bookavella, não existem endpoints de configurações técnicas do sistema.
                Esta tela opera como um gabarito visual estático para futuras implementações de infraestrutura. */}
            No backend API endpoints exist to persist or update application settings. This page is temporarily configured as an offline visual layout placeholder for future releases.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: GENERAL SYSTEM INFO */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">General Information</CardTitle>
            <CardDescription className="text-[11px]">Static app parameters for deployment audits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-body text-text-secondary">
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
              <span className="font-semibold text-text-primary">Application Name:</span>
              <span>Bookavella Luxury Hospitality</span>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
              <span className="font-semibold text-text-primary">Contact / Security Email:</span>
              <span>security@bookavella.com</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="font-semibold text-text-primary">Current Deployment State:</span>
              <span className="text-success font-bold">Stable v1.4-Vite</span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: API STATE & INFRASTRUCTURE */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">API & Network Status</CardTitle>
            <CardDescription className="text-[11px]">Visual audit of active network variables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-body text-text-secondary">
            <div className="p-4 rounded-sm bg-background border border-border flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Active Endpoint Base (baseURL):</span>
                <p className="text-[11px] font-mono text-accent mt-0.5">{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold uppercase tracking-wider">
                Online
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: VISUAL THEME TOGGLE */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">System Visual Theme</CardTitle>
            <CardDescription className="text-[11px]">Toggle standard display colors for your admin layout.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-sm border border-border bg-background text-xs">
              <div className="space-y-0.5">
                <h4 className="font-medium text-text-primary">Theme Toggle Switch</h4>
                <p className="text-[10px] text-text-tertiary">Select between deep obsidian dark and clean minimal light.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary capitalize">{theme} theme</span>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  style={{ backgroundColor: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)' }}
                >
                  <span className={cn("pointer-events-none block h-4 w-4 rounded-full bg-[#FFFFFF] shadow-lg ring-0 transition-transform", theme === 'dark' ? "translate-x-4" : "translate-x-0")} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: DANGER ZONE (Placeholder) */}
        <Card className="border-error/30 bg-surface">
          <CardHeader className="border-b border-border pb-4 mb-4">
            <CardTitle className="text-sm font-heading text-error flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-[11px]">System-wide irreversible operations. Use with caution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border text-xs">
              <div>
                <span className="font-semibold text-text-primary block">Clear Application Cache</span>
                <p className="text-[10px] text-text-tertiary mt-0.5">Flush local states, image thumbnails, and query memoizations.</p>
              </div>
              
              <div className="relative group">
                <Button disabled variant="outline" className="h-9 text-xs text-error border-error/30 hover:bg-error/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-not-allowed">
                  Flush Cache
                </Button>
                <span className="absolute bottom-full right-0 mb-2 scale-0 group-hover:scale-100 transition-all duration-fast bg-[#0A0A0B] text-text-secondary text-[10px] p-2 rounded-sm border border-border shadow-lg whitespace-nowrap z-20 pointer-events-none">
                  Endpoint pending: POST /Admin/System/flush-cache
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 text-xs">
              <div>
                <span className="font-semibold text-text-primary block">Reset Platform Settings</span>
                <p className="text-[10px] text-text-tertiary mt-0.5">Restore all system values and global parameters to baseline defaults.</p>
              </div>

              <div className="relative group">
                <Button disabled variant="destructive" className="h-9 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-not-allowed">
                  Hard Reset
                </Button>
                <span className="absolute bottom-full right-0 mb-2 scale-0 group-hover:scale-100 transition-all duration-fast bg-[#0A0A0B] text-text-secondary text-[10px] p-2 rounded-sm border border-border shadow-lg whitespace-nowrap z-20 pointer-events-none">
                  Endpoint pending: POST /Admin/System/reset
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}