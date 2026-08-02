# Airbnb Clone - Hotel Management System

A full-stack Airbnb clone application with Spring Boot backend and React frontend.

## 🚀 Features Implemented

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Hotel Management**: CRUD operations for hotels with activation/deactivation
- **Room Management**: Room management within hotels
- **Booking System**: Complete booking flow with date selection and room availability
- **Inventory Management**: Room availability tracking with surge pricing
- **Search & Filtering**: Search hotels by city, name, and price range
- **Review System**: Users can rate and review hotels
- **Payment Integration**: Stripe integration for payment processing
- **Security**: Spring Security with JWT authentication and CORS configuration

### Frontend Features
- **Modern UI**: React with TailwindCSS for beautiful, responsive design
- **Authentication Pages**: Login and registration with form validation
- **Hotel Listing**: Searchable hotel list with filters
- **Hotel Details**: Detailed hotel view with reviews and booking options
- **Booking Flow**: Complete booking process with date selection and price calculation
- **User Dashboard**: View and manage personal bookings
- **Navigation**: Responsive navbar with user authentication state

## 📋 Prerequisites

- Java 22
- Maven
- PostgreSQL (running on localhost:5432)
- Node.js and npm
- Stripe account (for payment features)

## 🛠️ Installation & Setup

### Backend Setup

1. **Database Configuration**
   - Create PostgreSQL database named `airBnb`
   - Update `src/main/resources/application.properties` with your credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/airBnb
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

2. **Stripe Configuration**
   - Get your Stripe secret key from Stripe dashboard
   - Update in `application.properties`:
   ```properties
   stripe.secret.key=sk_test_your_stripe_secret_key_here
   ```

3. **Run Backend**
   ```bash
   cd E:\Projects\airBnbApp
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd E:\Projects\airbnb-frontend
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

### Hotel Endpoints

#### Create Hotel
- **POST** `/api/hotels`
- **Body**:
  ```json
  {
    "name": "Grand Hotel",
    "city": "New York",
    "address": "123 Main St",
    "pricePerNight": 150,
    "description": "Luxury hotel in downtown"
  }
  ```

#### Get All Hotels
- **GET** `/api/hotels`

#### Get Hotel by ID
- **GET** `/api/hotels/{id}`

#### Update Hotel
- **PUT** `/api/hotels/{id}`
- **Body**: Same as create hotel

#### Delete Hotel
- **DELETE** `/api/hotels/{id}`

#### Activate Hotel
- **POST** `/api/hotels/{id}/activate`

### Room Endpoints

#### Create Room
- **POST** `/api/rooms/{hotelId}`
- **Body**:
  ```json
  {
    "type": "DELUXE",
    "price": 200,
    "totalCount": 10
  }
  ```

#### Get All Rooms in Hotel
- **GET** `/api/rooms/hotel/{hotelId}`

#### Get Room by ID
- **GET** `/api/rooms/{roomId}`

#### Delete Room
- **DELETE** `/api/rooms/{roomId}`

### Booking Endpoints

#### Create Booking
- **POST** `/api/bookings/hotels/{hotelId}/rooms/{rid}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "checkInDate": "2024-01-15",
    "checkOutDate": "2024-01-20",
    "roomsCount": 2
  }
  ```

#### Get Booking by ID
- **GET** `/api/bookings/{bookingId}`
- **Headers**: `Authorization: Bearer <token>`

#### Get User's Bookings
- **GET** `/api/bookings/my-bookings`
- **Headers**: `Authorization: Bearer <token>`

#### Cancel Booking
- **PATCH** `/api/bookings/{bookingId}/cancel`
- **Headers**: `Authorization: Bearer <token>`

### Search Endpoints

#### Search by City
- **GET** `/api/search/hotels/city/{city}`

#### Search by Name
- **GET** `/api/search/hotels/name/{name}`

#### Search with Filters
- **GET** `/api/search/hotels?city={city}&minPrice={min}&maxPrice={max}`

#### Get All Active Hotels
- **GET** `/api/search/hotels/active`

### Review Endpoints

#### Create Review
- **POST** `/api/reviews/hotels/{hotelId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Amazing stay!"
  }
  ```

#### Get Hotel Reviews
- **GET** `/api/reviews/hotels/{hotelId}`

#### Get User's Reviews
- **GET** `/api/reviews/my-reviews`
- **Headers**: `Authorization: Bearer <token>`

#### Update Review
- **PUT** `/api/reviews/{reviewId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "rating": 4,
    "comment": "Updated review"
  }
  ```

#### Delete Review
- **DELETE** `/api/reviews/{reviewId}`
- **Headers**: `Authorization: Bearer <token>`

### Payment Endpoints

#### Create Payment Intent
- **POST** `/api/payments/create-intent?amount=100&currency=usd`
- **Headers**: `Authorization: Bearer <token>`

#### Confirm Payment
- **POST** `/api/payments/confirm/{paymentIntentId}`
- **Headers**: `Authorization: Bearer <token>`

#### Get Payment
- **GET** `/api/payments/{paymentId}`
- **Headers**: `Authorization: Bearer <token>`

### Inventory Endpoints

#### Create Inventory
- **POST** `/api/inventory`
- **Body**:
  ```json
  {
    "hotelId": 1,
    "roomId": 1,
    "date": "2024-01-15",
    "totalCount": 10,
    "surgeFactor": 1.0,
    "price": 150,
    "city": "New York",
    "closed": false
  }
  ```

#### Get Inventory by Room and Date Range
- **GET** `/api/inventory/rooms/{roomId}?startDate=2024-01-15&endDate=2024-01-20`

#### Get Available Rooms
- **GET** `/api/inventory/available?checkIn=2024-01-15&checkOut=2024-01-20&city=New York`

#### Delete Inventory
- **DELETE** `/api/inventory/{inventoryId}`

## 📁 Project Structure

### Backend Structure
```
src/main/java/com/akash/projects/airBnbApp/
├── config/
│   ├── MapperConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── HotelController.java
│   ├── InventoryController.java
│   ├── PaymentController.java
│   ├── ReviewController.java
│   ├── RoomAdminController.java
│   └── SearchController.java
├── dto/
│   ├── AuthResponse.java
│   ├── BookingDto.java
│   ├── GuestDto.java
│   ├── HotelDto.java
│   ├── InventoryDto.java
│   ├── LoginRequest.java
│   ├── PaymentDto.java
│   ├── RegisterRequest.java
│   ├── ReviewDto.java
│   ├── RoomDto.java
│   └── UserDto.java
├── entity/
│   ├── Booking.java
│   ├── Guest.java
│   ├── Hotel.java
│   ├── HotelContactInfo.java
│   ├── Inventory.java
│   ├── Payment.java
│   ├── Room.java
│   ├── User.java
│   └── enums/
├── exception/
│   └── ResourceNotFoundException.java
├── repository/
│   ├── BookingRepository.java
│   ├── HotelRepository.java
│   ├── InventoryRepository.java
│   ├── PaymentRepository.java
│   ├── ReviewRepository.java
│   ├── RoomRepository.java
│   └── UserRepository.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtService.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── BookingService.java
    ├── BookingServiceImpl.java
    ├── HotelService.java
    ├── HotelServiceImpl.java
    ├── InventoryService.java
    ├── InventoryServiceImpl.java
    ├── PaymentService.java
    ├── PaymentServiceImpl.java
    ├── ReviewService.java
    ├── ReviewServiceImpl.java
    ├── RoomService.java
    ├── RoomServiceImpl.java
    ├── SearchService.java
    ├── SearchServiceImpl.java
    ├── UserService.java
    └── UserServiceImpl.java
