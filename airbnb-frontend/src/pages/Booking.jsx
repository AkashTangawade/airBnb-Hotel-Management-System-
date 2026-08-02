import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, Users, ArrowLeft, Bed, Wifi, Car, Utensils, Coffee, Tv, Wind, Bath, MapPin, Star } from 'lucide-react'
import { hotelService } from '../services/hotelService'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const Booking = () => {
  const { hotelId, roomId } = useParams()
  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomsCount: 1
  })
  const [error, setError] = useState('')
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchHotelDetails()
    fetchRoomDetails()
  }, [hotelId, roomId, user])

  const fetchHotelDetails = async () => {
    try {
      console.log('Fetching hotel details for booking, hotelId:', hotelId)
      const response = await hotelService.getHotelById(hotelId)
      console.log('Booking hotel response:', response)
      console.log('Booking hotel response data:', response.data)
      
      // Backend wraps response in {timeStamp, data, error, message}
      setHotel(response.data.data)
    } catch (error) {
      console.error('Error fetching hotel details:', error)
      setError('Failed to load hotel details')
    }
  }

  const fetchRoomDetails = async () => {
    try {
      console.log('Fetching room details, hotelId:', hotelId, 'roomId:', roomId)
      const response = await hotelService.getHotelRooms(hotelId)
      console.log('Rooms response:', response)
      console.log('Rooms response data:', response.data)
      
      let roomsData = []
      if (Array.isArray(response.data)) {
        roomsData = response.data
      } else if (response.data?.data) {
        roomsData = response.data.data
      } else if (response.data) {
        roomsData = response.data
      }
      
      console.log('Rooms data:', roomsData)
      console.log('Rooms count:', roomsData.length)
      console.log('Looking for room with id:', roomId, 'type:', typeof roomId)
      
      // Log all room IDs for debugging
      roomsData.forEach((r, i) => {
        console.log(`Room ${i}: id=${r.id}, type=${typeof r.id}, type=${r.type}`)
      })
      
      const selectedRoom = roomsData.find(r => String(r.id) === String(roomId))
      console.log('Selected room:', selectedRoom)
      setRoom(selectedRoom)
    } catch (error) {
      console.error('Error fetching room details:', error)
      console.error('Error response:', error.response)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setError('Please select check-in and check-out dates')
      return
    }

    if (new Date(bookingData.checkInDate) >= new Date(bookingData.checkOutDate)) {
      setError('Check-out date must be after check-in date')
      return
    }

    try {
      await bookingService.createBooking(hotelId, roomId, bookingData)
      addToast('Booking confirmed successfully!', 'success')
      navigate('/my-bookings')
    } catch (error) {
      setError('Failed to create booking. Please try again.')
      addToast('Failed to create booking. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Hotel not found</p>
        <p className="text-gray-400 text-sm mt-2">Hotel ID: {hotelId}</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Room not found</p>
        <p className="text-gray-400 text-sm mt-2">Room ID: {roomId}</p>
        <button
          onClick={() => navigate(`/hotels/${hotelId}`)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Back to Hotel
        </button>
      </div>
    )
  }

  const nights = bookingData.checkInDate && bookingData.checkOutDate
    ? Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))
    : 0

  const totalPrice = nights * (room.basePrice || 0) * bookingData.roomsCount

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return Wifi
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return Car
    if (amenityLower.includes('food') || amenityLower.includes('restaurant') || amenityLower.includes('meal')) return Utensils
    if (amenityLower.includes('coffee') || amenityLower.includes('breakfast')) return Coffee
    if (amenityLower.includes('tv') || amenityLower.includes('television')) return Tv
    if (amenityLower.includes('air') || amenityLower.includes('ac')) return Wind
    if (amenityLower.includes('bath') || amenityLower.includes('shower')) return Bath
    return Star
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 relative overflow-hidden">
              {room.photos && room.photos.length > 0 && room.photos[0] ? (
                <img
                  src={room.photos[0]}
                  alt={room.type}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop'
                  }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop"
                  alt={room.type}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-lg font-bold text-gray-900">${room.basePrice}/night</span>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.type}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hotel.name}, {hotel.city}</span>
              </div>
              
              <div className="flex items-center gap-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{room.totalCount} available</span>
                </div>
              </div>

              {room.description && (
                <p className="text-gray-600 mb-6">
                  {room.description}
                </p>
              )}

              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Room Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.map((amenity, index) => {
                      const Icon = getAmenityIcon(amenity)
                      return (
                        <div key={index} className="flex items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                          <Icon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Hotel Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Room</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={bookingData.checkInDate}
                  onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={bookingData.checkOutDate}
                  onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                  required
                  min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  max={room.totalCount}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={bookingData.roomsCount}
                  onChange={(e) => setBookingData({ ...bookingData, roomsCount: parseInt(e.target.value) })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
              >
                Confirm Booking
              </button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4" />
                    <span>{room.basePrice}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of nights</span>
                  <span>{nights}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of rooms</span>
                  <span>{bookingData.roomsCount}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5" />
                    <span>{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Payment will be processed after booking confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
