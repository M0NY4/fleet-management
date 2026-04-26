import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VehiclesPage from "./pages/VehiclesPage";
import DriversPage from "./pages/DriversPage";
import NotificationsPage from "./pages/NotificationsPage";
import FinancePage from "./pages/FinancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CreateBookingPage from "./pages/CreateBookingPage";
import TripListPage from "./pages/TripListPage";
import TripLogisticsPage from "./pages/TripLogisticsPage";
import TripBookingsPage from "./pages/TripBookingsPage";
import TripExpensesPage from "./pages/TripExpensesPage";
import PaymentsPage from "./pages/PaymentsPage";
import PublicBookingPage from "./pages/PublicBookingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/vehicles" replace />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/create-booking" element={<CreateBookingPage />} />
          <Route path="/trips" element={<TripListPage />} />
          <Route path="/trips/:tripId" element={<Navigate to="logistics" replace />} />
          <Route path="/trips/:tripId/logistics" element={<TripLogisticsPage />} />
          <Route path="/trips/:tripId/bookings" element={<TripBookingsPage />} />
          <Route path="/trips/:tripId/expenses" element={<TripExpensesPage />} />
          <Route path="/public/booking/:tripId" element={<PublicBookingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
