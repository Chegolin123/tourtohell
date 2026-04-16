import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { tourService } from '../services/tourService';
import { bookingService } from '../services/bookingService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { tourId } = useParams(); // tourId используется в запросе
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    participants: 1,
    startDate: '',
    specialRequests: '',
    paymentMethod: 'card'
  });

  const { data: tour, isLoading } = useQuery(['tour', tourId], () =>
    tourService.getTourById(tourId)
  );

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const participants = watch('participants', 1);

  const totalPrice = tour?.price * participants || 0;

  const onSubmit = async (data) => {
    try {
      const booking = {
        tourId,
        ...data,
        totalPrice,
        userId: user._id
      };

      await bookingService.createBooking(booking);
      toast.success('Бронирование успешно создано!');
      navigate('/profile?tab=bookings');
    } catch (error) {
      toast.error('Ошибка при бронировании');
    }
  };

  if (isLoading) return <Loader />;
  if (!tour) return <div className="error">Тур не найден</div>;

  return (
    <motion.div
      className="booking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="booking-header">
          <h1>Оформление бронирования</h1>
          <div className="booking-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-text">Выбор даты</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-text">Данные участников</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-text">Оплата</span>
            </div>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
              {step === 1 && (
                <div className="step-content">
                  <h2>Выберите дату начала тура</h2>
                  
                  <div className="date-selection">
                    {tour.startDates?.map((date, index) => (
                      <label key={index} className="date-option">
                        <input
                          type="radio"
                          name="startDate"
                          value={date.date}
                          {...register('startDate', { required: 'Выберите дату' })}
                          disabled={!date.available}
                        />
                        <div className="date-card">
                          <span className="date">
                            {new Date(date.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className={`availability ${date.available ? 'available' : 'unavailable'}`}>
                            {date.available ? '✅ Свободно' : '❌ Забронировано'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.startDate && (
                    <span className="error-message">{errors.startDate.message}</span>
                  )}

                  <button
                    type="button"
                    className="btn-next"
                    onClick={() => setStep(2)}
                  >
                    Далее
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h2>Информация об участниках</h2>
                  
                  <div className="participants-section">
                    <label>Количество участников</label>
                    <select
                      {...register('participants', { 
                        required: 'Укажите количество участников',
                        min: 1,
                        max: tour.maxGroupSize
                      })}
                    >
                      {[...Array(tour.maxGroupSize)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'участник' : 'участников'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="participants-details">
                    {[...Array(parseInt(participants) || 1)].map((_, index) => (
                      <div key={index} className="participant-form">
                        <h3>Участник {index + 1}</h3>
                        
                        <div className="form-group">
                          <label>ФИО полностью</label>
                          <input
                            type="text"
                            {...register(`participants.${index}.fullName`, { 
                              required: 'Введите ФИО' 
                            })}
                            placeholder="Иванов Иван Иванович"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Дата рождения</label>
                            <input
                              type="date"
                              {...register(`participants.${index}.birthDate`, { 
                                required: 'Введите дату рождения' 
                              })}
                            />
                          </div>

                          <div className="form-group">
                            <label>Пол</label>
                            <select {...register(`participants.${index}.gender`, { 
                              required: 'Выберите пол' 
                            })}>
                              <option value="">Выберите</option>
                              <option value="male">Мужской</option>
                              <option value="female">Женский</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Номер паспорта</label>
                          <input
                            type="text"
                            {...register(`participants.${index}.passport`, { 
                              required: 'Введите номер паспорта' 
                            })}
                            placeholder="1234 567890"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Особые пожелания</label>
                    <textarea
                      {...register('specialRequests')}
                      placeholder="Диетическое питание, особые условия и т.д."
                      rows="4"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-prev"
                      onClick={() => setStep(1)}
                    >
                      Назад
                    </button>
                    <button
                      type="button"
                      className="btn-next"
                      onClick={() => setStep(3)}
                    >
                      Перейти к оплате
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h2>Выберите способ оплаты</h2>
                  
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        value="card"
                        {...register('paymentMethod')}
                        defaultChecked
                      />
                      <div className="payment-card">
                        <span className="payment-icon">💳</span>
                        <div>
                          <span className="payment-title">Банковская карта</span>
                          <span className="payment-description">Visa, MasterCard, МИР</span>
                        </div>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        value="cash"
                        {...register('paymentMethod')}
                      />
                      <div className="payment-card">
                        <span className="payment-icon">💰</span>
                        <div>
                          <span className="payment-title">Наличными</span>
                          <span className="payment-description">При встрече с гидом</span>
                        </div>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        value="transfer"
                        {...register('paymentMethod')}
                      />
                      <div className="payment-card">
                        <span className="payment-icon">🏦</span>
                        <div>
                          <span className="payment-title">Банковский перевод</span>
                          <span className="payment-description">На расчетный счет</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-prev"
                      onClick={() => setStep(2)}
                    >
                      Назад
                    </button>
                    <button type="submit" className="btn-submit">
                      Подтвердить бронирование
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="booking-summary">
            <div className="summary-card">
              <h3>Ваш заказ</h3>
              
              <div className="tour-summary">
                <img src={tour.images[0]} alt={tour.title} />
                <div>
                  <h4>{tour.title}</h4>
                  <p>{tour.duration} дней • {tour.destination}</p>
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Цена за человека:</span>
                  <span>{tour.price.toLocaleString()} ₽</span>
                </div>
                <div className="summary-row">
                  <span>Количество участников:</span>
                  <span>{participants}</span>
                </div>
                <div className="summary-row total">
                  <span>Итого:</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>

              <div className="summary-note">
                <p>✅ Бесплатная отмена за 7 дней</p>
                <p>✅ Поддержка 24/7</p>
                <p>✅ Лучшая цена гарантирована</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingPage;