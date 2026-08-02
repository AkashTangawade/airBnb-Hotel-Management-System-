import api from './api'

export const hotelService = {
  getAllHotels: () => api.get('/hotels'),
  getHotelById: (id) => api.get(`/admin/hotels/${id}`),
  searchHotels: (city) => api.get(`/search/hotels/city/${city}`),
  searchHotelsWithFilters: (city, minPrice, maxPrice) => 
    api.get(`/search/hotels`, { params: { city, minPrice, maxPrice } }),
  getActiveHotels: () => api.get('/search/hotels/active'),
  getHotelRooms: (hotelId) => api.get(`/admin/hotels/${hotelId}/rooms`),
  activateHotel: (id) => api.patch(`/admin/hotels/${id}`),
}
