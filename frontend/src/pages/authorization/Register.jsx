import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Register.css';

import authorizathion_img from '../../assets/author_img.svg'

const Register = () => {
  const navigate = useNavigate();
  //Зберігання даних форми
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  //Оновлення даних при друці
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Перевірка на однаковість паролів
    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не збігаються!');
      return;
    }

    try {
      //Відправка запиту на бекенд 
      const response = await api.post('/register', {
        email: formData.email,
        password: formData.password
      });
      
      console.log(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Сталася помилка при реєстрації');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="header">
          <Link to="/register" className="submit_active">Реєстрація</Link>
          <Link to="/login" className="submit">Вхід</Link>
        </header>
        <div className="underline"></div>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="text">Реєсрація</div>
          {error && <div className="error-message" style={{color: 'red', fontSize: '14px'}}>{error}</div>}
          <div className="input">
            <input type="email" name = 'email' placeholder='Пошта' value={formData.email} onChange={handleChange} required/>
          </div>
          <div className="input">
            <input type="password" name="password" placeholder='Пароль' value={formData.password} onChange={handleChange} required/>
          </div>
          <div className="input">
            <input type="password" name="confirmPassword" placeholder='Повторіть пароль' value={formData.confirmPassword} onChange={handleChange} required/>
          </div>
          <button type= "submit" className='button'>Реєстрація</button>
        </form>

        <footer>
          <img src="" alt="" />
        </footer>
        
        <img src={authorizathion_img} alt="" className="side_view" />
      </div>
    </div>
  );
};

export default Register;