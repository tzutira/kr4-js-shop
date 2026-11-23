// набор данных связывает каталог, страницу товара и форму заявки
const watchProducts = {
  "1": {
    id: "1",
    name: "NOIR Archive 01",
    brand: "NOIR",
    description: "Чёрный циферблат, стальной корпус и сдержанная винтажная эстетика.",
    price: "68 500 ₽",
    color: "Чёрный",
    category: "Ручной завод",
    badge: ""
  },

  "2": {
    id: "2",
    name: "NOIR Archive 02",
    brand: "NOIR",
    description: "Открытый механизм, серебристый корпус и чёрный кожаный ремешок.",
    price: "84 900 ₽",
    color: "Серебристый",
    category: "Автоматический механизм",
    badge: ""
  },

  "3": {
    id: "3",
    name: "NOIR Archive 03",
    brand: "NOIR",
    description: "Прямоугольный корпус, светлый циферблат и римские цифры.",
    price: "52 000 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    badge: ""
  },

  "4": {
    id: "4",
    name: "NOIR Archive 04",
    brand: "NOIR",
    description: "Тёмный циферблат и выразительный силуэт стального корпуса.",
    price: "96 000 ₽",
    color: "Чёрный",
    category: "Автоматический механизм",
    badge: ""
  },

  "5": {
    id: "5",
    name: "NOIR Archive 05",
    brand: "NOIR",
    description: "Скелетонизированный циферблат и серебристая архитектура механизма.",
    price: "73 500 ₽",
    color: "Серебристый",
    category: "Ручной завод",
    badge: ""
  },

  "6": {
    id: "6",
    name: "NOIR Archive 06",
    brand: "NOIR",
    description: "Минималистичный циферблат и спокойный повседневный характер.",
    price: "45 000 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    badge: ""
  }
};

const products = Object.values(watchProducts).map((watch) => ({
  id: Number(watch.id),
  title: watch.name,
  category: watch.category,
  price: Number(watch.price.replace(/\D/g, '')),
  isAvailable: true,
  image: `images/archive-${watch.id}-front-640.png`,
  description: watch.description
}));

const practice16Products = [
  {
    id: 1,
    title: 'Кофемашина Barista Home',
    category: 'kitchen',
    price: 19990,
    discountPercent: 10,
    rating: 4.7,
    isAvailable: true
  },
  {
    id: 2,
    title: 'Электрический чайник SmartHeat',
    category: 'kitchen',
    price: 4990,
    discountPercent: 0,
    rating: 4.5,
    isAvailable: true
  },
  {
    id: 3,
    title: 'Робот-пылесос CleanBot',
    category: 'home',
    price: 24990,
    discountPercent: 15,
    rating: 4.8,
    isAvailable: false
  },
  {
    id: 4,
    title: 'Умная лампа LightSpace',
    category: 'home',
    price: 2990,
    discountPercent: 5,
    rating: 4.4,
    isAvailable: true
  },
  {
    id: 5,
    title: 'Наушники SoundPro',
    category: 'electronics',
    price: 7990,
    discountPercent: 10,
    rating: 4.6,
    isAvailable: true
  },
  {
    id: 6,
    title: 'Портативная колонка BassBox',
    category: 'electronics',
    price: 5990,
    discountPercent: 0,
    rating: 4.3,
    isAvailable: false
  }
];
