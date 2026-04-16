-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 16 2026 г., 13:01
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `tourtohell`
--

-- --------------------------------------------------------

--
-- Структура таблицы `bookings`
--

CREATE TABLE `bookings` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tour_id` int DEFAULT NULL,
  `tour_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participants` int DEFAULT '1',
  `total_price` decimal(10,2) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `special_requests` text COLLATE utf8mb4_unicode_ci,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','pending','processing','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `bookings`
--

INSERT INTO `bookings` (`id`, `name`, `email`, `phone`, `tour_id`, `tour_name`, `participants`, `total_price`, `preferred_date`, `payment_method`, `special_requests`, `message`, `status`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'aaaa  aaaa', 'chegolin@gmail.com', '+7 (993) 238-44-82', 3, 'Зона отчуждения', 1, '45990.00', '2026-04-26', 'card', NULL, NULL, 'confirmed', '2026-04-16 09:03:31', '2026-04-16 09:03:49', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tour_id` int DEFAULT NULL,
  `tour_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participants` int DEFAULT '1',
  `preferred_date` date DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','processing','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `tour_id`, `tour_name`, `participants`, `preferred_date`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'aaaa  aaaa', 'chegolin@gmail.com', '+7 (993) 238-44-82', 2, 'Оймякон — Полюс Холода', 1, '2026-04-23', NULL, 'new', '2026-04-16 08:20:29', '2026-04-16 08:20:29');

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `tour_id` int DEFAULT NULL,
  `tour_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `likes` int DEFAULT '0',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `user_name`, `user_id`, `rating`, `tour_id`, `tour_name`, `comment`, `likes`, `location`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Алексей Волков', 1, 5, 1, 'Вулканы Камчатки', 'Это было невероятно! Подъём на Мутновский вулкан — самый захватывающий опыт в моей жизни. Вид на кратер с кипящей лавой просто завораживает. Организация на высшем уровне, гиды — профессионалы своего дела.', 24, 'Москва', 'approved', '2026-02-15 11:30:00', '2026-04-16 08:19:00'),
(2, 'Алексей Волков', 1, 5, 2, 'Оймякон — Полюс Холода', '-58°C — это не шутка! Ресницы замерзают за минуту, техника отказывается работать, но эмоции просто непередаваемые. Купание в незамерзающем источнике при -50°C — то, ради чего стоит ехать.', 31, 'Москва', 'approved', '2025-12-20 08:00:00', '2026-04-16 08:19:00'),
(3, 'Мария Снегирёва', NULL, 5, 1, 'Вулканы Камчатки', 'Камчатка покорила моё сердце! Виды с вулканов — как с другой планеты. Термальные источники после тяжёлого подъёма — настоящее блаженство.', 18, 'Санкт-Петербург', 'approved', '2026-03-10 06:15:00', '2026-04-16 08:19:00'),
(4, 'Дмитрий Козлов', NULL, 4, 1, 'Вулканы Камчатки', 'Отличный тур для любителей экстрима. Физически тяжело, но оно того стоит. Погода непредсказуемая — за два дня увидели и солнце, и снег, и дождь.', 12, 'Екатеринбург', 'approved', '2026-01-20 13:45:00', '2026-04-16 08:19:00'),
(5, 'Елена Вьюгина', NULL, 5, 2, 'Оймякон — Полюс Холода', 'Самый экстремальный опыт в моей жизни! Местные жители очень дружелюбные, строганина из рыбы — объедение.', 15, 'Новосибирск', 'approved', '2025-11-05 10:20:00', '2026-04-16 08:19:00'),
(6, 'Игорь Радионов', NULL, 5, 3, 'Зона отчуждения', 'Чернобыль впечатляет до мурашек. Заброшенная Припять, колесо обозрения, детский сад с разбросанными игрушками — всё это заставляет задуматься.', 42, 'Киев', 'approved', '2026-02-28 07:10:00', '2026-04-16 08:19:00'),
(7, 'Анна Тёмная', NULL, 4, 3, 'Зона отчуждения', 'Очень атмосферное место. Немного жутковато ночевать внутри зоны, но это того стоит. Радиационный фон везде разный.', 9, 'Минск', 'approved', '2026-03-15 12:30:00', '2026-04-16 08:19:00'),
(8, 'Максим Жаров', NULL, 5, 4, 'Пустыня Данакиль', 'Ад на Земле — это точное описание! +52°C днём, серные источники всех цветов радуги, лавовое озеро вулкана Эрта Але ночью.', 27, 'Краснодар', 'approved', '2026-01-12 16:00:00', '2026-04-16 08:19:00'),
(9, 'Ольга Смелая', NULL, 5, 5, 'Дорога смерти', '64 километра чистого адреналина! Ехать по краю пропасти без ограждений — непередаваемые ощущения. Виды с гор на джунгли просто космические!', 33, 'Сочи', 'approved', '2026-02-05 09:40:00', '2026-04-16 08:19:00'),
(10, 'Павел Ледяной', NULL, 5, 6, 'Ледяной каньон', 'Гренландия — это любовь с первого взгляда! Голубые ледяные пещеры выглядят как декорации к фантастическому фильму.', 19, 'Мурманск', 'approved', '2026-03-01 05:15:00', '2026-04-16 08:19:00'),
(11, 'Виктор Критиков', NULL, 3, 1, 'Вулканы Камчатки', 'Тур неплохой, но организация подвела. Трансфер опоздал на 3 часа. Природа, конечно, потрясающая, но за такие деньги ожидал лучшего сервиса.', 5, 'Казань', 'pending', '2026-03-18 11:00:00', '2026-04-16 08:19:00'),
(12, 'Наталья Безенчук', NULL, 5, 3, 'Зона отчуждения', 'Потрясающе! Всё организовано чётко, гиды внимательные, кормили вкусно. Очень познавательно и немного жутко.', 0, 'Воронеж', 'pending', '2026-03-19 06:30:00', '2026-04-16 08:19:00');

-- --------------------------------------------------------

--
-- Структура таблицы `tours`
--

CREATE TABLE `tours` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `full_description` text COLLATE utf8mb4_unicode_ci,
  `short_desc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_group_size` int DEFAULT NULL,
  `difficulty` enum('medium','hard','extreme') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `reviews` int DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('russia','world') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tours`
