import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика входа
    console.log('Login:', formData);
    // Перенаправление на главную после успешного входа
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔥</div>
            <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
            <p className="text-gray-500 mt-2">Войдите в свой аккаунт</p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
              </label>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                Забыли пароль?
              </a>
            </div>

            <button type="submit" className="btn-primary w-full">
              Войти
            </button>
          </form>

          {/* Ссылка на регистрацию */}
          <p className="text-center mt-6 text-gray-600">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
              Зарегистрироваться
            </Link>
          </p>

          {/* Демо-данные */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">Демо-доступ:</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><span className="font-medium">Email:</span> admin@tourtohell.com</p>
              <p><span className="font-medium">Пароль:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;