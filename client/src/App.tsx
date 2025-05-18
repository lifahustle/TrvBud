import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Stays from "./pages/Stays";
import Transport from "./pages/Transport";
import MyTrips from "./pages/MyTrips";
import MoneyManagement from "./pages/MoneyManagement";
import Visas from "./pages/Visas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flights" component={Flights} />
      <Route path="/stays" component={Stays} />
      <Route path="/transport" component={Transport} />
      <Route path="/money-management" component={MoneyManagement} />
      <Route path="/visas" component={Visas} />
      <Route path="/my-trips" component={MyTrips} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout>
          <Router />
        </MainLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
