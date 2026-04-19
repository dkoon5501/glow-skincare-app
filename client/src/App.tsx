import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MyRoutines from "@/pages/my-routines";
import SharedResults from "@/pages/shared-results";
import SharedVitaResults from "@/pages/shared-vita-results";
import RateMyRoutine from "@/pages/rate-my-routine";
import MainLanding from "@/pages/main-landing";
import VitaHome from "@/pages/vita-home";

function AppRouter() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={MainLanding} />
        <Route path="/glow" component={Home} />
        <Route path="/vita" component={VitaHome} />
        <Route path="/my-routines" component={MyRoutines} />
        <Route path="/r/:encoded" component={SharedResults} />
        <Route path="/v/:encoded" component={SharedVitaResults} />
        <Route path="/rate-my-routine" component={RateMyRoutine} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
