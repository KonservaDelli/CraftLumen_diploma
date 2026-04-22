import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/authorization/Register';
import Login from './pages/authorization/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* По замовчуванню відкриваємо вхід */}
      </Routes>
    </Router>
  );
}

export default App;