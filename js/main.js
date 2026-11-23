const params = new URLSearchParams(window.location.search);
const selectedWatch = watchProducts[params.get('product')] || watchProducts['1'];
const productTitle = document.getElementById('product-title');
if (productTitle) {
  productTitle.textContent = selectedWatch.name;
  document.title = `${selectedWatch.name} — NOIR`;
  document.getElementById('product-breadcrumb').textContent = selectedWatch.name;
  document.getElementById('product-description').textContent = selectedWatch.description;
  const price = document.getElementById('product-price');
  price.textContent = selectedWatch.price;
  price.classList.toggle('product-detail__price--discount', selectedWatch.badge === 'Скидка');
  document.getElementById('product-color').textContent = selectedWatch.color;
  document.getElementById('product-category').textContent = selectedWatch.category;
  const image = document.getElementById('product-image');
  image.src = `images/archive-${selectedWatch.id}-front-640.png`;
  image.srcset = `images/archive-${selectedWatch.id}-front-320.png 320w, images/archive-${selectedWatch.id}-front-640.png 640w`;
  image.closest("[data-gallery]").dataset.gallery = selectedWatch.id;
  image.closest("[data-gallery]").setAttribute("aria-label", `Ракурсы ${selectedWatch.name}`);
  document.querySelectorAll("[data-spec]").forEach(el => el.textContent = selectedWatch[el.dataset.spec]);
  image.alt = `${selectedWatch.name} — вид спереди, студийная визуализация`;
  document.getElementById('product-order-button').dataset.product = selectedWatch.name;
}

const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const selectedProductInput = document.getElementById('selected-product');
const orderTopicSelect = document.getElementById('order-topic');
const successMessage = document.getElementById('success-message');

let dialogOpener = null;
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.classList.remove(getFieldErrorClass(field));
  const error = document.getElementById(`${field.id}-error`);
  if (error) { error.textContent = ''; error.hidden = true; }
}
function clearErrors() {
  Array.from(orderForm.elements).forEach(clearFieldError);
}
function openOrder(name = '') {
  dialogOpener = document.activeElement;
  orderForm.reset();
  clearErrors();
  successMessage.hidden = true;
  selectedProductInput.value = name;
  orderTopicSelect.value = name ? 'product' : 'consultation';
  orderDialog.showModal();
  // Заголовок сообщает назначение окна; фон блокирует нативный dialog.
  document.getElementById('order-dialog-title').focus();
}
orderDialog?.addEventListener('close', () => {
  if (orderDialog.open) return;
  if (successMessage.hidden) dialogOpener?.focus();
  else successMessage.focus();
});
// Цикл Tab остаётся в окне, включая переход назад с заголовка.
orderDialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = Array.from(orderDialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]'))
    .filter((element) => !element.disabled && element.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === document.getElementById('order-dialog-title'))) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
document.querySelectorAll('.product-card__button[data-product]').forEach((button) => {
  button.addEventListener('click', () => openOrder(button.dataset.product));
});
document.getElementById('open-order-dialog')?.addEventListener('click', () => openOrder());
document.getElementById('close-order-dialog')?.addEventListener('click', () => orderDialog.close());

// На отдельной странице заявки выбранный товар берётся из адреса.
if (orderForm && !orderDialog && watchProducts[params.get('product')]) {
  selectedProductInput.value = selectedWatch.name;
  orderTopicSelect.value = 'product';
}
selectedProductInput?.addEventListener('change', () => {
  const chosenProduct = Object.values(watchProducts).find((item) => item.name === selectedProductInput.value);
  orderTopicSelect.value = chosenProduct ? 'product' : 'consultation';
});
function getFieldErrorClass(field) {
  if (field.type === 'checkbox') return 'order-form__checkbox--error';
  if (field.tagName === 'SELECT') return 'order-form__select--error';
  if (field.tagName === 'TEXTAREA') return 'order-form__textarea--error';
  return 'order-form__input--error';
}
function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    return field.type === 'checkbox' ? 'Подтвердите согласие, чтобы продолжить.' : 'Заполните обязательное поле.';
  }
  if (field.validity.typeMismatch) return 'Введите корректный e-mail, например name@example.ru.';
  if (field.validity.patternMismatch) return 'Введите телефон в формате +7 (900) 000-00-00.';
  if (field.validity.tooShort) return `Введите не менее ${field.minLength} символов.`;
  return field.validationMessage;
}
function showFieldError(field, message = getErrorMessage(field)) {
  field.setAttribute('aria-invalid', 'true');
  field.classList.add(getFieldErrorClass(field));
  const error = document.getElementById(`${field.id}-error`);
  if (error) { error.textContent = message; error.hidden = false; }
}
function updateFieldError(event) {
  const field = event.target;
  if (!field.hasAttribute('aria-invalid')) return;
  if (field.validity.valid) clearFieldError(field);
  else showFieldError(field);
}
if (orderForm && !orderForm.querySelector('.form-message')) {
  orderForm.addEventListener('input', updateFieldError);
  orderForm.addEventListener('change', updateFieldError);
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.hidden = true;
    clearErrors();
    const invalidFields = Array.from(orderForm.elements).filter((field) => field.willValidate && !field.validity.valid);
    if (invalidFields.length) {
      invalidFields.forEach((field) => showFieldError(field));
      invalidFields[0].focus();
      return;
    }
    successMessage.hidden = false;
    orderForm.reset();
    if (orderDialog) orderDialog.close();
    else successMessage.focus();
  });
}

