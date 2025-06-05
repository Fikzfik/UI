/**
 * GamerTech Enhanced - Main JavaScript File
 * 
 * This file contains all the interactive functionality for the GamerTech website
 * including navigation, animations, cart management, catalog, and user interactions.
 * 
 * Author: GamerTech Development Team
 * Version: 2.0.0
 * Last Updated: 2025
 */

// ===================================
// GLOBAL VARIABLES & CONFIGURATION
// ===================================

const CONFIG = {
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    TYPING_SPEED: 50,
    API_BASE_URL: '/api',
    STORAGE_KEYS: {
        CART: 'cart',
        USER_PREFERENCES: 'gamertech_preferences',
        WISHLIST: 'gamertech_wishlist'
    },
    BREAKPOINTS: {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024,
        LARGE: 1200
    }
};

const STATE = {
    cart: [],
    isLoading: true,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isCartOpen: false,
    isUserMenuOpen: false,
    currentUser: null,
    scrollPosition: 0
};

// Sample product data
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Gaming Mouse Pro X",
        category: "gaming-gear",
        brand: "logitech",
        price: 89.99,
        originalPrice: 109.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
        rating: 4.8,
        reviewCount: 245,
        inStock: true,
        stockCount: 15,
        isNew: false,
        isFeatured: true,
        onSale: true,
        description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons."
    },
    {
        id: 2,
        name: "Mechanical Keyboard RGB",
        category: "gaming-gear",
        brand: "corsair",
        price: 149.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
        rating: 4.6,
        reviewCount: 189,
        inStock: true,
        stockCount: 8,
        isNew: true,
        isFeatured: false,
        onSale: false,
        description: "Premium mechanical keyboard with Cherry MX switches and per-key RGB lighting."
    },
    {
        id: 3,
        name: "Gaming Headset Wireless",
        category: "audio",
        brand: "steelseries",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944",
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        stockCount: 12,
        isNew: false,
        isFeatured: true,
        onSale: true,
        description: "Wireless gaming headset with 7.1 surround sound and noise cancellation."
    },
    {
        id: 4,
        name: "RTX 4080 Graphics Card",
        category: "pc-components",
        brand: "asus",
        price: 1199.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        rating: 4.9,
        reviewCount: 89,
        inStock: true,
        stockCount: 3,
        isNew: true,
        isFeatured: true,
        onSale: false,
        description: "High-performance graphics card for 4K gaming and content creation."
    },
    {
        id: 5,
        name: 'Gaming Monitor 27" 144Hz',
        category: "monitors",
        brand: "asus",
        price: 329.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
        rating: 4.5,
        reviewCount: 234,
        inStock: true,
        stockCount: 6,
        isNew: false,
        isFeatured: false,
        onSale: true,
        description: "27-inch gaming monitor with 144Hz refresh rate and 1ms response time."
    },
    {
        id: 6,
        name: "Gaming Chair Ergonomic",
        category: "accessories",
        brand: "corsair",
        price: 299.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07",
        rating: 4.4,
        reviewCount: 167,
        inStock: true,
        stockCount: 10,
        isNew: false,
        isFeatured: false,
        onSale: false,
        description: "Ergonomic gaming chair with lumbar support and adjustable armrests."
    },
    {
        id: 7,
        name: "Wireless Gaming Controller",
        category: "gaming-gear",
        brand: "razer",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1592840062661-1e78b2113222",
        rating: 4.3,
        reviewCount: 198,
        inStock: false,
        stockCount: 0,
        isNew: false,
        isFeatured: false,
        onSale: true,
        description: "Wireless gaming controller with haptic feedback and customizable buttons."
    },
    {
        id: 8,
        name: "Gaming Laptop Cooling Pad",
        category: "accessories",
        brand: "logitech",
        price: 49.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
        rating: 4.2,
        reviewCount: 145,
        inStock: true,
        stockCount: 25,
        isNew: true,
        isFeatured: false,
        onSale: false,
        description: "Laptop cooling pad with RGB lighting and adjustable fan speeds."
    }
];

// ===================================
// UTILITY FUNCTIONS
// ===================================

