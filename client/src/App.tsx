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
import GoogleTranslate from "./pages/GoogleTranslate";
import TravelPlanner from "./pages/TravelPlanner";
import TravelBuddy from "./pages/TravelBuddy";
import BookingManager from "./pages/BookingManager";
import TravelDocuments from "./pages/TravelDocuments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Membership from "./pages/Membership";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flights" component={Flights} />
      <Route path="/stays" component={Stays} />
      <Route path="/transport" component={Transport} />
      <Route path="/money-management" component={MoneyManagement} />
      <Route path="/visas" component={Visas} />
      <Route path="/google-translate" component={GoogleTranslate} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/travel-planner" component={TravelPlanner} />
      <Route path="/travel-buddy" component={TravelBuddy} />
      <Route path="/booking-manager" component={BookingManager} />
      <Route path="/travel-documents" component={TravelDocuments} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/membership" component={Membership} />
      <Route path="/profile" component={Profile} />
      <Route path="/reviews" component={Reviews} />
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
