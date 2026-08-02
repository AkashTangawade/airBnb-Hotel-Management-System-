import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, XCircle, ArrowLeft, Clock, Users, Building2, CreditCard, Sparkles, Filter } from 'lucide-react'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await bookingService.getMyBookings()
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId)
      addToast('Booking cancelled successfully', 'success')
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      addToast('Failed to cancel booking', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your bookings...</p>
      </div>
    )
  }

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.bookingStatus.toLowerCase() === filter)

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length,
    pending: bookings.filter(b => b.bookingStatus === 'PENDING').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'CANCELLED').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 md:mb-0 font-medium bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-gray-500 mt-2">Manage your hotel reservations</p>
          </div>
          <button
            onClick={() => navigate('/hotels')}
            className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium mt-4 md:mt-0"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Book New Stay
          </button>
        </div>

        {/* Stats Cards */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === 'confirmed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Cancelled
            </button>
          </div>
        )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No bookings yet</h2>
          <p className="text-gray-500 mb-8 text-lg">Start exploring amazing hotels and book your first memorable stay!</p>
          <button
            onClick={() => navigate('/hotels')}
            className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Browse Hotels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.bookingStatus === 'CONFIRMED' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                          : booking.bookingStatus === 'PENDING'
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                          : booking.bookingStatus === 'CANCELLED'
                          ? 'bg-gradient-to-r from-red-100 to-red-100 text-red-700 border border-red-200'
                          : 'bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {booking.bookingStatus === 'CONFIRMED' && <Sparkles className="h-4 w-4 mr-2" />}
                        {booking.bookingStatus === 'PENDING' && <Clock className="h-4 w-4 mr-2" />}
                        {booking.bookingStatus === 'CANCELLED' && <XCircle className="h-4 w-4 mr-2" />}
                        {booking.bookingStatus}
                      </span>
                    </div>

                    {/* Date Section */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Stay Duration</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {booking.checkInDate} <span className="text-gray-400 mx-2">→</span> {booking.checkOutDate}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Building2 className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Hotel ID</p>
                          <p className="font-semibold text-gray-900">#{booking.hotelId}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Users className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Rooms</p>
                          <p className="font-semibold text-gray-900">{booking.roomsCount} {booking.roomsCount === 1 ? 'Room' : 'Rooms'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <CreditCard className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Booking ID</p>
                          <p className="font-semibold text-gray-900">#{booking.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    {booking.bookingStatus !== 'CANCELLED' && (
                      <>
                    <button
                      onClick={() => navigate(`/hotels/${booking.hotelId}`)}
                      className="w-full lg:w-auto inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View Hotel
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full lg:w-auto inline-flex items-center justify-center bg-white text-red-600 border-2 border-red-200 px-6 py-3 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-medium"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </button>
                      </>
                    )}
                    {booking.bookingStatus === 'CANCELLED' && (
                      <div className="px-4 py-2 bg-gray-100 rounded-xl text-gray-500 text-sm font-medium">
                        Booking cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default MyBookings
