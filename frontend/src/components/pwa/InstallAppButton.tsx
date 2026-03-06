import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePwaInstall } from '../../features/pwa/usePwaInstall';

export default function InstallAppButton() {
  const { isInstallable, promptInstall } = usePwaInstall();

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      onClick={promptInstall}
      variant="outline"
      size="default"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Install app
    </Button>
  );
}