```

### Frontend Structure
```
airbnb-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Booking.jsx
│   │   ├── Home.jsx
│   │   ├── HotelDetail.jsx
│   │   ├── HotelList.jsx
│   │   ├── Login.jsx
│   │   ├── MyBookings.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── bookingService.js
│   │   ├── hotelService.js
│   │   └── reviewService.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🔐 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration for frontend integration
- Protected endpoints for authenticated users

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:
- Users (with roles)
- Hotels (with contact info)
- Rooms (with pricing)
- Bookings (with payment integration)
- Inventory (availability tracking)
- Reviews (ratings and comments)
- Payments (Stripe integration)

## 🧪 Testing with Postman

1. **Register a new user** using `/api/auth/register`
2. **Login** to get JWT token using `/api/auth/login`
3. **Use the token** in Authorization header for protected endpoints
4. **Create hotels and rooms** for testing
5. **Activate hotels** to generate inventory
6. **Search and book hotels** using the booking flow
7. **Add reviews** for booked hotels

## 🎨 Tech Stack

### Backend
- Spring Boot 3.4.4
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (io.jsonwebtoken)
- ModelMapper
- Lombok
- Stripe Java SDK

### Frontend
- React 18
- React Router
- Axios
- TailwindCSS
- Lucide React (icons)
- Vite

## 📝 Changes Made

### Backend Changes
1. Added Spring Security and JWT dependencies
2. Implemented complete authentication system with JWT
3. Created UserService with registration and login
4. Implemented SecurityConfig with CORS support
5. Completed BookingService with full CRUD operations
6. Implemented InventoryService for room availability
7. Completed TODO items in HotelServiceImpl (inventory creation and deletion)
8. Added search and filtering functionality
9. Implemented complete Review and Rating system
10. Added PaymentService with Stripe integration
11. Created all REST Controllers (Auth, Booking, Search, Review, Payment, Inventory)
12. Updated repositories with custom query methods

### Frontend Changes
1. Created complete React project structure with Vite
2. Implemented authentication pages (Login, Register)
3. Created hotel listing and detail pages
4. Implemented booking flow with date selection
5. Added user dashboard for managing bookings
6. Created API services for backend communication
7. Implemented authentication context for state management
8. Added responsive navigation with user state
9. Integrated TailwindCSS for modern styling

## 🚀 How to Run

### Step 1: Start PostgreSQL Database
Ensure PostgreSQL is running and database `airBnb` is created.

### Step 2: Start Backend
```bash
cd E:\Projects\airBnbApp
mvn spring-boot:run
```

### Step 3: Start Frontend (New Terminal)
```bash
cd E:\Projects\airbnb-frontend
npm install
npm run dev
```

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## 📝 Notes

- The application uses JWT tokens for authentication (24-hour expiration)
- Hotel activation automatically creates inventory for 365 days
- Stripe integration requires a valid API key for payment processing
- CORS is configured to allow requests from the React frontend
- All sensitive operations require authentication

## 🔮 Future Enhancements

- Image upload for hotels/rooms (AWS S3 integration)
- Email notifications for bookings
- Wishlist/saved properties feature
- Advanced search with amenities filtering
- Real-time chat between guests and hosts
- Multi-language support
- Mobile app development

## 📄 License

This project is for educational purposes.
