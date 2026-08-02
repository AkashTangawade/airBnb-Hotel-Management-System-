import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { MapPin, Star, DollarSign, Search, Filter, Sparkles, Building2, Heart, TrendingUp, Award, Clock } from 'lucide-react'
import { hotelService } from '../services/hotelService'

const HotelList = () => {
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [featuredHotels, setFeaturedHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('city') || ''
  })

  useEffect(() => {
    fetchHotels()
  }, [])

  // Debounced search - only run when search changes and allHotels is loaded
  useEffect(() => {
    if (allHotels.length > 0) {
      const timer = setTimeout(() => {
        filterHotels()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [filters.search])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      console.log('Fetching hotels with city:', filters.search)
      let response
      
      // If city is provided in URL or search, use backend search endpoint
      if (filters.search) {
        console.log('Calling search endpoint with city:', filters.search)
        response = await hotelService.searchHotels(filters.search)
      } else {
        console.log('Calling active hotels endpoint')
        response = await hotelService.getActiveHotels()
      }
      
      console.log('Full response:', response)
      console.log('Response data:', response.data)
      console.log('Response status:', response.status)
      
      // Try different response structures
      let hotelsData = []
      if (response.data?.data) {
        hotelsData = response.data.data
      } else if (response.data) {
        hotelsData = response.data
      } else if (Array.isArray(response)) {
        hotelsData = response
      }
      
      console.log('Hotels data:', hotelsData)
      console.log('Hotels count:', hotelsData.length)
      
      // Log each hotel's details
      hotelsData.forEach((hotel, index) => {
        console.log(`Hotel ${index + 1}:`, {
          id: hotel.id,
          name: hotel.name,
          city: hotel.city,
          isActive: hotel.isActive
        })
      })
      
      setAllHotels(hotelsData)
      setHotels(hotelsData)
      // Set featured hotels (first 3 or random selection)
      setFeaturedHotels(hotelsData.slice(0, 3))
    } catch (error) {
      console.error('Error fetching hotels:', error)
      console.error('Error response:', error.response)
      setAllHotels([])
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const filterHotels = () => {
    let filtered = allHotels

    // Filter by search term (name, city, or amenities)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(hotel =>
        hotel.name?.toLowerCase().includes(searchTerm) ||
        hotel.city?.toLowerCase().includes(searchTerm) ||
        hotel.amenities?.some(amenity => amenity.toLowerCase().includes(searchTerm))
      )
    }

    // Note: Price filtering would need room data, which is not available at hotel level
    // For now, we'll skip price filtering or it would need to be done on the backend

    setHotels(filtered)
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading amazing hotels...</p>
      </div>
    )
  }

  const stats = {
    total: allHotels.length,
    available: allHotels.filter(h => h.isActive).length,
    featured: featuredHotels.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Discover Amazing Hotels
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find your perfect stay from our curated collection of premium hotels worldwide
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Hotels</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Available Now</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{stats.available}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Featured</p>
                <p className="text-4xl font-bold text-purple-600 mt-1">{stats.featured}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Stay</h2>
              <p className="text-gray-500 text-sm">Search by hotel name, city, or amenities</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotels... (e.g., 'New York', 'beachfront', 'wifi')"
              className="w-full border-2 border-gray-200 rounded-2xl pl-14 pr-6 py-4 text-lg focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Featured Hotels Section */}
        {featuredHotels.length > 0 && !filters.search && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Hotels</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.id}`}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-yellow-200 hover:border-yellow-400"
                >
                  <div className="h-64 relative overflow-hidden">
                    {hotel.photos && hotel.photos.length > 0 && hotel.photos[0] ? (
                      <img
                        src={hotel.photos[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-white/90">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{hotel.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Hotels Section */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filters.search ? `Search Results (${hotels.length})` : 'All Hotels'}
          </h2>
        </div>

        {hotels.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No hotels found</h2>
            <p className="text-gray-500 mb-8 text-lg">Try adjusting your search or explore all our available hotels</p>
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              View All Hotels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200"
              >
                <div className="h-56 relative overflow-hidden">
                  {hotel.photos && hotel.photos.length > 0 && hotel.photos[0] ? (
                    <img
                      src={hotel.photos[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
                      }}
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                      hotel.isActive 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {hotel.isActive ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Heart className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    {hotel.rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span className="text-sm font-semibold text-yellow-700">{hotel.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-sm font-medium">{hotel.city}</span>
                  </div>
                  {hotel.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                  )}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 px-3 py-1 rounded-lg text-xs font-medium">
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelList
