import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './features/profile/useUserProfile';
import OnboardingScreen from './components/onboarding/OnboardingScreen';
import ProfileSetupDialog from './components/profile/ProfileSetupDialog';
import AppShell from './components/layout/AppShell';
import Dashboard from './components/dashboard/Dashboard';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show onboarding for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        <OnboardingScreen />
        <Toaster />
      </>
    );
  }

  // Show profile setup if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <AppShell>
        {showProfileSetup ? (
          <ProfileSetupDialog open={true} />
        ) : (
          <Dashboard />
        )}
      </AppShell>
      <Toaster />
    </>
  );
}
