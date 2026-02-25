import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VocabularyCategory from './pages/VocabularyCategory';
import QuizGame from './pages/QuizGame';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Loader2 } from 'lucide-react';

// Root route component
function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Dashboard route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

// Vocabulary category route
const vocabularyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vocabulary/$category',
  component: VocabularyCategory,
});

// Quiz game route
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/$category',
  component: QuizGame,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, vocabularyRoute, quizRoute]);
const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
