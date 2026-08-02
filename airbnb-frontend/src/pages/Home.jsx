import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home as HomeIcon, DollarSign, HeadphonesIcon, X, Sparkles, TrendingUp, Shield, Clock, Star, ArrowRight } from 'lucide-react'

const Home = () => {
  const [city, setCity] = useState('')
  const [activeModal, setActiveModal] = useState(null)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (city) {
      navigate(`/hotels?city=${city}`)
    }
  }

  const features = {
    uniqueHomes: {
      icon: HomeIcon,
      title: 'Unique Homes',
      description: 'Find one-of-a-kind places to stay',
      color: 'from-purple-500 to-indigo-600',
      details: [
        'Handpicked unique properties worldwide',
        'Treehouses, castles, houseboats, and more',
        'Verified hosts with exceptional reviews',
        'Curated collections for every taste',
        'Exclusive access to hidden gems'
      ]
    },
    bestPrices: {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Get the best deals on accommodations',
      color: 'from-green-500 to-emerald-600',
      details: [
        'Price match guarantee',
        'Exclusive member discounts',
        'No hidden fees or charges',
        'Flexible payment options',
        'Last-minute deals up to 50% off'
      ]
    },
    support: {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: "We're here to help you anytime",
      color: 'from-blue-500 to-cyan-600',
      details: [
        'Round-the-clock customer service',
        'Multilingual support team',
        'Instant chat and phone support',
        'Emergency assistance available',
        'Dedicated travel consultants'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')] bg-cover bg-center opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-white text-sm font-medium">Premium Hotel Booking Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Dream Stay
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Discover hotels, homes, and experiences all over the world with our curated collection of premium accommodations
            </p>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all text-lg"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-center gap-8 mt-12 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
                <span className="font-medium">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">50K+ Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Experience the difference with our premium services designed for travelers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(features).map(([key, feature]) => {
            const Icon = feature.icon
            return (
              <button
                key={key}
                onClick={() => setActiveModal(key)}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 text-left"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-red-500 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">10K+</p>
              <p className="text-gray-400">Hotels</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">50K+</p>
              <p className="text-gray-400">Happy Guests</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">100+</p>
              <p className="text-gray-400">Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-gray-400">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className={`p-6 bg-gradient-to-r ${features[activeModal].color} rounded-t-3xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {(() => {
                      const Icon = features[activeModal].icon
                      return <Icon className="h-6 w-6 text-white" />
                    })()}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {features[activeModal].title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-lg mb-6">
                {features[activeModal].description}
              </p>
              <div className="space-y-4">
                {features[activeModal].details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-8 h-8 bg-gradient-to-br ${features[activeModal].color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">{detail}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveModal(null)
                  navigate('/hotels')
                }}
                className={`w-full mt-8 bg-gradient-to-r ${features[activeModal].color} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2`}
              >
                Explore Hotels
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
