import { type ReactNode } from 'react';
import { useGetCallerUserProfile } from '../../features/profile/useUserProfile';
import LoginButton from '../auth/LoginButton';
import HelpDialog from '../help/HelpDialog';
import InstallAppButton from '../pwa/InstallAppButton';
import { Fuel } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-10 shadow-xs">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-block-accent-1 p-2 rounded-lg">
              <Fuel className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Mileage Tracker</h1>
              {userProfile && (
                <p className="text-xs text-muted-foreground">Hello, {userProfile.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <InstallAppButton />
            <HelpDialog />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-border bg-surface-subtle/60 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
