import api from './api'

export const reviewService = {
  createReview: (hotelId, reviewData) => 
    api.post(`/reviews/hotels/${hotelId}`, reviewData),
  getHotelReviews: (hotelId) => api.get(`/reviews/hotels/${hotelId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
}
