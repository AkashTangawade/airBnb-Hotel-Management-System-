import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, DollarSign, ArrowLeft, Calendar, Users, Wifi, Car, Utensils, Coffee, Tv, Wind, Bath, Bed, Power } from 'lucide-react'
import { hotelService } from '../services/hotelService'
import { reviewService } from '../services/reviewService'
import { useAuth } from '../context/AuthContext'

const HotelDetail = () => {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [activating, setActivating] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchHotelDetails()
    fetchReviews()
  }, [id])

  const fetchHotelDetails = async () => {
    setLoading(true)
    try {
      console.log('Fetching hotel details for ID:', id)
      const response = await hotelService.getHotelById(id)
      console.log('Hotel response:', response)
      console.log('Hotel response data:', response.data)
      
      // Backend wraps response in {timeStamp, data, error, message}
      const hotelData = response.data.data
      console.log('Hotel data ID:', hotelData?.id)
      console.log('Hotel data name:', hotelData?.name)
      console.log('Hotel data description:', hotelData?.description)
      console.log('Hotel data:', hotelData)
      
      // If hotel doesn't have id, use the URL id
      if (!hotelData?.id && id) {
        hotelData.id = id
      }
      
      setHotel(hotelData)
      
      // Fetch rooms for this hotel
      try {
        const roomsResponse = await hotelService.getHotelRooms(id)
        console.log('Rooms response:', roomsResponse)
        console.log('Rooms response data:', roomsResponse.data)
        
        // Backend wraps response in {timeStamp, data, error, message}
        let roomsData = []
        if (Array.isArray(roomsResponse.data.data)) {
          roomsData = roomsResponse.data.data
        } else if (roomsResponse.data?.data) {
          roomsData = roomsResponse.data.data
        } else if (roomsResponse.data) {
          roomsData = roomsResponse.data
        }
        
        console.log('Rooms data:', roomsData)
        setRooms(roomsData || [])
      } catch (roomsError) {
        console.error('Error fetching rooms:', roomsError)
        setRooms([])
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error)
      console.error('Error response:', error.response)
      setHotel(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getHotelReviews(id)
      setReviews(response.data.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await reviewService.createReview(id, { rating, comment: reviewText })
      setReviewText('')
      setRating(5)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const handleActivateHotel = async () => {
    setActivating(true)
    try {
      await hotelService.activateHotel(id)
      setHotel({ ...hotel, isActive: true })
    } catch (error) {
      console.error('Error activating hotel:', error)
      alert('Failed to activate hotel')
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Hotel not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="h-96 relative overflow-hidden">
          {hotel.photos && hotel.photos.length > 0 && hotel.photos[0] ? (
            <img
              src={hotel.photos[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop'
              }}
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop"
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{hotel.city}</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{hotel.name}</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="font-medium">{hotel.rating || 'New'}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hotel.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {hotel.isActive ? 'Available' : 'Unavailable'}
            </span>
            {!hotel.isActive && (
              <button
                onClick={handleActivateHotel}
                disabled={activating}
                className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <Power className="h-4 w-4 mr-1" />
                {activating ? 'Activating...' : 'Activate Hotel'}
              </button>
            )}
          </div>

          <p className="text-gray-600 mb-6">{hotel.description || 'No description available'}</p>

          {hotel.contactInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {hotel.contactInfo.address && <p><span className="font-medium">Address:</span> {hotel.contactInfo.address}</p>}
                {hotel.contactInfo.phoneNumber && <p><span className="font-medium">Phone:</span> {hotel.contactInfo.phoneNumber}</p>}
                {hotel.contactInfo.email && <p><span className="font-medium">Email:</span> {hotel.contactInfo.email}</p>}
              </div>
            </div>
          )}

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Hotel Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hotel.isActive && (
            <Link
              to={`/booking/${hotel.id}/1`}
              className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Now
            </Link>
          )}
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
        
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <Bed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No rooms available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <Link
                key={room.id}
                to={`/booking/${hotel.id}/${room.id}`}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
              >
                <div className="h-48 relative overflow-hidden">
                  {room.photos && room.photos.length > 0 && room.photos[0] ? (
                    <img
                      src={room.photos[0]}
                      alt={room.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
                      }}
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop"
                      alt={room.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">${room.basePrice}/night</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{room.type}</h3>
                  
                  <div className="flex items-center gap-4 mb-3 text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{room.capacity} guests</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">{room.totalCount} available</span>
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                            +{room.amenities.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {hotel.isActive && (
                    <div className="w-full text-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium">
                      Book Room
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        
        {user ? (
          <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-colors ${
                      star <= rating ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                rows="4"
                placeholder="Share your experience with this hotel..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="mb-8 bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-4">Please login to write a review</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to review this hotel!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</span>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 mr-1 ${
                              star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelDetail
