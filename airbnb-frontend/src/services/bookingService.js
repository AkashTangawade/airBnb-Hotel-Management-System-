import api from './api'

export const bookingService = {
  createBooking: (hotelId, roomId, bookingData) => 
    api.post(`/bookings/hotels/${hotelId}/rooms/${roomId}`, bookingData),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
}
