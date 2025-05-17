// Promo Products Data
const promoProducts = [
  {
    id: 1,
    name: "Logitech G Pro X Superlight",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "gaming-gear",
    brand: "logitech",
    price: 1599000,
    discountPrice: 1299000,
    discount: 19,
    inStock: true,
  },
  {
    id: 2,
    name: "ROG Strix Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    category: "peripherals",
    brand: "asus",
    price: 2100000,
    discountPrice: 1680000,
    discount: 20,
    inStock: true,
  },
  {
    id: 3,
    name: "HyperX Cloud II Headset",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    category: "gaming-gear",
    brand: "hyperx",
    price: 1800000,
    discountPrice: 1350000,
    discount: 25,
    inStock: true,
  },
  {
    id: 4,
    name: "Razer Viper Ultimate Mouse",
    image: "https://images.unsplash.com/photo-1519045944858-ee933876bc48",
    category: "gaming-gear",
    brand: "razer",
    price: 1950000,
    discountPrice: 1560000,
    discount: 20,
    inStock: true,
  },
];

// Blog Posts Data
const blogPosts = [
  {
    id: 1,
    title: "Memilih Mouse Gaming yang Tepat untuk Gaya Permainan Anda",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    date: "20 April 2023",
    category: "guides",
    excerpt:
      "Panduan lengkap untuk membantu Anda menemukan mouse gaming ideal yang sesuai dengan kebutuhan dan gaya bermain Anda.",
  },
  {
    id: 2,
    title: "10 Tips Meningkatkan Performa PC Gaming Anda",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    date: "15 April 2023",
    category: "tips",
    excerpt:
      "Kumpulan tips praktis untuk meningkatkan framerate dan pengalaman gaming tanpa harus upgrade hardware.",
  },
  {
    id: 3,
    title: "Mechanical vs Membrane Keyboard: Mana yang Lebih Baik?",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    date: "10 April 2023",
    category: "reviews",
    excerpt:
      "Perbandingan mendalam antara keyboard mechanical dan membrane untuk membantu Anda membuat keputusan pembelian yang tepat.",
  },
];

// DOM Elements for Cart
const cartIcon = document.querySelector('.cart-icon');
const cartBadge = document.getElementById('cart-badge');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsContainer = document.getElementById('cart-items');

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Load cart from localStorage
function loadCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart badge
function updateCartBadge() {
  const cart = loadCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
}

// Display cart items in dropdown
function displayCartItems() {
  const cart = loadCart();
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Keranjang kosong</div>';
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.discountPrice)}</div>
        <div class="cart-item-quantity">
          <button class="decrease-btn" data-index="${index}">-</button>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
          <button class="increase-btn" data-index="${index}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Add event listeners for quantity controls and remove buttons
  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.index, -1));
  });

  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.index, 1));
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', () => {
      const index = input.dataset.index;
      const value = parseInt(input.value);
      if (value >= 1) {
        updateQuantity(index, value - loadCart()[index].quantity);
      } else {
        input.value = 1;
        updateQuantity(index, 1 - loadCart()[index].quantity);
      }
    });
  });

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.index));
  });
}

// Update quantity
function updateQuantity(index, change) {
  const cart = loadCart();
  const newQuantity = cart[index].quantity + change;
  if (newQuantity >= 1) {
    cart[index].quantity = newQuantity;
    saveCart(cart);
    displayCartItems();
    updateCartBadge();
  }
}

// Remove item from cart
function removeItem(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCartItems();
  updateCartBadge();
}

// Toggle cart dropdown
cartIcon.addEventListener('click', () => {
  cartDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
  if (!event.target.closest('.cart-icon') && !event.target.closest('.cart-dropdown')) {
    cartDropdown.classList.remove('active');
  }
});

// Generate promo products
function loadPromoProducts() {
  const productsContainer = document.querySelector(".products-grid");

  if (!productsContainer) {
    console.error("Products container not found!");
    return;
  }

  let productsHTML = "";

  promoProducts.forEach((product) => {
    productsHTML += `
      <div class="product-card">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}">
        </div>
        ${
          product.discount > 0
            ? `<span class="product-discount">-${product.discount}%</span>`
            : ""
        }
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            ${
              product.discount > 0
                ? `<span class="original-price">${formatPrice(
                    product.price
                  )}</span>
                   <span class="discount-price">${formatPrice(
                     product.discountPrice
                   )}</span>`
                : `<span class="discount-price">${formatPrice(
                    product.price
                  )}</span>`
            }
          </div>
          ${!product.inStock ? '<p class="text-danger">Stok Habis</p>' : ""}
          <div class="product-actions">
            <a href="product-detail.html?id=${
              product.id
            }" class="btn btn-secondary">Lihat Detail</a>
            ${
              product.inStock
                ? `<button class="btn btn-primary add-to-cart" data-id="${product.id}">Keranjang</button>`
                : `<button class="btn btn-primary" disabled>Stok Habis</button>`
            }
          </div>
        </div>
      </div>
    `;
  });

  productsContainer.innerHTML = productsHTML;

  // Add event listeners for add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      addToCart(productId);
    });
  });

  console.log("Promo products loaded successfully");
}

// Add to cart function
function addToCart(productId) {
  const product = promoProducts.find(p => p.id === parseInt(productId));
  if (!product) return;

  let cart = loadCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      discountPrice: product.discountPrice,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
  displayCartItems();
  alert(`Produk ${product.name} ditambahkan ke keranjang!`);
}

// Generate blog posts
function loadBlogPosts() {
  const blogContainer = document.querySelector(".blog-grid");

  if (!blogContainer) {
    console.error("Blog container not found!");
    return;
  }

  let blogHTML = "";

  blogPosts.forEach((post) => {
    blogHTML += `
      <div class="blog-card">
        <div class="blog-img">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="blog-info">
          <div class="blog-meta">
            <div class="blog-date">
              <i class="far fa-calendar-alt"></i> ${post.date}
            </div>
            <div class="blog-category">
              <i class="far fa-folder"></i> ${getCategoryName(post.category)}
            </div>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="article.html?id=${post.id}" class="btn btn-secondary">Baca Selengkapnya</a>
        </div>
      </div>
    `;
  });

  blogContainer.innerHTML = blogHTML;

  console.log("Blog posts loaded successfully");
}

// Get category name for display
function getCategoryName(category) {
  const categories = {
    tips: "Tips & Trik",
    reviews: "Reviews",
    news: "Berita",
    guides: "Panduan",
  };
  return categories[category] || category;
}

// Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    console.log("Navigation menu toggled");
  });
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.padding = "0.5rem 0";
    navbar.style.backgroundColor = "rgba(21, 25, 34, 0.95)";
  } else {
    navbar.style.padding = "1rem 0";
    navbar.style.backgroundColor = "rgba(21, 25, 34, 0.9)";
  }
});

// Initialize the page
function initPage() {
  loadPromoProducts();
  loadBlogPosts();
  updateCartBadge();
  displayCartItems();
}

// Run when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  console.log("Page initialized");
});