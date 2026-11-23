const cartStorageKey = 'noir-cart';
const cartMessage = document.querySelector('#cart-message');
const cartList = document.querySelector('#cart-items');

function readCart() {
  try {
    const savedIds = JSON.parse(localStorage.getItem(cartStorageKey));
    if (Array.isArray(savedIds)) {
      return [...new Set(savedIds)].filter((id) => findProductById(products, id)?.isAvailable);
    }
  } catch {
    // Повреждённые или недоступные данные дают пустую корзину.
  }
  return [];
}

function saveCart(ids) {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(ids));
    return true;
  } catch {
    cartMessage.textContent = 'Не удалось сохранить корзину в браузере.';
    return false;
  }
}

function addToCart(product) {
  const ids = readCart();
  if (ids.includes(product.id)) {
    cartMessage.textContent = `${product.title} уже в корзине.`;
    return;
  }

  if (saveCart([...ids, product.id])) {
    cartMessage.textContent = `${product.title} добавлен в корзину.`;
  }
}

if (cartMessage && !cartList) {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="add-to-cart"]');
    if (!button) return;

    const product = findProductById(products, Number(button.dataset.productId));
    if (product?.isAvailable) addToCart(product);
  });
}

if (cartList) {
  const cartTotal = document.querySelector('#cart-total');
  const cartEmpty = document.querySelector('#cart-empty');
  const catalogLink = document.querySelector('#cart-catalog-link');
  const promoForm = document.querySelector('#cart-promo');
  const promoInput = document.querySelector('#cart-promo-code');
  const promoMessage = document.querySelector('#cart-promo-message');
  const discountLine = document.querySelector('#cart-discount');
  const discountValue = document.querySelector('#cart-discount-value');
  const promoCode = 'SALE15';
  const discountPercent = 15;
  let subtotal = 0;
  let promoApplied = false;

  function updateCartTotal() {
    const discount = promoApplied ? Math.round(subtotal * discountPercent) / 100 : 0;
    discountLine.hidden = !promoApplied;
    discountValue.textContent = formatPrice(discount);
    cartTotal.textContent = formatPrice(subtotal - discount);
  }

  function clearPromoFeedback() {
    promoInput.removeAttribute('aria-invalid');
    promoInput.removeAttribute('aria-describedby');
    promoMessage.textContent = '';
  }

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (promoForm.hidden) return;

    const code = promoInput.value.trim().toUpperCase();
    promoApplied = code === promoCode;
    clearPromoFeedback();
    if (promoApplied) {
      promoMessage.textContent = 'Промокод применён.';
    } else if (code) {
      promoMessage.textContent = 'Промокод недействителен.';
      promoInput.setAttribute('aria-invalid', 'true');
      promoInput.setAttribute('aria-describedby', promoMessage.id);
      promoInput.focus();
    } else {
      promoMessage.textContent = 'Введите промокод.';
    }
    updateCartTotal();
  });

  promoInput.addEventListener('input', () => {
    if (promoInput.hasAttribute('aria-invalid')) clearPromoFeedback();
  });

  function renderCart(ids) {
    const cartProducts = ids.map((id) => findProductById(products, id));
    cartList.textContent = '';
    cartList.hidden = cartProducts.length === 0;
    cartEmpty.hidden = cartProducts.length > 0;

    cartProducts.forEach((product) => {
      const item = document.createElement('li');
      item.classList.add('cart-item');

      const photo = document.createElement('img');
      photo.classList.add('cart-item__photo');
      photo.width = 640;
      photo.height = 640;
      photo.alt = '';
      photo.loading = 'lazy';
      photo.sizes = '(min-width: 48rem) 240px, 25vw';
      setWatchImageSource(photo, product.image);

      const description = document.createElement('div');
      description.classList.add('cart-item__description');
      const title = document.createElement('a');
      title.classList.add('cart-item__title');
      title.href = `product.html?product=${product.id}`;
      title.textContent = product.title;
      const text = document.createElement('p');
      text.textContent = product.description;
      description.append(title, text);

      const actions = document.createElement('div');
      actions.classList.add('cart-item__actions');
      const price = document.createElement('span');
      price.textContent = formatPrice(product.price);
      const removeButton = document.createElement('button');
      removeButton.classList.add('button', 'button--secondary');
      removeButton.type = 'button';
      removeButton.dataset.removeId = String(product.id);
      removeButton.textContent = 'Удалить';
      removeButton.setAttribute('aria-label', `Удалить ${product.title}`);
      actions.append(price, removeButton);
      item.append(photo, description, actions);
      cartList.append(item);
    });

    subtotal = calculateTotalPrice(cartProducts);
    promoForm.hidden = cartProducts.length === 0;
    if (promoForm.hidden) {
      promoApplied = false;
      promoForm.reset();
      clearPromoFeedback();
    }
    updateCartTotal();
  }

  renderCart(readCart());

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) renderCart(readCart());
  });

  window.addEventListener('storage', (event) => {
    if (event.key === cartStorageKey || event.key === null) renderCart(readCart());
  });

  cartList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-id]');
    if (!button) return;

    const id = Number(button.dataset.removeId);
    const product = findProductById(products, id);
    const updatedIds = readCart().filter((savedId) => savedId !== id);
    if (!saveCart(updatedIds)) return;

    renderCart(updatedIds);
    cartMessage.textContent = `${product.title} удалён из корзины.`;
    const nextControl = cartList.querySelector('[data-remove-id]') || catalogLink;
    nextControl.focus();
  });
}
