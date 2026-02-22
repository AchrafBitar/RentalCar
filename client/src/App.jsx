import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarList from './pages/CarList';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DocumentUpload from './pages/DocumentUpload';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/book/:carId" element={<BookingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/upload-docs/:reservationId" element={<DocumentUpload />} />
          </Routes>
        </main>
        <footer className="bg-zinc-950 text-white py-6 text-center border-t border-zinc-900">
          <p>&copy; 2026 Exact Rent Car. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
