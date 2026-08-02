import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import HotelList from './pages/HotelList'
import HotelDetail from './pages/HotelDetail'
import MyBookings from './pages/MyBookings'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hotels" element={<HotelList />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
