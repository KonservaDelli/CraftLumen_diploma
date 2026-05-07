import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/authorization/Register';
import Login from './pages/authorization/Login';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;