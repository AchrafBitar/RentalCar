import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarList from './pages/CarList';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/book/:carId" element={<BookingPage />} />
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
