import React, { useState, useRef } from 'react'; 
import BaseInput from '../../ui/input/BaseInput.jsx'; 
import SquareButton from '../../ui/button/SquareButton.jsx'; 
import './InfoUser.css';

const InfoUser = ({ 
  user = { nickname: '', email: '', password: '', avatarUrl: '' },
  nearestProject = null,
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState(user.password || '••••••••');
  const [emailError, setEmailError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatarUrl || '');
  const fileInputRef = useRef(null);

  // Валідація пошти при введенні
  const handleEmailChange = (value) => {
    setEmail(value);
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Поле не може бути порожнім');
    } else if (!simpleEmailRegex.test(value)) {
      setEmailError('Некоректний формат пошти');
    } else {
      setEmailError('');
    }
  };

  const handleEditClick = () => {
    setNickname(user.nickname || '');
    setEmail(user.email || '');
    if (user.password === '••••••••') {
      setPassword('');
    } else {
      setPassword(user.password || '');
    }
    
    setPreviewUrl(user.avatarUrl || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (emailError || !email) return; 
    
    onSave?.({ nickname, email, password }, selectedFile);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setNickname(user.nickname || '');
    setEmail(user.email || '');
    setPassword(user.password || '••••••••');
    setPreviewUrl(user.avatarUrl || '');
    setSelectedFile(null);
    setEmailError('');
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const isSaveDisabled = !!emailError || !email;

  return (
    <div className="info-user-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      <div className="info-user-control-panel">
        {!isEditing ? (
          <SquareButton type="edit" onClick={handleEditClick} />
        ) : (
          <div className="info-user-action-buttons">
            <SquareButton 
              type="save" 
              onClick={handleSave} 
              disabled={isSaveDisabled}
              style={isSaveDisabled ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
            />
            <SquareButton type="cancel" onClick={handleCancel} />
          </div>
        )}
      </div>

      <div className="info-user-layout">
        <div 
          className="info-user-avatar-block" 
          style={{ 
            backgroundImage: `url(${previewUrl || '/default-profile.jpg'})`,
            cursor: isEditing ? 'pointer' : 'default'
          }}
          onClick={handleAvatarClick}
        >
          {isEditing && (
            <div className="avatar-edit-overlay">
              <span>Змінити фото</span>
            </div>
          )}
        </div>

        <div className="info-user-main-content">
          <div className={`info-user-fields ${isEditing ? 'mode-editing' : 'mode-view'}`}>

            <div className="info-user-field-group">
              <label className="info-user-label">Нікнейм</label>
              <BaseInput 
                value={isEditing ? nickname : (user.nickname || '')} 
                onChange={setNickname} 
                placeholder="Введіть нікнейм"
                disabled={!isEditing}
              />
            </div>

            <div className="info-user-field-group">
              <label className="info-user-label">Електронна пошта</label>
              <BaseInput 
                value={isEditing ? email : (user.email || '')} 
                onChange={handleEmailChange} 
                placeholder="Введіть пошту"
                disabled={!isEditing}
              />
              {isEditing && emailError && (
                <span style={{ color: '#ff4d4d', fontSize: '14px', marginTop: '2px', fontFamily: 'Fira Sans', fontWeight: '500' }}>
                  {emailError}
                </span>
              )}
            </div>

            <div className="info-user-dynamic-zone">
              {isEditing ? (
                <div className="info-user-field-group fade-in">
                  <label className="info-user-label">Пароль</label>
                  <BaseInput 
                    type="text" 
                    value={password} 
                    onChange={setPassword} 
                    placeholder="Введіть новий пароль, щоб змінити"
                    disabled={!isEditing}
                  />
                </div>
              ) : (
                nearestProject ? (
                  <div className="info-user-project-box fade-in">
                    <span className="info-user-label">Найближчий дедлайн</span>
                    <div className="project-box-card">
                      <span className="project-box-name">{nearestProject.title}</span>
                      <span className="project-box-date">{nearestProject.endDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="info-user-project-box fade-in">
                    <span className="info-user-label">Найближчий дедлайн</span>
                    <div className="project-box-card empty">
                      <span className="project-box-name">Немає активних проєктів!</span>
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;