--

INSERT INTO `tours` (`id`, `title`, `location`, `description`, `full_description`, `short_desc`, `price`, `duration`, `max_group_size`, `difficulty`, `rating`, `reviews`, `image`, `badge`, `category`, `created_at`, `updated_at`) VALUES
(1, 'Вулканы Камчатки', 'Камчатка, Россия', 'Восхождение на действующие вулканы и купание в горячих источниках', 'Экстремальное путешествие на край земли. Вы подниметесь на Мутновский и Горелый вулканы, увидите кратеры с кипящей лавой, искупаетесь в термальных источниках среди снегов и встретите рассвет на берегу Тихого океана.', 'Поднимись на действующие вулканы Камчатки', '89990.00', '7 дней', 8, 'extreme', '4.80', 124, '/assets/images/tours/Kamchatka.jpg', '🔥 ХИТ', 'russia', '2026-04-16 07:50:57', '2026-04-16 08:01:18'),
(2, 'Оймякон — Полюс Холода', 'Якутия, Россия', 'Выживание при -60°C в самом холодном месте планеты', 'Проверь себя на прочность в Оймяконе — месте, где температура опускается до -60°C. Ты научишься разводить костёр в экстремальный мороз, попробуешь строганину, искупаешься в незамерзающем источнике и получишь сертификат \"Покоритель Полюса Холода\".', 'Почувствуй -60°C на своей шкуре', '124500.00', '5 дней', 6, 'extreme', '4.90', 87, '/assets/images/tours/Andy.jpg', '❄️ ЭКСТРИМ', 'russia', '2026-04-16 07:50:57', '2026-04-16 08:01:18'),
(3, 'Зона отчуждения', 'Чернобыль, Россия', 'Исследование заброшенных городов в зоне радиации', 'Двухдневная экспедиция в Припять и окрестности ЧАЭС. Ты увидишь заброшенные школы, детские сады, парк аттракционов и знаменитое колесо обозрения. В программе: ночёвка в легальном хостеле внутри зоны, посещение секретного объекта \"Дуга\" и встреча со сталкерами.', 'Увидь мёртвый город своими глазами', '45990.00', '3 дня', 10, 'hard', '4.60', 203, '/images/tours/chernobyl.jpg', '☢️ ОПАСНО', 'russia', '2026-04-16 07:50:57', '2026-04-16 07:50:57'),
(4, 'Пустыня Данакиль', 'Эфиопия', 'Экспедиция в самое жаркое и негостеприимное место на Земле', 'Пустыня Данакиль — инопланетный пейзаж с кислотными озёрами, вулканами и температурой +50°C. Мы посетим вулкан Эрта Але с действующим лавовым озером, солёные равнины Даллол и познакомимся с племенем афаров.', 'Ад на Земле в пустыне Данакиль', '189990.00', '10 дней', 6, 'extreme', '5.00', 45, '/assets/images/tours/tour-danakil.jpg', '🌋 НОВИНКА', 'world', '2026-04-16 07:50:58', '2026-04-16 08:01:18'),
(5, 'Дорога смерти', 'Боливия', 'Спуск на велосипедах по самой опасной дороге мира', 'North Yungas Road — узкая грунтовая дорога над пропастью глубиной 600 метров без ограждений. Мы проедем 64 километра от заснеженных Анд до влажных джунглей. Адреналин гарантирован на каждом повороте.', 'Прокатись по краю пропасти', '219990.00', '4 дня', 8, 'extreme', '4.70', 156, '/images/tours/deathroad.jpg', '🚲 АДРЕНАЛИН', 'world', '2026-04-16 07:50:58', '2026-04-16 07:50:58'),
(6, 'Ледяной каньон', 'Гренландия', 'Спуск в ледяные пещеры и ночёвка на леднике', 'Экспедиция в самое сердце ледяного щита Гренландии. Мы спустимся в голубые ледяные пещеры, пройдём по трещинам ледника, увидим айсберги с близкого расстояния и переночуем в палатках при -30°C под северным сиянием.', 'Спустись в ледяную бездну Гренландии', '329990.00', '8 дней', 5, 'hard', '4.90', 34, '/images/tours/greenland.jpg', '🧊 ЛЁД', 'world', '2026-04-16 07:50:58', '2026-04-16 07:50:58');

