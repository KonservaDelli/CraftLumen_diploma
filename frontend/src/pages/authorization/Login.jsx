import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <header className="header">
        <div className="submit">Реєстрація</div>
        <div className="submit">Вхід</div>
      </header>

      <div className="form-content">
        <div className="text">Вхід</div>
        <div className="input">
          <input type="email" placeholder='Пошта'/>
        </div>
        <div className="input">
          <input type="password" placeholder='Пароль'/>
        </div>
        <button className='button'>Вхід</button>
      </div>

      <footer>
        <img src="" alt="" />
      </footer>
    </div>
  );
};

export default Login;