const Utils = {
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },
    calculateDiscount(original, current) {
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    },
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    getViewportWidth() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    },
    isMobile() {
        return this.getViewportWidth() <= CONFIG.BREAKPOINTS.MOBILE;
    },
    isTablet() {
        const width = this.getViewportWidth();
        return width > CONFIG.BREAKPOINTS.MOBILE && width <= CONFIG.BREAKPOINTS.TABLET;
    },
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = "";
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }
};

// ===================================
// LOADING SCREEN MANAGEMENT
// ===================================

const LoadingScreen = {
    element: null,
    init() {
        this.element = document.getElementById('loading-screen');
        this.show();
    },
    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            STATE.isLoading = true;
        }
    },
    hide() {
        if (this.element) {
            setTimeout(() => {
                this.element.classList.add('hidden');
                STATE.isLoading = false;
            }, 1000);
        }
    }
};

// ===================================
// NAVIGATION MANAGEMENT
// ===================================

const Navigation = {
    navbar: null,
    mobileToggle: null,
    navMenu: null,
    searchBtn: null,
    cartBtn: null,
    userBtn: null,
    init() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.searchBtn = document.getElementById('search-btn');
        this.cartBtn = document.getElementById('cart-btn');
        this.userBtn = document.getElementById('user-btn');
        if (!this.navbar) console.warn('Navbar element not found');
        this.bindEvents();
        this.handleScroll();
    },
    bindEvents() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => Search.toggle());
        }
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', () => Cart.toggle());
        }
        if (this.userBtn) {
            this.userBtn.addEventListener('click', () => this.toggleUserMenu());
        }
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        document.addEventListener('keydown', (e) => this.handleEscapeKey(e));
    },
    toggleMobileMenu() {
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', STATE.isMobileMenuOpen);
        }
        if (this.mobileToggle) {
            this.mobileToggle.classList.toggle('active', STATE.isMobileMenuOpen);
        }
        document.body.style.overflow = STATE.isMobileMenuOpen ? 'hidden' : '';
    },
    toggleUserMenu() {
        STATE.isUserMenuOpen = !STATE.isUserMenuOpen;
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userDropdown.classList.toggle('active', STATE.isUserMenuOpen);
        }
    },
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        STATE.scrollPosition = scrollTop;
        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', scrollTop > CONFIG.SCROLL_THRESHOLD);
        }
        BackToTop.toggle(scrollTop > CONFIG.SCROLL_THRESHOLD);
    },
    handleOutsideClick(e) {
        if (STATE.isMobileMenuOpen && !e.target.closest('.nav-menu') && !e.target.closest('.mobile-toggle')) {
            this.toggleMobileMenu();
        }
        if (STATE.isUserMenuOpen && !e.target.closest('.user-menu')) {
            this.toggleUserMenu();
        }
        if (STATE.isCartOpen && !e.target.closest('.cart-container')) {
            Cart.close();
        }
        if (STATE.isSearchOpen && !e.target.closest('.search-container') && !e.target.closest('.search-btn')) {
            Search.close();
        }
    },
    handleEscapeKey(e) {
        if (e.key === 'Escape') {
            if (STATE.isMobileMenuOpen) this.toggleMobileMenu();
            if (STATE.isUserMenuOpen) this.toggleUserMenu();
            if (STATE.isCartOpen) Cart.close();
            if (STATE.isSearchOpen) Search.close();
        }
    }
};

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const Search = {
    overlay: null,
    input: null,
    closeBtn: null,
    suggestions: null,
    init() {
        this.overlay = document.getElementById('search-overlay');
        this.input = document.getElementById('search-input');
        this.closeBtn = document.getElementById('search-close');
        this.suggestions = document.querySelectorAll('.tag');
        this.bindEvents();
    },
    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        if (this.input) {
            this.input.addEventListener('input', Utils.debounce((e) => this.handleSearch(e.target.value), 300));
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }
        this.suggestions.forEach(tag => {
            tag.addEventListener('click', () => {
                if (this.input) {
                    this.input.value = tag.textContent;
                    this.performSearch(tag.textContent);
                }
            });
        });
    },
    toggle() {
        STATE.isSearchOpen = !STATE.isSearchOpen;
        if (this.overlay) {
            this.overlay.classList.toggle('active', STATE.isSearchOpen);
        }
        if (STATE.isSearchOpen && this.input) {
            setTimeout(() => this.input.focus(), 100);
        }
        document.body.style.overflow = STATE.isSearchOpen ? 'hidden' : '';
    },
    open() {
        STATE.isSearchOpen = true;
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        if (this.input) {
            setTimeout(() => this.input.focus(), 100);
        }
        document.body.style.overflow = 'hidden';
    },
    close() {
        STATE.isSearchOpen = false;
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    },
    handleSearch(query) {
        console.log('Searching for:', query);
        const results = PRODUCTS_DATA.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        console.log('Search results:', results);
    },
    performSearch(query) {
        if (query.trim()) {
            window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
    }
};