-- --------------------------------------------------------

--
-- Структура таблицы `tour_dates`
--

CREATE TABLE `tour_dates` (
  `id` int NOT NULL,
  `tour_id` int NOT NULL,
  `date` date NOT NULL,
  `available_spots` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `tour_dates`
--

INSERT INTO `tour_dates` (`id`, `tour_id`, `date`, `available_spots`, `created_at`) VALUES
(1, 1, '2026-06-15', 8, '2026-04-16 07:58:08'),
(2, 1, '2026-07-10', 8, '2026-04-16 07:58:08'),
(3, 1, '2026-08-05', 8, '2026-04-16 07:58:08'),
(4, 2, '2026-12-01', 6, '2026-04-16 07:58:08'),
(5, 2, '2027-01-15', 6, '2026-04-16 07:58:08'),
(6, 2, '2027-02-10', 6, '2026-04-16 07:58:08'),
(7, 3, '2026-05-20', 10, '2026-04-16 07:58:08'),
(8, 3, '2026-06-18', 10, '2026-04-16 07:58:08'),
(9, 3, '2026-07-22', 10, '2026-04-16 07:58:08'),
(10, 4, '2026-10-05', 6, '2026-04-16 07:58:08'),
(11, 4, '2026-11-12', 6, '2026-04-16 07:58:08'),
(12, 4, '2027-01-08', 6, '2026-04-16 07:58:08'),
(13, 5, '2026-09-14', 8, '2026-04-16 07:58:08'),
(14, 5, '2026-10-20', 8, '2026-04-16 07:58:08'),
(15, 5, '2027-03-15', 8, '2026-04-16 07:58:08'),
(16, 6, '2026-07-01', 5, '2026-04-16 07:58:08'),
(17, 6, '2026-08-10', 5, '2026-04-16 07:58:08'),
(18, 6, '2027-02-20', 5, '2026-04-16 07:58:08');

-- --------------------------------------------------------

--
-- Структура таблицы `tour_images`
--

CREATE TABLE `tour_images` (
  `id` int NOT NULL,
  `tour_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `tour_images`
--

INSERT INTO `tour_images` (`id`, `tour_id`, `image_url`, `is_main`, `created_at`) VALUES
(1, 1, '/assets/images/tours/Kamchatka.jpg', 1, '2026-04-16 08:00:12'),
(2, 2, '/assets/images/tours/Andy.jpg', 1, '2026-04-16 08:00:12'),
(3, 3, '/images/tours/Kamchatka.jpg', 1, '2026-04-16 08:00:12'),
(4, 4, '/assets/images/tours/tour-danakil.jpg', 1, '2026-04-16 08:00:12'),
(5, 5, '/images/tours/Andy.jpg', 1, '2026-04-16 08:00:12'),
(6, 6, '/images/tours/tour-danakil.jpg', 1, '2026-04-16 08:00:12');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default-avatar.jpg',
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `avatar`, `role`, `created_at`, `updated_at`) VALUES
(1, 'aaaa  aaaa', 'chegolin@gmail.com', '$2a$10$BsXR/SBvp9YTlBOZjdli.uzBaC4xb0ziLDl..oJhohwt0UlgmODQK', '+7 (993) 238-44-82', 'default-avatar.jpg', 'admin', '2026-04-16 07:37:19', '2026-04-16 08:26:12'),
(2, 'Администратор', 'admin@tourtohell.ru', '$2b$10$tF4qJ8KpXvY3zR5wN7mB9uL1kH6jG8fD2sA4qW5eR9tY7uI0oP3aS', '+7 (999) 123-45-67', 'default-avatar.jpg', 'admin', '2026-04-16 08:24:38', '2026-04-16 08:24:38');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Индексы таблицы `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tour_dates`
--
ALTER TABLE `tour_dates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Индексы таблицы `tour_images`
--
ALTER TABLE `tour_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `tour_dates`
--
ALTER TABLE `tour_dates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `tour_images`
--
ALTER TABLE `tour_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tour_dates`
--
ALTER TABLE `tour_dates`
  ADD CONSTRAINT `tour_dates_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `tour_images_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
