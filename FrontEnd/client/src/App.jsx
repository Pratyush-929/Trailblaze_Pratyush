import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookingForm from './pages/BookingForm';
import BookingPage from './pages/BookingPage';
import Rentals from './pages/Rentals';
import RentalForm from './pages/RentalForm';
import AddEditBike from './pages/admin/AddEditBike';
import AdminBookings from './pages/admin/AdminBookings';
import RentalSuccess from './pages/RentalSuccess';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import TrailDetails from './pages/TrailDetails';
import About from './pages/About';
import Trips from './pages/Trips';
import Login from './components/Login';
import Register from './components/Register';
import Reviews from './pages/Reviews';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/trips" element={
            <>
              <Navbar />
              <Trips />
              <Footer />
            </>
          } />
          <Route path="/reviews" element={
            <>
              <Navbar />
              <Reviews />
              <Footer />
            </>
          } />
          <Route path="/reviews/:trailId" element={
            <>
              <Navbar />
              <Reviews />
              <Footer />
            </>
          } />
          <Route path="/booking" element={
            <>
              <Navbar />
              <BookingForm />
              <Footer />
            </>
          } />
          <Route path="/rental" element={
            <>
              <Navbar />
              <Rentals />
              <Footer />
            </>
          } />
          <Route path="/rental/form/:id" element={
            <>
              <Navbar />
              <RentalForm />
              <Footer />
            </>
          } />
          <Route path="/rental/success" element={
            <>
              <Navbar />
              <RentalSuccess />
              <Footer />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/bookings" element={
            <>
              <Navbar />
              <AdminBookings />
              <Footer />
            </>
          } />
          <Route path="/admin/add-bike" element={
            <>
              <Navbar />
              <AddEditBike />
              <Footer />
            </>
          } />
          <Route path="/admin/edit-bike/:id" element={
            <>
              <Navbar />
              <AddEditBike />
              <Footer />
            </>
          } />
          <Route path="/book/:id" element={
            <>
              <Navbar />
              <BookingPage />
              <Footer />
            </>
          } />
        </Route>
        {/* Public Routes */}
        <Route path="/trail/:id" element={
          <>
            <Navbar />
            <TrailDetails />
            <Footer />
          </>
        } />
        <Route path="/membership" element={
          <>
            <Navbar />
            <Membership />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