// ===================================
// CART MANAGEMENT
// ===================================

// ===================================
// CART MANAGEMENT
// ===================================

const Cart = {
    dropdown: null,
    itemsContainer: null,
    countElement: null,
    totalElement: null,
    closeBtn: null,
    cartSummary: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
        promoCode: null
    },
    promoCodes: {
        'GAMER10': { type: 'percentage', value: 10, description: '10% off' },
        'SAVE20': { type: 'percentage', value: 20, description: '20% off' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' },
        'WELCOME15': { type: 'percentage', value: 15, description: '15% off for new customers' }
    },
    init() {
        this.dropdown = document.getElementById('cart-dropdown');
        this.itemsContainer = document.getElementById('cart-items');
        this.countElement = document.getElementById('cart-count');
        this.totalElement = document.getElementById('cart-total');
        this.closeBtn = document.getElementById('cart-close');
        this.loadCart();
        this.bindEvents();
        this.updateDisplay();
        if (window.location.pathname.includes('cart.html')) {
            this.initCartPage();
        }
    },
    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        document.addEventListener('cart-updated', () => {
            this.updateDisplay();
            if (window.location.pathname.includes('cart.html')) {
                this.updateCartPageDisplay();
            }
        });
    },
    initCartPage() {
        this.bindCartPageEvents();
        this.updateCartPageDisplay();
    },
    bindCartPageEvents() {
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCartWithConfirm());
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (STATE.cart.length === 0) {
                    this.showNotification('Your cart is empty', 'warning');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        const shippingRadios = document.querySelectorAll('input[name="shipping"]');
        shippingRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateSummary());
        });

        const applyPromoBtn = document.getElementById('apply-promo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        const promoInput = document.getElementById('promo-input');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }
    },

    clearCart() {
        STATE.cart = [];
        this.saveCart();
        this.renderCartItems(); // Immediate DOM update
        this.updateDisplay();  // Update count and total
    },
    loadCart() {
        STATE.cart = Utils.storage.get(CONFIG.STORAGE_KEYS.CART, []);
    },
    saveCart() {
        Utils.storage.set(CONFIG.STORAGE_KEYS.CART, STATE.cart);
        this.dispatchEvent();
    },
    dispatchEvent() {
        document.dispatchEvent(new CustomEvent('cart-updated')); // Corrected event name
    },
    addItem(productId, quantity = 1) {
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return false;
        }
        if (!product.inStock || product.stockCount < quantity) {
            alert('Sorry, this item is out of stock or insufficient stock available.');
            return false;
        }
        const existingItem = STATE.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            STATE.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stockCount: product.stockCount
            });
        }
        this.saveCart();
        this.renderCartItems(); // Immediate DOM update
        this.updateDisplay();  // Update count and total
        return true;
    },
    removeItem(productId) {
        STATE.cart = STATE.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartItems(); // Immediate DOM update
        this.updateDisplay();  // Update count and total
    },
    updateQuantity(productId, quantity) {
        const item = STATE.cart.find(item => item.id === productId);
        if (!item) return;
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (quantity < 1) {
            this.removeItem(productId);
            return;
        }
        if (product && quantity > product.stockCount) {
            alert(`Only ${product.stockCount} units available in stock.`);
            item.quantity = product.stockCount;
        } else {
            item.quantity = quantity;
        }
        this.saveCart();
        this.renderCartItems(); // Immediate DOM update
        this.updateDisplay();  // Update count and total
    },
    calculateTotals() {
        this.cartSummary.subtotal = STATE.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.cartSummary.shipping = this.cartSummary.subtotal > 100 ? 0 : 15;
        this.cartSummary.tax = this.cartSummary.subtotal * 0.08;
        this.cartSummary.discount = this.cartSummary.promoCode
            ? this.calculateDiscount(this.cartSummary.promoCode)
            : 0;
        this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.shipping + this.cartSummary.tax - this.cartSummary.discount;
    },
    calculateDiscount(promoCode) {
        const promo = this.promoCodes[promoCode];
        if (!promo) return 0;
        if (promo.type === 'percentage') {
            return this.cartSummary.subtotal * (promo.value / 100);
        } else if (promo.type === 'shipping') {
            return this.cartSummary.shipping;
        }
        return 0;
    },
    applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        const code = promoInput ? promoInput.value.trim().toUpperCase() : '';
        if (this.promoCodes[code]) {
            this.cartSummary.promoCode = code;
            this.calculateTotals();
            this.saveCart();
            this.updateDisplay(); // Update total display with discount
            return true;
        }
        alert('Invalid promo code');
        return false;
    },
    toggle() {
        STATE.isCartOpen = !STATE.isCartOpen;
        if (this.dropdown) {
            this.dropdown.classList.toggle('active', STATE.isCartOpen);
        }
    },
    open() {
        STATE.isCartOpen = true;
        if (this.dropdown) {
            this.dropdown.classList.add('active');
        }
    },
    close() {
        STATE.isCartOpen = false;
        if (this.dropdown) {
            this.dropdown.classList.remove('active');
        }
    },
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        if (this.itemsContainer) {
            this.renderCartItems();
        }
        if (this.totalElement) {
            this.calculateTotals();
            this.totalElement.textContent = Utils.formatPrice(this.cartSummary.total);
        }
    },
    renderCartItems() {
        if (!this.itemsContainer) return;
        if (STATE.cart.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="catalog.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        this.itemsContainer.innerHTML = STATE.cart.map(item => {
            const product = PRODUCTS_DATA.find(p => p.id === item.id);
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-decrease" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="${item.stockCount}" data-id="${item.id}">
                            <button class="quantity-increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }).join('');
        this.bindCartItemEvents();
    },
    bindCartItemEvents() {
        const removeButtons = this.itemsContainer.querySelectorAll('.cart-item-remove');
        const quantityInputs = this.itemsContainer.querySelectorAll('.cart-item-quantity input');
        const decreaseButtons = this.itemsContainer.querySelectorAll('.quantity-decrease');
        const increaseButtons = this.itemsContainer.querySelectorAll('.quantity-increase');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.removeItem(id);
            });
        });
        quantityInputs.forEach(input => {
            input.addEventListener('change', () => {
                const id = parseInt(input.dataset.id);
                const quantity = parseInt(input.value);
                this.updateQuantity(id, quantity);
            });
        });
        decreaseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = STATE.cart.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        increaseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = STATE.cart.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
    },
    updateCartPageDisplay() {
        const cartItemsContainer = document.getElementById('cart-items-page');
        const subtotalElement = document.getElementById('cart-subtotal');
        const shippingElement = document.getElementById('cart-shipping');
        const taxElement = document.getElementById('cart-tax');
        const discountElement = document.getElementById('cart-discount');
        const totalElement = document.getElementById('cart-total-page');
        if (cartItemsContainer) {
            if (STATE.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="catalog.html">Continue shopping</a>.</p>';
            } else {
                cartItemsContainer.innerHTML = STATE.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>${Utils.formatPrice(item.price)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-decrease" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="${item.stockCount}" data-id="${item.id}">
                                <button class="quantity-increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `).join('');
                this.bindCartItemEvents();
            }
        }
        this.calculateTotals();
        if (subtotalElement) subtotalElement.textContent = Utils.formatPrice(this.cartSummary.subtotal);
        if (shippingElement) shippingElement.textContent = Utils.formatPrice(this.cartSummary.shipping);
        if (taxElement) taxElement.textContent = Utils.formatPrice(this.cartSummary.tax);
        if (discountElement) discountElement.textContent = Utils.formatPrice(this.cartSummary.discount);
        if (totalElement) totalElement.textContent = Utils.formatPrice(this.cartSummary.total);
    }

};
// Stat Counter Animation
document.addEventListener('DOMContentLoaded', function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        if (hasAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let count = 0;
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 16); // Approx. 60fps

            const updateCount = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target.toLocaleString(); // Format with commas
                    clearInterval(updateCount);
                } else {
                    stat.textContent = Math.floor(count).toLocaleString();
                }
            }, 16); // Approx. 60fps
        });

        hasAnimated = true;
    }

    // Trigger animation when hero section is in view
    const heroSection = document.getElementById('hero');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(heroSection); // Stop observing after animation
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of hero is visible

    if (heroSection) {
        observer.observe(heroSection);
    }
});

