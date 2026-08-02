import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, LogOut, Edit2, CreditCard, Wallet, Tag, ArrowLeft, Phone, MapPin, Shield, Bell, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { bookingService } from '../services/bookingService'

const Profile = () => {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({ name: '', email: '', phone: '', address: '' })
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  // Mock data for wallet and offers
  const walletData = {
    balance: 2500,
    currency: 'USD',
    transactions: [
      { id: 1, type: 'credit', amount: 500, description: 'Refund for cancelled booking', date: '2024-07-15' },
      { id: 2, type: 'debit', amount: 300, description: 'Booking payment', date: '2024-07-10' },
      { id: 3, type: 'credit', amount: 2000, description: 'Wallet recharge', date: '2024-07-01' },
    ]
  }

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/24', isDefault: false },
  ]

  const offers = [
    { id: 1, code: 'SUMMER20', discount: '20%', description: 'Summer special discount', expiry: '2024-08-31', minOrder: 100 },
    { id: 2, code: 'WELCOME10', discount: '10%', description: 'Welcome offer for new users', expiry: '2024-12-31', minOrder: 50 },
    { id: 3, code: 'WEEKEND15', discount: '15%', description: 'Weekend booking discount', expiry: '2024-09-30', minOrder: 200 },
  ]

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setEditedUser({ name: user.name, email: user.email, phone: user.phone || '', address: user.address || '' })
    fetchBookings()
  }, [user, navigate])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await bookingService.getMyBookings()
      setBookings(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    addToast('Profile updated successfully!', 'success')
  }

  if (!user) {
    return null
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
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 h-32"></div>
            <div className="px-6 pb-6">
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={editedUser.address}
                      onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{user.address}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors mb-3"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Total Bookings</span>
                </div>
                <span className="font-semibold text-gray-900">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Wallet className="h-4 w-4 mr-2" />
                  <span>Wallet Balance</span>
                </div>
                <span className="font-semibold text-gray-900">${walletData.balance}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>Available Offers</span>
                </div>
                <span className="font-semibold text-gray-900">{offers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold text-gray-900">2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'overview' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'bookings' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'wallet' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Wallet
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'offers' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Offers
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'payments' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Payments
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-6 text-white">
                      <Wallet className="h-8 w-8 mb-2" />
                      <h3 className="text-lg font-semibold mb-1">Wallet Balance</h3>
                      <p className="text-3xl font-bold">${walletData.balance}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                      <Calendar className="h-8 w-8 mb-2" />
                      <h3 className="text-lg font-semibold mb-1">Total Bookings</h3>
                      <p className="text-3xl font-bold">{bookings.length}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h3>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">Start exploring and book your first stay!</p>
                        <button
                          onClick={() => navigate('/hotels')}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Browse Hotels
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-gray-600 text-sm">
                                    {booking.checkInDate} to {booking.checkOutDate}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    booking.bookingStatus === 'CONFIRMED' 
                                      ? 'bg-green-100 text-green-800'
                                      : booking.bookingStatus === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : booking.bookingStatus === 'CANCELLED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {booking.bookingStatus}
                                  </span>
                                  <span className="text-gray-500 text-sm">{booking.roomsCount} room(s)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                    <button
                      onClick={() => navigate('/hotels')}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      + New Booking
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-6">Start exploring and book your first stay!</p>
                      <button
                        onClick={() => navigate('/hotels')}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Browse Hotels
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-gray-600 text-sm">
                                  {booking.checkInDate} to {booking.checkOutDate}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                <span className="text-gray-600 text-sm">Hotel ID: {booking.hotelId}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.bookingStatus === 'CONFIRMED' 
                                    ? 'bg-green-100 text-green-800'
                                    : booking.bookingStatus === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : booking.bookingStatus === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.bookingStatus}
                                </span>
                                <span className="text-gray-500 text-sm">{booking.roomsCount} room(s)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <Wallet className="h-8 w-8" />
                      <span className="text-sm opacity-90">Available Balance</span>
                    </div>
                    <p className="text-4xl font-bold mb-2">${walletData.balance}</p>
                    <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      + Add Money
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h3>
                    <div className="space-y-3">
                      {walletData.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <span className={`font-semibold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Offers</h2>
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="border-2 border-dashed border-red-300 rounded-xl p-6 bg-red-50">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="h-5 w-5 text-red-600" />
                              <span className="text-2xl font-bold text-red-600">{offer.code}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{offer.description}</p>
                            <p className="text-sm text-gray-500">Min order: ${offer.minOrder}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-red-600">{offer.discount}</p>
                            <p className="text-sm text-gray-500">OFF</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">Expires: {offer.expiry}</p>
                          <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                            Apply Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CreditCard className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{method.type}</p>
                              <p className="text-sm text-gray-500">•••• {method.last4}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                            {method.isDefault && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
