import { useState, useEffect, useMemo } from "react";
import { getTrips, getBookings } from "@/lib/api";

export function useTripData(tripId) {
  const [trip, setTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTrips(), getBookings()]).then(([tripsData, bookingsData]) => {
      const currentTrip = tripsData.find((t) => String(t.id) === String(tripId));
      setTrip(currentTrip);
      
      const customBookings = JSON.parse(localStorage.getItem("custom_bookings") || "[]");
      const combinedBookings = [...bookingsData, ...customBookings];
      
      const tripBookings = combinedBookings.filter(b => String(b.tripId) === String(tripId));
      setBookings(tripBookings);

      setLoading(false);
    });
  }, [tripId]);

  const totalExpenses = useMemo(() => (trip?.tripExpences || []).reduce((sum, exp) => sum + exp.ammountRs, 0), [trip]);
  
  const confirmedManifest = useMemo(() => bookings.filter(b => b.status === "CONFIRMED"), [bookings]);
  const collectionTotal = useMemo(() => confirmedManifest.reduce((sum, b) => sum + (b.totalAmount || 0), 0), [confirmedManifest]);
  const collectionPaid = useMemo(() => confirmedManifest.reduce((sum, b) => sum + (b.paidAmount || 0), 0), [confirmedManifest]);
  const collectionPending = collectionTotal - collectionPaid;

  return {
    trip,
    setTrip,
    bookings,
    setBookings,
    loading,
    totalExpenses,
    collectionPending,
    confirmedManifest
  };
}
