const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');
const catalogGallery = document.querySelector('#catalog-gallery');

if (!productsContainer) {
  console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

function sortProducts(products, sortType) {
  const productsCopy = [...products];

  if (sortType === 'price-asc') {
    return productsCopy.sort((a, b) => a.price - b.price);
  }

  if (sortType === 'price-desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  if (sortType === 'title-asc') {
    return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
  }

  return productsCopy;
}

function getCatalogProducts(products, state) {
  let result = searchProducts(products, state.query);
  result = filterProductsByCategory(result, state.category);
  result = sortProducts(result, state.sort);
  return result;
}

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  const gallery = catalogGallery.content.firstElementChild.cloneNode(true);
  gallery.dataset.gallery = String(product.id);
  gallery.setAttribute('aria-label', `Ракурсы ${product.title}`);
  const image = gallery.querySelector('img');
  image.src = product.image;
  image.srcset = `${product.image.replace('-640.png', '-320.png')} 320w, ${product.image} 640w`;
  image.alt = `${product.title} — вид спереди, студийная визуализация`;
  initWatchGallery(gallery);

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  const productUrl = `product.html?product=${product.id}`;
  const productLink = document.createElement('a');
  productLink.href = productUrl;
  productLink.textContent = product.title;
  title.append(productLink);

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = formatPrice(product.price);

  const status = document.createElement('p');
  status.classList.add('product-card__status');
  status.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';

  const details = document.createElement('a');
  details.classList.add('product-card__details');
  details.href = productUrl;
  details.textContent = 'Подробнее';

  const orderButton = document.createElement('button');
  orderButton.classList.add('button', 'button--primary', 'product-card__button');
  orderButton.type = 'button';
  orderButton.textContent = 'Заказать';
  orderButton.dataset.action = 'order';
  orderButton.dataset.productId = String(product.id);
  orderButton.disabled = !product.isAvailable;

  const button = document.createElement('button');
  button.classList.add('button', 'button--secondary', 'product-card__button');
  button.type = 'button';
  button.textContent = 'В корзину';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Недоступно';
  }

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');
  actions.append(details, orderButton, button);
  card.append(gallery, title, description, price, status, actions);

  return card;
}

function renderProducts(productsToRender) {
  productsContainer.textContent = '';

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

function updateCatalog() {
  const preparedProducts = getCatalogProducts(products, catalogState);
  renderProducts(preparedProducts);
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (productsContainer) {
  updateCatalog();

  productsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action][data-product-id]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find((product) => product.id === productId);

    if (!selectedProduct) {
      console.warn('Товар не найден:', productId);
      return;
    }

    if (button.dataset.action === 'order') {
      openOrder(selectedProduct.title);
      return;
    }

    console.log(`Товар добавлен в корзину: ${selectedProduct.title}`);
  });
}

const filterDetails = document.querySelector('.filter-disclosure');
if (filterDetails) {
  filterDetails.open = matchMedia('(min-width: 1024px)').matches;
}
