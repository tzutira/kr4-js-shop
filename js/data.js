// набор данных связывает каталог, страницу товара и форму заявки
const watchProducts = {
  "1": {
    id: "1",
    name: "Rolex Datejust с рифлёным безелем",
    brand: "Rolex",
    description: "Чёрный циферблат с окном даты, рифлёный безель и стальной браслет Jubilee.",
    price: "96 500 ₽",
    color: "Чёрный",
    category: "Автоматический механизм",
    badge: ""
  },

  "2": {
    id: "2",
    name: "Jacob & Co. Epic X Skeleton",
    brand: "Jacob & Co.",
    description: "Открытый механизм в круглом серебристом корпусе и чёрный кожаный ремешок.",
    price: "127 000 ₽",
    color: "Серебристый",
    category: "Ручной завод",
    badge: ""
  },

  "3": {
    id: "3",
    name: "Cartier Tank",
    brand: "Cartier",
    description: "Прямоугольный стальной корпус, белый циферблат с римскими цифрами и синие стрелки.",
    price: "78 000 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    badge: ""
  },

  "4": {
    id: "4",
    name: "Rolex Submariner",
    brand: "Rolex",
    description: "Чёрный вращающийся безель, крупные часовые метки и стальной браслет.",
    price: "109 000 ₽",
    color: "Чёрный",
    category: "Автоматический механизм",
    badge: ""
  },

  "5": {
    id: "5",
    name: "Vacheron Constantin Traditionnelle Skeleton",
    brand: "Vacheron Constantin",
    description: "Серебристый скелетонированный циферблат с открытыми колёсами механизма и чёрный ремешок.",
    price: "115 500 ₽",
    color: "Серебристый",
    category: "Ручной завод",
    badge: ""
  },

  "6": {
    id: "6",
    name: "Longines La Grande Classique",
    brand: "Longines",
    description: "Светлый циферблат с тонкими метками, круглый корпус и чёрный кожаный ремешок.",
    price: "48 500 ₽",
    color: "Белый",
    category: "Кварцевый механизм",
    badge: ""
  },

  "7": {
    id: "7",
    name: "Cartier с асимметричным корпусом",
    brand: "Cartier",
    description: "Асимметричный корпус, римские цифры, синие стрелки и браслет с рельефным орнаментом.",
    price: "118 500 ₽",
    color: "Серебристый",
    category: "Ручной завод",
    badge: ""
  },

  "8": {
    id: "8",
    name: "Rolex Datejust",
    brand: "Rolex",
    description: "Чёрный циферблат с окном даты и массивный браслет с рельефными звеньями.",
    price: "139 900 ₽",
    color: "Чёрный",
    category: "Автоматический механизм",
    badge: ""
  },

  "9": {
    id: "9",
    name: "Cartier с квадратным корпусом",
    brand: "Cartier",
    description: "Квадратный корпус, белый циферблат с римскими цифрами и коричневый ремешок.",
    price: "79 500 ₽",
    color: "Белый",
    category: "Ручной завод",
    badge: ""
  },

  "10": {
    id: "10",
    name: "Sekonda с синим циферблатом",
    brand: "Sekonda",
    description: "Круглый синий циферблат с окном даты и серебристый браслет.",
    price: "18 500 ₽",
    color: "Синий",
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
