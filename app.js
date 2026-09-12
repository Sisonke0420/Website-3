const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const cartStorageKey = "peak-performance-cart";

const productCatalog = {
  "velocity-runner": {
    name: "Velocity Runner",
    category: "Running / Peak Motion",
    price: 178,
    image: "assets/img5.webp",
    alt: "Runner wearing the Velocity Runner shoes",
    badge: "Best seller",
    lead: "A responsive daily trainer for fast miles, long loops, and every plan that starts with one more step.",
    storyTitle: "Light on your feet. Serious under pressure.",
    story: [
      "Velocity pairs a springy foam platform with a stable heel and a breathable upper that keeps pace when the route gets longer.",
      "Designed in New York and tested across road, track, and city miles.",
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  "motion-tank": {
    name: "Motion Tank",
    category: "Training / Peak Motion",
    price: 96,
    image: "assets/img9.webp",
    alt: "Athlete training in the Motion Tank",
    badge: "Training essential",
    lead: "A breathable training layer with a clean fit that stays comfortable through every set, sprint, and reset.",
    storyTitle: "Freedom in every repetition.",
    story: [
      "The Motion Tank uses lightweight stretch fabric and mapped airflow to keep hard sessions feeling uncluttered.",
      "Cut for movement, finished for the hours before and after training.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  "trail-pack": {
    name: "Trail Pack",
    category: "Essentials / Peak Motion",
    price: 134,
    image: "assets/img10.webp",
    alt: "Runner outdoors with the Trail Pack",
    badge: "Adventure ready",
    lead: "Hydration-ready storage for long days on the move, with room for the essentials and nothing that slows you down.",
    storyTitle: "Carry less. Go farther.",
    story: [
      "Trail Pack balances close-to-body stability with easy access to the things you need between miles.",
      "Built for commutes, trailheads, and the unplanned extension of the route.",
    ],
    sizes: ["One size"],
  },
  "forge-hoodie": {
    name: "Forge Hoodie",
    category: "Training / Peak Motion",
    price: 118,
    image: "assets/img6.webp",
    alt: "Runner wearing the Forge Hoodie outdoors",
    badge: "New layer",
    lead: "Warmth, freedom, and a tailored fit that stays sharp from warm-up to wind-down.",
    storyTitle: "Built for the in-between.",
    story: [
      "Forge Hoodie adds soft warmth without the bulk, making it an easy layer for changing weather and changing plans.",
      "A structured silhouette keeps it ready for the street after the session.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  "pulse-gloves": {
    name: "Pulse Gloves",
    category: "Recovery / Peak Motion",
    price: 72,
    image: "assets/img8.webp",
    alt: "Athlete wearing Pulse Gloves before training",
    badge: "Cold weather essential",
    lead: "Grip and support that keep your focus where it belongs when the temperature drops.",
    storyTitle: "Keep your hands in the work.",
    story: [
      "Pulse Gloves combine a secure palm grip with flexible warmth for early starts and late finishes.",
      "Touch-compatible fingertips keep your route, music, and messages close.",
    ],
    sizes: ["S", "M", "L"],
  },
  "summit-bottle": {
    name: "Summit Bottle",
    category: "Hydration / Peak Motion",
    price: 39,
    image: "assets/img4.webp",
    alt: "Summit Bottle beside a group of runners",
    badge: "Daily essential",
    lead: "Insulated performance in a sleek bottle built for daily use, long sessions, and wherever the day takes you.",
    storyTitle: "Stay ready for another mile.",
    story: [
      "Summit Bottle keeps water cold and easy to carry with a slim profile that fits into your everyday rhythm.",
      "Durable, reusable, and sized for the work between the big efforts.",
    ],
    sizes: ["One size"],
  },
};

document.body.insertAdjacentHTML(
  "afterbegin",
  '<div class="demo-banner" role="status"><strong>Demo experience</strong><span>Front-end preview only. No orders or payments are processed.</span></div>',
);

document.querySelectorAll(".site-footer .footer-wrap").forEach((footer) => {
  footer.insertAdjacentHTML(
    "beforeend",
    '<nav class="footer-links" aria-label="Support and policies"><a href="policies.html#shipping">Shipping & returns</a><a href="policies.html#faq">FAQ</a><a href="policies.html#privacy">Privacy</a><a href="policies.html#terms">Terms</a></nav>',
  );
});

if (menuButton && header) {
  const mainNav = document.querySelector(".main-nav");
  if (mainNav) {
    mainNav.id = "main-navigation";
    menuButton.setAttribute("aria-controls", mainNav.id);
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton.addEventListener("click", () => {
    header.classList.toggle("nav-open");
    menuButton.setAttribute(
      "aria-expanded",
      String(header.classList.contains("nav-open")),
    );
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
  return `R${amount.toFixed(2).replace(".00", "")}`;
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
  const checkoutLink = document.querySelector("[data-checkout-link]");
  if (checkoutLink) {
    checkoutLink.href = cart.length ? "checkout.html" : "shop.html";
    checkoutLink.textContent = cart.length ? "Checkout" : "Continue shopping";
    checkoutLink.setAttribute("aria-disabled", String(!cart.length));
  }
}

function renderCheckout() {
  const checkoutItems = document.querySelector("[data-checkout-items]");
  if (!checkoutItems) {
    return;
  }

  const cart = getCart();
  checkoutItems.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
            <div class="checkout-item">
              <div class="checkout-item-image"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" /><span>${item.quantity}</span></div>
              <div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.color)} / ${escapeHTML(item.size)}</small></div>
              <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>`,
        )
        .join("")
    : '<p class="checkout-empty">Your cart is empty. <a href="shop.html">Return to shop</a></p>';

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  document
    .querySelectorAll(
      "[data-checkout-subtotal], [data-checkout-total], [data-checkout-button-total]",
    )
    .forEach((element) => {
      element.textContent = formatPrice(subtotal);
    });
  const submitButton = document.querySelector(".checkout-submit");
  if (submitButton && !cart.length) {
    submitButton.disabled = true;
    submitButton.textContent = "Add items to checkout";
  }
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

function renderProductDetails() {
  const productPage = document.querySelector("[data-product-page]");
  if (!productPage) return;

  const productKey = new URLSearchParams(window.location.search).get("product");
  const product =
    productCatalog[productKey] || productCatalog["velocity-runner"];
  const setText = (selector, value) => {
    const element = productPage.querySelector(selector);
    if (element) element.textContent = value;
  };

  document.title = `${product.name} | Peak Performance`;
  setText("[data-product-category]", product.category);
  setText("[data-product-name]", product.name);
  setText("[data-product-price]", formatPrice(product.price));
  setText("[data-product-lead]", product.lead);
  setText("[data-product-badge]", product.badge);
  const storyTitle = document.querySelector("[data-product-story-title]");
  if (storyTitle) storyTitle.textContent = product.storyTitle;
  productPage.querySelector("[data-product-image]").src = product.image;
  productPage.querySelector("[data-product-image]").alt = product.alt;
  document.querySelector("[data-product-story]").innerHTML = product.story
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");

  productPage.querySelector(".size-grid").innerHTML = product.sizes
    .map(
      (size, index) =>
        `<button type="button" class="${index === 0 ? "active" : ""}" aria-pressed="${index === 0}">${size}</button>`,
    )
    .join("");

  const addButton = productPage.querySelector(".add-to-cart");
  addButton.dataset.productId = productKey || "velocity-runner";
  addButton.dataset.productName = product.name;
  addButton.dataset.productPrice = product.price;
  addButton.dataset.productCategory = product.category.split(" /")[0];
  addButton.dataset.productImage = product.image;
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

  if (cartAction.dataset.cartAction === "clear") {
    saveCart([]);
    renderCart();
    renderCheckout();
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

renderProductDetails();

document
  .querySelectorAll(".size-grid button, .swatches button")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentElement
        .querySelectorAll("button")
        .forEach((sibling) => sibling.classList.remove("active"));
      option.classList.add("active");
      option.parentElement.querySelectorAll("button").forEach((sibling) => {
        sibling.setAttribute("aria-pressed", sibling === option);
      });
    });
  });

updateCartCount();
renderCart();
renderCheckout();
updateShopProducts();

const checkoutForm = document.querySelector("[data-checkout-form]");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const successMessage = document.querySelector("[data-checkout-success]");
    if (!checkoutForm.reportValidity() || !successMessage) {
      return;
    }
    checkoutForm
      .querySelectorAll(
        ".checkout-section, .checkout-submit, .checkout-disclaimer",
      )
      .forEach((element) => {
        element.hidden = true;
      });
    successMessage.hidden = false;
    localStorage.removeItem(cartStorageKey);
    updateCartCount([]);
  });
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    contactForm.hidden = true;
    const successMessage = document.querySelector("[data-contact-success]");
    if (successMessage) successMessage.hidden = false;
  });
}

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
