import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarList from './pages/CarList';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/book/:carId" element={<BookingPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p>&copy; 2026 Rabat Agdal Car Rental. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
