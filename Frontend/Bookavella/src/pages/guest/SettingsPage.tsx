import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { User, Monitor, Bell, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications' | 'security'>('appearance');
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage your account preferences, visual appearance, and security settings.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border space-x-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap focus:outline-none",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-text-primary">Profile Information</CardTitle>
              <CardDescription>
                Personal details such as name, phone, gender, and nationality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-sm bg-background border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">{currentUser?.name || "No name configured"}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{currentUser?.email}</p>
                </div>
                <Link
                  to="/guest/profile"
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Edit Profile in Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-text-primary">Visual Theme</CardTitle>
              <CardDescription>
                Customize how Bookavella looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-sm border border-border bg-background">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium text-text-primary">Dark Mode first</h4>
                  <p className="text-xs text-text-secondary">
                    Switch between deep obsidian dark and clean minimal light.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary capitalize">{theme} theme</span>
                  
                  {/* Switch Component customizado em CSS Puro - Alinhado à Vercel e zero dependências */}
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)' }}
                  >
                    <span
                      className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-[#FFFFFF] shadow-lg ring-0 transition-transform",
                        theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <Card className="bg-surface border-border opacity-70">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-text-primary">Notification Preferences</CardTitle>
              <CardDescription>
                Coming soon. Manage booking confirmations and email alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center border border-dashed border-border rounded-sm bg-background/50">
              <p className="text-xs text-text-tertiary">Notification controls are currently undergoing maintenance.</p>
            </CardContent>
          </Card>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <Card className="bg-surface border-border opacity-70">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-text-primary">Security Settings</CardTitle>
              <CardDescription>
                Coming soon. Change your entry keys and active sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center border border-dashed border-border rounded-sm bg-background/50">
              <p className="text-xs text-text-tertiary">Session audits and password change flows will release in Phase 3.</p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}