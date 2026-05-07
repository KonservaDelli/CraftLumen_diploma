import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

import authorizathion_img from '../../assets/author_img.svg'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Вхід успішний:', response.data);
      
      //збереження токену
      localStorage.setItem('token', response.data.access_token);
      
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Сталася помилка при вході');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="header">
          <Link to="/register" className="submit">Реєстрація</Link>
          <Link to="/login" className="submit_active">Вхід</Link>
        </header>
        <div className="underline"></div>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="text">Вхід</div>
          {error && <div className="error-message" style={{color: 'red', fontSize: '14px'}}>{error}</div>}
          <div className="input">
            <input type="email" name="email" placeholder='Пошта' value={formData.email} onChange={handleChange} required/>
          </div>
          <div className="input">
            <input type="password" name="password" placeholder='Пароль' value={formData.password} onChange={handleChange} required/>
          </div>
          <button type= "submit" className='button'>Вхід</button>
        </form>

        <footer>
          <img src="" alt="" />
        </footer>

        <img src={authorizathion_img} alt="" className="side_view" />
      </div>
    </div>
  );
};

export default Login;