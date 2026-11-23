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

if (cartList) {
  const cartTotal = document.querySelector('#cart-total');
  const cartEmpty = document.querySelector('#cart-empty');
  const catalogLink = document.querySelector('#cart-catalog-link');

  function renderCart(ids) {
    const cartProducts = ids.map((id) => findProductById(products, id));
    cartList.textContent = '';
    cartList.hidden = cartProducts.length === 0;
    cartEmpty.hidden = cartProducts.length > 0;

    cartProducts.forEach((product) => {
      const item = document.createElement('li');
      const title = document.createElement('a');
      title.href = `product.html?product=${product.id}`;
      title.textContent = product.title;
      const price = document.createElement('span');
      price.textContent = formatPrice(product.price);
      const removeButton = document.createElement('button');
      removeButton.classList.add('button', 'button--secondary');
      removeButton.type = 'button';
      removeButton.dataset.removeId = String(product.id);
      removeButton.textContent = 'Удалить';
      removeButton.setAttribute('aria-label', `Удалить ${product.title}`);
      item.append(title, price, removeButton);
      cartList.append(item);
    });

    const total = calculateTotalPrice(cartProducts);
    cartTotal.textContent = formatPrice(total);
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