// Existing Cart and other code...
// (Keep your existing Cart object and other functionality here)
// ===================================
// CATALOG MANAGEMENT
// ===================================

const Catalog = {
    productsGrid: null,
    searchInput: null,
    sortSelect: null,
    filtersSidebar: null,
    mobileFilterToggle: null,
    clearFiltersBtn: null,
    activeFiltersContainer: null,
    paginationContainer: null,
    resultsCount: null,
    viewButtons: null,
    currentPage: 1,
    itemsPerPage: 12,
    filteredProducts: PRODUCTS_DATA,
    activeFilters: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 5000 },
        ratings: [],
        availability: []
    },
    init() {
        this.productsGrid = document.getElementById('products-grid');
        this.searchInput = document.getElementById('product-search');
        this.sortSelect = document.getElementById('sort-select');
        this.filtersSidebar = document.getElementById('filters-sidebar');
        this.mobileFilterToggle = document.getElementById('mobile-filter-toggle');
        this.clearFiltersBtn = document.getElementById('clear-filters');
        this.activeFiltersContainer = document.getElementById('active-filters');
        this.paginationContainer = document.getElementById('pagination');
        this.resultsCount = document.getElementById('results-count');
        this.viewButtons = document.querySelectorAll('.view-btn');
        if (!this.productsGrid) {
            console.warn('Products grid element not found');
            return;
        }
        this.loadFiltersFromURL();
        this.bindEvents();
        this.renderProducts();
        this.updateActiveFilters();
        this.updatePagination();
        this.updateResultsCount();
    },

    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce(() => this.filterProducts(), 300));
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.filterProducts();
                }
            });
        }
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.sortProducts());
        }
        if (this.mobileFilterToggle) {
            this.mobileFilterToggle.addEventListener('click', () => this.toggleFilters());
        }
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
        if (this.filtersSidebar) {
            this.bindFilterEvents();
            this.bindPriceRangeEvents();
        }
        if (this.viewButtons) {
            this.viewButtons.forEach(btn => {
                btn.addEventListener('click', () => this.toggleView(btn.dataset.view));
            });
        }
        if (this.paginationContainer) {
            this.paginationContainer.addEventListener('click', (e) => {
                const pageItem = e.target.closest('.pagination-item');
                if (pageItem && !pageItem.classList.contains('disabled')) {
                    const page = parseInt(pageItem.dataset.page);
                    if (page) {
                        this.currentPage = page;
                        this.renderProducts();
                        this.updatePagination();
                        Utils.scrollTo(this.productsGrid, 100);
                    }
                }
            });
        }
    },
    bindFilterEvents() {
        const filterOptions = this.filtersSidebar.querySelectorAll('.filter-option input');
        const filterTitles = this.filtersSidebar.querySelectorAll('.filter-title');
        filterOptions.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilters();
                this.filterProducts();
            });
        });
        filterTitles.forEach(title => {
            title.addEventListener('click', () => {
                const filterGroup = title.closest('.filter-group');
                filterGroup.classList.toggle('active');
            });
        });
    },
    bindPriceRangeEvents() {
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const rangeMin = document.querySelector('.range-min');
        const rangeMax = document.querySelector('.range-max');
        const progress = document.querySelector('.price-slider .progress');
        if (minPriceInput && maxPriceInput && rangeMin && rangeMax && progress) {
            const updateProgress = () => {
                const minVal = parseInt(rangeMin.value);
                const maxVal = parseInt(rangeMax.value);
                const minPercent = (minVal / 5000) * 100;
                const maxPercent = (maxVal / 5000) * 100;
                progress.style.left = `${minPercent}%`;
                progress.style.right = `${100 - maxPercent}%`;
            };
            minPriceInput.addEventListener('input', () => {
                if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
                    minPriceInput.value = maxPriceInput.value;
                }
                rangeMin.value = minPriceInput.value;
                this.activeFilters.priceRange.min = parseInt(minPriceInput.value);
                updateProgress();
                this.filterProducts();
            });
            maxPriceInput.addEventListener('input', () => {
                if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
                    maxPriceInput.value = minPriceInput.value;
                }
                rangeMax.value = maxPriceInput.value;
                this.activeFilters.priceRange.max = parseInt(maxPriceInput.value);
                updateProgress();
                this.filterProducts();
            });
            rangeMin.addEventListener('input', () => {
                if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
                    rangeMin.value = rangeMax.value;
                }
                minPriceInput.value = rangeMin.value;
                this.activeFilters.priceRange.min = parseInt(rangeMin.value);
                updateProgress();
                this.filterProducts();
            });
            rangeMax.addEventListener('input', () => {
                if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
                    rangeMax.value = rangeMin.value;
                }
                maxPriceInput.value = rangeMax.value;
                this.activeFilters.priceRange.max = parseInt(rangeMax.value);
                updateProgress();
                this.filterProducts();
            });
        }
    },
    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('search');
        if (searchQuery && this.searchInput) {
            this.searchInput.value = decodeURIComponent(searchQuery);
        }
        const category = params.get('category');
        if (category) {
            this.activeFilters.categories.push(category);
            const checkbox = this.filtersSidebar.querySelector(`input[value="${category}"]`);
            if (checkbox) checkbox.checked = true;
        }
    },
    updateFilters() {
        this.activeFilters.categories = Array.from(
            this.filtersSidebar.querySelectorAll('input[name="category"]:checked')
        ).map(input => input.value);
        this.activeFilters.brands = Array.from(
            this.filtersSidebar.querySelectorAll('input[name="brand"]:checked')
        ).map(input => input.value);
        this.activeFilters.ratings = Array.from(
            this.filtersSidebar.querySelectorAll('input[name="rating"]:checked')
        ).map(input => parseInt(input.value));
        this.activeFilters.availability = Array.from(
            this.filtersSidebar.querySelectorAll('input[name="availability"]:checked')
        ).map(input => input.value);
    },
    filterProducts() {
        let filtered = PRODUCTS_DATA;
        if (this.searchInput && this.searchInput.value.trim()) {
            const query = this.searchInput.value.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }
        if (this.activeFilters.categories.length > 0) {
            filtered = filtered.filter(product =>
                this.activeFilters.categories.includes(product.category)
            );
        }
        if (this.activeFilters.brands.length > 0) {
            filtered = filtered.filter(product =>
                this.activeFilters.brands.includes(product.brand)
            );
        }
        filtered = filtered.filter(product =>
            product.price >= this.activeFilters.priceRange.min &&
            product.price <= this.activeFilters.priceRange.max
        );
        if (this.activeFilters.ratings.length > 0) {
            filtered = filtered.filter(product =>
                this.activeFilters.ratings.some(rating => Math.floor(product.rating) >= rating)
            );
        }
        if (this.activeFilters.availability.length > 0) {
            filtered = filtered.filter(product => {
                if (this.activeFilters.availability.includes('in-stock') && product.inStock) return true;
                if (this.activeFilters.availability.includes('on-sale') && product.onSale) return true;
                if (this.activeFilters.availability.includes('new-arrivals') && product.isNew) return true;
                return false;
            });
        }
        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateActiveFilters();
        this.updatePagination();
        this.updateResultsCount();
    },
    sortProducts() {
        if (!this.sortSelect) return;
        const sortValue = this.sortSelect.value;
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
            switch (sortValue) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                    return b.isNew - a.isNew;
                case 'rating':
                    return b.rating - a.rating;
                case 'popular':
                    return b.reviewCount - a.reviewCount;
                case 'featured':
                default:
                    return b.isFeatured - a.isFeatured;
            }
        });
        this.renderProducts();
    },
    renderProducts() {
        if (!this.productsGrid) return;
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedProducts = this.filteredProducts.slice(start, end);
        this.productsGrid.innerHTML = paginatedProducts.map(product => `
            <div class="product-card">
                ${product.onSale ? '<span class="product-badge sale">Sale</span>' : ''}
                ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
                ${product.isFeatured ? '<span class="product-badge featured">Featured</span>' : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-actions">
                    <button class="product-action add-to-wishlist" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="product-action quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="product-content">
                    <span class="product-category">${product.category.replace('-', ' ').toUpperCase()}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="rating-stars">${Utils.generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${Utils.formatPrice(product.price)}</span>
                        ${product.originalPrice ? `
                            <span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>
                            <span class="discount-percentage">${Utils.calculateDiscount(product.originalPrice, product.price)}% OFF</span>
                        ` : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
                        </span>
                        <button class="add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        this.bindProductEvents();
    },
    bindProductEvents() {
        const addToCartButtons = this.productsGrid.querySelectorAll('.add-to-cart');
        const wishlistButtons = this.productsGrid.querySelectorAll('.add-to-wishlist');
        const quickViewButtons = this.productsGrid.querySelectorAll('.quick-view');
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (Cart.addItem(id)) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                    }, 1000);
                }
            });
        });
        wishlistButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                Wishlist.toggleItem(id);
            });
        });
        quickViewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.showQuickView(id);
            });
        });
    },
    updateActiveFilters() {
        if (!this.activeFiltersContainer) return;
        this.activeFiltersContainer.innerHTML = '';
        this.activeFilters.categories.forEach(category => {
            this.addActiveFilter('Category', category, () => {
                const checkbox = this.filtersSidebar.querySelector(`input[value="${category}"]`);
                if (checkbox) checkbox.checked = false;
                this.updateFilters();
                this.filterProducts();
            });
        });
        this.activeFilters.brands.forEach(brand => {
            this.addActiveFilter('Brand', brand, () => {
                const checkbox = this.filtersSidebar.querySelector(`input[value="${brand}"]`);
                if (checkbox) checkbox.checked = false;
                this.updateFilters();
                this.filterProducts();
            });
        });
        this.activeFilters.ratings.forEach(rating => {
            this.addActiveFilter('Rating', `${rating} Stars & Up`, () => {
                const checkbox = this.filtersSidebar.querySelector(`input[value="${rating}"]`);
                if (checkbox) checkbox.checked = false;
                this.updateFilters();
                this.filterProducts();
            });
        });
        this.activeFilters.availability.forEach(availability => {
            this.addActiveFilter('Availability', availability.replace('-', ' '), () => {
                const checkbox = this.filtersSidebar.querySelector(`input[value="${availability}"]`);
                if (checkbox) checkbox.checked = false;
                this.updateFilters();
                this.filterProducts();
            });
        });
        if (this.activeFilters.priceRange.min > 0 || this.activeFilters.priceRange.max < 5000) {
            this.addActiveFilter('Price', `${Utils.formatPrice(this.activeFilters.priceRange.min)} - ${Utils.formatPrice(this.activeFilters.priceRange.max)}`, () => {
                this.activeFilters.priceRange = { min: 0, max: 5000 };
                const minPriceInput = document.getElementById('min-price');
                const maxPriceInput = document.getElementById('max-price');
                const rangeMin = document.querySelector('.range-min');
                const rangeMax = document.querySelector('.range-max');
                if (minPriceInput) minPriceInput.value = 0;
                if (maxPriceInput) maxPriceInput.value = 5000;
                if (rangeMin) rangeMin.value = 0;
                if (rangeMax) rangeMax.value = 5000;
                this.filterProducts();
            });
        }
    },
    addActiveFilter(type, value, onRemove) {
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span class="filter-label">${type}:</span>
            <span class="filter-value">${value}</span>
            <button class="remove-filter"><i class="fas fa-times"></i></button>
        `;
        filterElement.querySelector('.remove-filter').addEventListener('click', onRemove);
        this.activeFiltersContainer.appendChild(filterElement);
    },
    updatePagination() {
        if (!this.paginationContainer) return;
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        let paginationHTML = `
            <button class="pagination-item ${this.currentPage === 1 ? 'disabled' : ''}" data-page="${this.currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-item ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
            `;
        }
        paginationHTML += `
            <button class="pagination-item ${this.currentPage === totalPages ? 'disabled' : ''}" data-page="${this.currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        this.paginationContainer.innerHTML = paginationHTML;
    },
    updateResultsCount() {
        if (!this.resultsCount) return;
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
        this.resultsCount.textContent = `Showing ${start}-${end} of ${this.filteredProducts.length} products`;
    },
    toggleFilters() {
        if (this.filtersSidebar) {
            this.filtersSidebar.classList.toggle('active');
            document.body.style.overflow = this.filtersSidebar.classList.contains('active') ? 'hidden' : '';
        }
    },
    clearFilters() {
        this.activeFilters = {
            categories: [],
            brands: [],
            priceRange: { min: 0, max: 5000 },
            ratings: [],
            availability: []
        };
        const inputs = this.filtersSidebar.querySelectorAll('input');
        inputs.forEach(input => {
            input.checked = false;
            if (input.type === 'number') {
                input.value = input.id === 'min-price' ? 0 : 5000;
            }
            if (input.type === 'range') {
                input.value = input.classList.contains('range-min') ? 0 : 5000;
            }
        });
        if (this.searchInput) this.searchInput.value = '';
        this.filterProducts();
    },
    toggleView(view) {
        if (!this.productsGrid) return;
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(this.viewButtons).find(btn => btn.dataset.view === view);
        if (activeBtn) activeBtn.classList.add('active');
        this.productsGrid.classList.toggle('list-view', view === 'list');
    },
    showQuickView(productId) {
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (!product) return;
        console.log('Quick view for:', product.name);
        // Placeholder for quick view modal implementation
    }
};

// ===================================
// WISHLIST MANAGEMENT
// ===================================

const Wishlist = {
    items: [],
    init() {
        this.loadWishlist();
        this.bindEvents();
    },
    bindEvents() {
        document.addEventListener('wishlist-updated', () => this.updateDisplay());
    },
    loadWishlist() {
        this.items = Utils.storage.get(CONFIG.STORAGE_KEYS.WISHLIST, []);
    },
    saveWishlist() {
        Utils.storage.set(CONFIG.STORAGE_KEYS.WISHLIST, this.items);
        document.dispatchEvent(new CustomEvent('wishlist-updated'));
    },
    toggleItem(productId) {
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (!product) return;
        const exists = this.items.find(item => item.id === productId);
        if (exists) {
            this.items = this.items.filter(item => item.id !== productId);
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
        this.saveWishlist();
    },
    updateDisplay() {
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
        wishlistButtons.forEach(btn => {
            const id = parseInt(btn.dataset.id);
            const isInWishlist = this.items.some(item => item.id === id);
            btn.classList.toggle('active', isInWishlist);
            btn.querySelector('i').className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        });
    }
};

// ===================================
// BACK TO TOP BUTTON
// ===================================

const BackToTop = {
    button: null,
    init() {
        this.button = document.getElementById('back-to-top');
        if (this.button) {
            this.button.addEventListener('click', () => {
                Utils.scrollTo(document.body, 0);
            });
        }
    },
    toggle(show) {
        if (this.button) {
            this.button.classList.toggle('visible', show);
        }
    }
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    Navigation.init();
    Search.init();
    Cart.init();
    Catalog.init();
    Wishlist.init();
    BackToTop.init();
    LoadingScreen.hide();
});

// Handle window resize
window.addEventListener('resize', Utils.debounce(() => {
    if (Utils.isMobile() && STATE.isMobileMenuOpen) {
        Navigation.toggleMobileMenu();
    }
    if (Catalog.filtersSidebar && Catalog.filtersSidebar.classList.contains('active')) {
        Catalog.toggleFilters();
    }
}, 200));

// Prevent default for disabled buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('button:disabled')) {
        e.preventDefault();
    }
});

// Initialize tooltips (if any)
const initializeTooltips = () => {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', () => {
            const tooltipText = tooltip.dataset.tooltip;
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            document.body.appendChild(tooltipElement);
            const rect = tooltip.getBoundingClientRect();
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
            tooltipElement.style.left = `${rect.left + (rect.width - tooltipElement.offsetWidth) / 2}px`;
        });
        tooltip.addEventListener('mouseleave', () => {
            const tooltipElement = document.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    });
};
initializeTooltips();

// Export for debugging (optional)
window.GamerTech = {
    Utils,
    Navigation,
    Search,
    Cart,
    Catalog,
    Wishlist,
    BackToTop,
    STATE,
    CONFIG
};