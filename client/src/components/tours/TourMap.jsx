import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

const TourMap = ({ tour }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const geoObjectsRef = useRef([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Координаты для всех туров
  const getTourCoordinates = useCallback((tourId) => {
    const coordinates = {
      1: { // Врата Ада (Данакиль)
        center: [14.2417, 40.3],
        zoom: 8,
        points: [
          { coords: [14.2417, 40.3], title: 'Вулкан Эрта Але', desc: 'Лавовое озеро', night: true },
          { coords: [14.1, 40.5], title: 'Соляные равнины', desc: 'Добыча соли', night: false },
          { coords: [13.8, 40.8], title: 'Кислотные источники', desc: 'Яркие цвета', night: false }
        ]
      },
      2: { // Огненное кольцо (Камчатка)
        center: [53.1, 158.7],
        zoom: 7,
        points: [
          { coords: [53.1, 158.7], title: 'Вулкан Мутновский', desc: 'Действующий вулкан', night: true },
          { coords: [54.5, 160.0], title: 'Долина гейзеров', desc: 'Гейзеры и термальные источники', night: false },
          { coords: [53.3, 159.5], title: 'Вулкан Горелый', desc: 'Кратер с кислотным озером', night: false }
        ]
      },
      3: { // Проклятие Анд (Перу)
        center: [-13.1631, -72.5450],
        zoom: 9,
        points: [
          { coords: [-13.1631, -72.5450], title: 'Мачу-Пикчу', desc: 'Затерянный город инков', night: true },
          { coords: [-13.5167, -71.9667], title: 'Куско', desc: 'Столица инков', night: false },
          { coords: [-13.3333, -72.0833], title: 'Священная долина', desc: 'Древние поселения', night: false }
        ]
      },
      4: { // Ледяной ад (Якутия)
        center: [63.4641, 142.7737],
        zoom: 6,
        points: [
          { coords: [63.4641, 142.7737], title: 'Оймякон', desc: 'Полюс холода', night: true },
          { coords: [62.0, 145.0], title: 'Ледяные пещеры', desc: 'Подземные ледяные гроты', night: false },
          { coords: [63.5, 143.2], title: 'Якутское нагорье', desc: 'Вечная мерзлота', night: false }
        ]
      },
      5: { // Остров дракона (Комодо)
        center: [-8.5855, 119.4411],
        zoom: 9,
        points: [
          { coords: [-8.5855, 119.4411], title: 'Остров Комодо', desc: 'Обитание драконов', night: true },
          { coords: [-8.7, 119.5], title: 'Розовый пляж', desc: 'Уникальный розовый песок', night: false },
          { coords: [-8.6, 119.6], title: 'Остров Падар', desc: 'Панорамный вид', night: false }
        ]
      },
      6: { // Призраки Чернобыля
        center: [51.4045, 30.0542],
        zoom: 10,
        points: [
          { coords: [51.4045, 30.0542], title: 'ЧАЭС', desc: 'Четвертый энергоблок', night: true },
          { coords: [51.3938, 30.0591], title: 'Припять', desc: 'Заброшенный город', night: false },
          { coords: [51.3762, 30.0355], title: 'Рыжий лес', desc: 'Зона радиоактивного заражения', night: false }
        ]
      }
    };

    // Если тур не найден, возвращаем дефолтные точки на основе названия или категории
    if (!coordinates[tourId] && tour) {
      const title = tour.title?.toLowerCase() || '';
      const location = tour.location?.toLowerCase() || '';
      
      if (title.includes('данакиль') || location.includes('эфиопия')) {
        return coordinates[1];
      } else if (title.includes('камчатка') || location.includes('россия')) {
        return coordinates[2];
      } else if (title.includes('анд') || location.includes('перу')) {
        return coordinates[3];
      } else if (title.includes('якутия') || title.includes('ледяной')) {
        return coordinates[4];
      } else if (title.includes('дракон') || location.includes('комодо')) {
        return coordinates[5];
      } else if (title.includes('чернобыль')) {
        return coordinates[6];
      }
    }

    return coordinates[tourId] || {
      center: [55.7558, 37.6176],
      zoom: 5,
      points: [
        { coords: [55.7558, 37.6176], title: tour?.title || 'Начальная точка', desc: tour?.location || 'Место начала экспедиции', night: true }
      ]
    };
  }, [tour]);

  const initMap = useCallback(() => {
    // Проверяем все необходимые условия
    if (!window.ymaps) {
      console.log('YMaps API not loaded yet');
      return;
    }
    
    if (!mapContainer.current) {
      console.log('Map container not ready');
      return;
    }
    
    if (!tour) {
      console.log('Tour data not available');
      return;
    }

    // Проверяем, что контейнер имеет родительский элемент (не отмонтирован)
    if (!mapContainer.current.parentElement) {
      console.log('Map container not in DOM');
      return;
    }

    window.ymaps.ready(() => {
      // Повторная проверка перед созданием карты
      if (!mapContainer.current) return;

      try {
        // Уничтожаем предыдущую карту, если она существует
        if (mapInstance.current) {
          mapInstance.current.destroy();
          mapInstance.current = null;
        }

        const data = getTourCoordinates(tour.id);

        // Создаем карту
        const map = new window.ymaps.Map(mapContainer.current, {
          center: data.center,
          zoom: data.zoom || 8,
          controls: ['zoomControl']
        }, {
          suppressMapOpenBlock: true,
          suppressObsoleteBrowserError: true
        });

        // Очищаем массив геообъектов
        geoObjectsRef.current = [];

        // Добавляем метки
        data.points.forEach((point, index) => {
          const iconContent = `
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #ef4444, #f97316);
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 18px;
              color: white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              ${index + 1}
            </div>
          `;

          const placemark = new window.ymaps.Placemark(
            point.coords,
            {
              hintContent: point.title,
              balloonContent: `
                <div style="padding: 15px; min-width: 220px; background: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ef4444, #f97316); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                      ${index + 1}
                    </div>
                    <strong style="color: #ef4444; font-size: 18px;">${point.title}</strong>
                  </div>
                  <p style="margin: 8px 0; color: #333; font-size: 14px;">${point.desc}</p>
                  ${point.night ? '<div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; color: #f97316; display: flex; align-items: center; gap: 5px;"><span>⛺</span> Ночевка в этом районе</div>' : ''}
                </div>
              `
            },
            {
              iconLayout: 'default#imageWithContent',
              iconImageHref: '',
              iconImageSize: [1, 1],
              iconContentOffset: [0, 0],
              iconContentLayout: window.ymaps.templateLayoutFactory.createClass(iconContent)
            }
          );
          
          map.geoObjects.add(placemark);
          geoObjectsRef.current.push(placemark);
        });

        // Добавляем линии между точками
        for (let i = 0; i < data.points.length - 1; i++) {
          const line = new window.ymaps.Polyline(
            [data.points[i].coords, data.points[i + 1].coords],
            {},
            {
              strokeColor: '#ef4444',
              strokeWidth: 3,
              strokeOpacity: 0.8,
              strokeStyle: 'solid'
            }
          );
          map.geoObjects.add(line);
          geoObjectsRef.current.push(line);
        }

        mapInstance.current = map;
        setMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    });
  }, [tour, getTourCoordinates]);

  useEffect(() => {
    // Проверяем, загружен ли уже API
    if (window.ymaps) {
      setApiLoaded(true);
      return;
    }

    // Проверяем, не загружается ли уже скрипт
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setApiLoaded(true));
      return;
    }

    // Загружаем API
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=e0d04bea-5970-4ec6-b231-5cd48b086a93&lang=ru_RU';
    script.async = true;
    script.onload = () => {
      setApiLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Yandex Maps API:', error);
    };
    document.body.appendChild(script);

    return () => {
      // Не удаляем скрипт при размонтировании, так как он может использоваться другими компонентами
    };
  }, []);

  useEffect(() => {
    if (apiLoaded && mapContainer.current && tour) {
      // Небольшая задержка, чтобы DOM точно был готов
      const timer = setTimeout(() => {
        initMap();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [apiLoaded, tour, initMap]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
        } catch (error) {
          console.error('Error destroying map:', error);
        }
        mapInstance.current = null;
      }
    };
  }, []);

  if (!tour) return null;

  const data = getTourCoordinates(tour.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20"
    >
      <h3 className="text-2xl font-bold mb-4 text-red-400">Маршрут экспедиции</h3>
      
      {/* Карта */}
      <div 
        ref={mapContainer} 
        className="w-full h-[450px] rounded-xl overflow-hidden border-2 border-red-500/30 mb-6 bg-gray-800/50"
        style={{ minHeight: '450px' }}
      >
        {!mapReady && (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mb-2"></div>
              <p>Загрузка карты...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Легенда маршрута */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
          <span>📍</span> Точки маршрута:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.points.map((point, index) => (
            <div 
              key={index} 
              className="bg-gray-800/70 p-4 rounded-xl border border-red-500/30 hover:border-red-500/60 hover:bg-gray-800 transition-all cursor-pointer group"
              onClick={() => {
                if (mapInstance.current && geoObjectsRef.current[index]) {
                  mapInstance.current.panTo(point.coords, {
                    flying: true,
                    duration: 500
                  });
                  setTimeout(() => {
                    if (geoObjectsRef.current[index]) {
                      geoObjectsRef.current[index].balloon.open();
                    }
                  }, 600);
                }
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <span className="font-semibold text-white group-hover:text-red-400 transition-colors">
                  {point.title}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{point.desc}</p>
              <div className="flex justify-between items-center text-xs">
                {point.night && (
                  <span className="text-orange-400 flex items-center gap-1">
                    <span>⛺</span> Ночевка
                  </span>
                )}
                <span className="text-gray-500">
                  {index < data.points.length - 1 ? `→ ${data.points[index + 1].title.split(' ')[0]}` : '🏁 Финиш'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-6 flex flex-wrap justify-between items-center text-sm text-gray-400 border-t border-red-500/20 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full"></div>
            <span>Точки маршрута</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-6 h-0.5 bg-red-500"></span>
            <span>Маршрут</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⛺</span>
            <span>Ночевка</span>
          </div>
        </div>
        <div className="text-xs">
          ⏱ Длительность: {tour.duration}
        </div>
      </div>

      {/* Ссылка на Яндекс Карты */}
      <div className="mt-4 text-center">
        <a 
          href={`https://yandex.ru/maps/?pt=${data.center[1]},${data.center[0]}&z=${data.zoom}&l=map`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-white transition-colors text-sm"
        >
          <span>🗺️</span>
          Открыть маршрут в Яндекс Картах
        </a>
      </div>
    </motion.div>
  );
};

export default TourMap;