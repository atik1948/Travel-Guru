import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import PrivateRoute, { AdminRoute } from './routes/PrivateRoute'

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const BookingConfirmationPage = lazy(() => import('./pages/BookingConfirmationPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const DestinationPage = lazy(() => import('./pages/DestinationPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const NewsPostPage = lazy(() => import('./pages/NewsPostPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const StayDetailsPage = lazy(() => import('./pages/StayDetailsPage'))

function RouteFallback() {
  return (
    <div className="px-6 py-10 text-sm text-[#666666] md:px-8">
      Loading page...
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="booking/:slug" element={<BookingPage />} />
          <Route path="booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsPostPage />} />
          <Route path="destination" element={<DestinationPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="stays/:stayId" element={<StayDetailsPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="my-bookings" element={<MyBookingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
