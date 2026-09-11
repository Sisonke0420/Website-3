const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const cartStorageKey = "peak-performance-cart";

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header) {
      header.classList.remove("nav-open");
    }
  });
});

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

function getCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartStorageKey));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  updateCartCount(cart);
}

function updateCartCount(cart = getCart()) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('a[href="cart.html"]').forEach((link) => {
    link.textContent = `Cart (${itemCount})`;
  });
}

function getProductFromButton(button) {
  const productCard = button.closest("[data-product-id]");
  const dataSource = productCard || button;
  const color =
    document
      .querySelector(".swatches .active")
      ?.getAttribute("aria-label")
      ?.replace(" color", "") || "Standard";
  const size =
    document.querySelector(".size-grid .active")?.textContent.trim() ||
    "One size";

  return {
    id: dataSource.dataset.productId,
    name: dataSource.dataset.productName,
    price: Number(dataSource.dataset.productPrice),
    category: dataSource.dataset.productCategory,
    image: dataSource.dataset.productImage,
    color,
    size,
  };
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(
    (item) =>
      item.id === product.id &&
      item.color === product.color &&
      item.size === product.size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
}

function formatPrice(amount) {
  return `$${amount.toFixed(2).replace(".00", "")}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCart() {
  const cartItems = document.querySelector("[data-cart-items]");
  if (!cartItems) {
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    cartItems.innerHTML =
      '<div class="empty-cart"><h2>Your cart is waiting.</h2><p>Add a few performance essentials and they will appear here.</p><a class="btn btn-primary" href="shop.html">Continue shopping</a></div>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item" data-cart-id="${escapeHTML(item.id)}" data-cart-color="${escapeHTML(item.color)}" data-cart-size="${escapeHTML(item.size)}">
            <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)} product" />
            <div>
              <p class="section-kicker">${escapeHTML(item.category)} / ${escapeHTML(item.size)}</p>
              <h2>${escapeHTML(item.name)}</h2>
              <p>${escapeHTML(item.color)} / ${item.quantity} ${item.quantity === 1 ? "item" : "items"}</p>
              <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-control" aria-label="Quantity for ${escapeHTML(item.name)}">
                <button type="button" data-cart-action="decrease" aria-label="Decrease ${escapeHTML(item.name)} quantity">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-action="increase" aria-label="Increase ${escapeHTML(item.name)} quantity">+</button>
              </div>
              <button class="remove-item" type="button" data-cart-action="remove">Remove</button>
            </div>
          </article>`,
      )
      .join("");
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const subtotalElement = document.querySelector("[data-cart-subtotal]");
  const totalElement = document.querySelector("[data-cart-total]");
  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
  if (totalElement) totalElement.textContent = formatPrice(subtotal);
}

function updateShopProducts() {
  const shopGrid = document.querySelector(".product-grid");
  const filterButtons = document.querySelectorAll(".chip[data-filter]");
  const sortSelect = document.querySelector(".sort-box select");
  if (!shopGrid || !filterButtons.length || !sortSelect) {
    return;
  }

  const activeFilter =
    document.querySelector(".chip.active")?.dataset.filter || "all";
  const products = [...shopGrid.querySelectorAll("[data-product-category]")];

  products.sort((firstProduct, secondProduct) => {
    if (sortSelect.value === "price-asc") {
      return (
        Number(firstProduct.dataset.productPrice) -
        Number(secondProduct.dataset.productPrice)
      );
    }
    if (sortSelect.value === "price-desc") {
      return (
        Number(secondProduct.dataset.productPrice) -
        Number(firstProduct.dataset.productPrice)
      );
    }
    return 0;
  });

  products.forEach((product) => {
    const matchesFilter =
      activeFilter === "all" ||
      product.dataset.productCategory === activeFilter;
    product.hidden = !matchesFilter;
    shopGrid.appendChild(product);
  });
}

document.querySelectorAll(".chip[data-filter]").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    document.querySelectorAll(".chip[data-filter]").forEach((button) => {
      button.classList.toggle("active", button === filterButton);
    });
    updateShopProducts();
  });
});

const shopSort = document.querySelector(".sort-box select");
if (shopSort) {
  shopSort.addEventListener("change", updateShopProducts);
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-to-cart");
  if (addButton) {
    addToCart(getProductFromButton(addButton));
    const originalLabel = addButton.textContent;
    addButton.textContent = "Added";
    window.setTimeout(() => {
      addButton.textContent = originalLabel;
    }, 900);
    return;
  }

  const cartAction = event.target.closest("[data-cart-action]");
  if (!cartAction) {
    return;
  }

  const cartItem = cartAction.closest("[data-cart-id]");
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (item) =>
      item.id === cartItem.dataset.cartId &&
      item.color === cartItem.dataset.cartColor &&
      item.size === cartItem.dataset.cartSize,
  );
  if (itemIndex < 0) {
    return;
  }

  const action = cartAction.dataset.cartAction;
  if (action === "increase") cart[itemIndex].quantity += 1;
  if (action === "decrease") cart[itemIndex].quantity -= 1;
  if (action === "remove" || cart[itemIndex].quantity <= 0)
    cart.splice(itemIndex, 1);
  saveCart(cart);
  renderCart();
});

document
  .querySelectorAll(".size-grid button, .swatches button")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentElement
        .querySelectorAll("button")
        .forEach((sibling) => sibling.classList.remove("active"));
      option.classList.add("active");
    });
  });

updateCartCount();
renderCart();
updateShopProducts();

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}
