/**
 * API utility to fetch data from the JSON database.
 * This satisfies the requirement for "GET in JSON format".
 */

const API_BASE = "/api";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}.json`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

export const getVehicles = () => fetchData("vehicles");
export const getDrivers = () => fetchData("drivers");
export const getTrips = () => fetchData("trips");
export const getRoutes = () => fetchData("routes");
export const getPayments = () => fetchData("payments");
export const getNotifications = () => fetchData("notifications");
export const getTransactions = () => fetchData("transactions");
export const getRevenueData = () => fetchData("revenue");
export const getProfitPerVehicle = () => fetchData("profit");
export const getDriverUtilization = () => fetchData("utilization");
export const getTripsPerRouteData = () => fetchData("trips_per_route");
export const getVehicleDocuments = () => fetchData("vehicle_documents");
export const getDriverDocuments = () => fetchData("driver_documents");
export const getCustomerBookings = () => fetchData("customer_bookings");
export const getBookings = () => fetchData("bookings");