// Меню остаётся обычной навигацией без JS; на телефоне работает как disclosure.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('site-navigation');
const wideNavigation = matchMedia('(min-width: 1200px)');
function setMenu(open, returnFocus = false) {
  navigation.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.innerHTML = `${open ? 'Закрыть' : 'Меню'} <span aria-hidden="true">${open ? '−' : '＋'}</span>`;
  if (returnFocus) menuButton.focus();
}
function syncMenu() {
  const focusedLink = navigation.contains(document.activeElement);
  menuButton.hidden = wideNavigation.matches;
  setMenu(wideNavigation.matches, !wideNavigation.matches && focusedLink);
}
if (menuButton && navigation) {
  syncMenu();
  wideNavigation.addEventListener('change', syncMenu);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !wideNavigation.matches) setMenu(false, true);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a') && !wideNavigation.matches) setMenu(false, true);
  });
}

// Ручные карусели: без таймера, жестов с блокировкой вертикальной прокрутки и скрытых ссылок.
const angleNames = ['Спереди', 'Сбоку', 'Сзади'];
const angleFiles = ['front', 'side', 'back'];
function initWatchGallery(gallery) {
  const id = gallery.dataset.gallery;
  const image = gallery.querySelector('img');
  let index = 0;
  function show(next) {
    index = (next + 3) % 3;
    const base = `images/archive-${id}-${angleFiles[index]}`;
    image.src = `${base}-640.png`;
    image.srcset = `${base}-320.png 320w, ${base}-640.png 640w`;
    image.alt = `${watchProducts[id].name} — вид ${angleNames[index].toLowerCase()}, студийная визуализация`;
    gallery.querySelector('.watch-gallery__status').textContent = `${angleNames[index]} · ${index + 1} / 3`;
  }
  gallery.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(index + Number(button.dataset.step))));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let start = null;
  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && !event.target.closest('button')) start = { x: event.clientX, y: event.clientY };
  });
  gallery.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    start = null;
  });
  gallery.addEventListener('pointercancel', () => { start = null; });
}
document.querySelectorAll('[data-gallery]').forEach(initWatchGallery);

document.documentElement.classList.add("js-ready");

console.log('Файл main.js подключён');
console.log(practice16Products);
console.table(practice16Products);

function getProductTitles(products) {
  return products.map((product) => product.title);
}
const productTitles = getProductTitles(practice16Products);
console.log(productTitles);

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}
const availableProducts = getAvailableProducts(practice16Products);
console.table(availableProducts);

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return products;
  }
  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}
const searchResult = searchProducts(practice16Products, 'кофе');
console.table(searchResult);

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }
  return products.filter((product) => {
    return product.category === category;
  });
}
const kitchenProducts = filterProductsByCategory(practice16Products, 'kitchen');
console.table(kitchenProducts);

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];
  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }
  return productsCopy.sort((a, b) => a.price - b.price);
}
const productsSortedByPrice = sortProductsByPrice(practice16Products, 'asc');
console.table(productsSortedByPrice);

console.table(sortProductsByPrice(practice16Products, 'desc'));

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}
const selectedProduct = findProductById(practice16Products, 3);
if (selectedProduct) {
  console.log(`Найден товар: ${selectedProduct.title}`);
} else {
  console.log('Товар не найден');
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
}
const totalPrice = calculateTotalPrice(practice16Products);
console.log(totalPrice);

function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}
const availableCount = countAvailableProducts(practice16Products);
console.log(availableCount);

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }
  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}
const averagePrice = calculateAveragePrice(practice16Products);
console.log(averagePrice);

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];
  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);
  return result;
}
const preparedProducts = getPreparedProducts(practice16Products, 'ко', 'kitchen', 'asc');
console.table(preparedProducts);

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');
if (messageElement) {
  messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}
if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${practice16Products.length}`,
    `Товаров в наличии: ${countAvailableProducts(practice16Products)}`,
    `Средняя цена: ${calculateAveragePrice(practice16Products)} руб.`,
    `Результатов поиска "ко": ${searchProducts(practice16Products, 'ко').length}`
  ].join('\n');
}
