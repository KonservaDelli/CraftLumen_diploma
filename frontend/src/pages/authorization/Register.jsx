import './Register.css';

import authorizathion_img from '../../assets/author_img.svg'

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-card">
        <header className="header">
          <div className="submit_active">Реєстрація</div>
          <div className="submit">Вхід</div>
        </header>
        <div className="underline"></div>

        <div className="form-content">
          <div className="text">Реєсрація</div>
          <div className="input">
            <input type="email" placeholder='Пошта'/>
          </div>
          <div className="input">
            <input type="password" placeholder='Пароль'/>
          </div>
          <div className="input">
            <input type="password" placeholder='Повторіть пароль'/>
          </div>
          <button className='button'>Реєстрація</button>
        </div>
        <footer>
          <img src="" alt="" />
        </footer>
        <img src={authorizathion_img} alt="" className="side_view" />
      </div>
    </div>
  );
};

export default Register;