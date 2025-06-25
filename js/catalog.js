// Global data store
const GamerTechData = {
  products: [
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
      description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
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
      description: "Premium mechanical keyboard with Cherry MX switches and per-key RGB lighting.",
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
      description: "Wireless gaming headset with 7.1 surround sound and noise cancellation.",
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
      description: "High-performance graphics card for 4K gaming and content creation.",
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
      description: "27-inch gaming monitor with 144Hz refresh rate and 1ms response time.",
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
      description: "Ergonomic gaming chair with lumbar support and adjustable armrests.",
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
      description: "Wireless gaming controller with haptic feedback and customizable buttons.",
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
      description: "Laptop cooling pad with RGB lighting and adjustable fan speeds.",
    },
  ],
};

// Catalog state
const CatalogState = {
  products: [...GamerTechData.products],
  filteredProducts: [...GamerTechData.products],
  currentFilters: {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 5000 },
    ratings: [],
    availability: [],
  },
  currentSort: "featured",
  currentView: "grid",
  searchQuery: "",
  currentPage: 1,
  productsPerPage: 12,
  isLoading: false,
};

// Utility functions
const Utils = {
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },

  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
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
  },
};

// Catalog controller
const Catalog = {
  productsGrid: null,
  searchInput: null,
  sortSelect: null,
  viewButtons: null,
  filterGroups: null,
  activeFiltersContainer: null,
  resultsCount: null,
  pagination: null,
  mobileFilterToggle: null,
  filtersSidebar: null,
  clearFiltersBtn: null,

  init() {
    this.bindElements();
    this.bindEvents();
    this.initFilters();
    this.initPriceSlider();
    this.loadProducts();
    this.updateResultsCount();
    this.generatePagination();
  },

  bindElements() {
    this.productsGrid = document.getElementById("products-grid");
    this.searchInput = document.getElementById("product-search");
    this.sortSelect = document.getElementById("sort-select");
    this.viewButtons = document.querySelectorAll(".view-btn");
    this.filterGroups = document.querySelectorAll(".filter-group");
    this.activeFiltersContainer = document.getElementById("active-filters");
    this.resultsCount = document.getElementById("results-count");
    this.pagination = document.getElementById("pagination");
    this.mobileFilterToggle = document.getElementById("mobile-filter-toggle");
    this.filtersSidebar = document.getElementById("filters-sidebar");
    this.clearFiltersBtn = document.getElementById("clear-filters");
  },

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        Utils.debounce((e) => {
          this.handleSearch(e.target.value);
        }, 300),
      );
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.handleSort(e.target.value);
      });
    }

    this.viewButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleViewChange(e.target.dataset.view);
      });
    });

    this.filterGroups.forEach((group) => {
      const title = group.querySelector(".filter-title");
      if (title) {
        title.addEventListener("click", () => {
          group.classList.toggle("active");
        });
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.type === "checkbox" && e.target.name) {
        this.handleFilterChange(e.target.name, e.target.value, e.target.checked);
      }
    });

    if (this.mobileFilterToggle) {
      this.mobileFilterToggle.addEventListener("click", () => {
        this.toggleMobileFilters();
      });
    }

    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-tag")) {
        this.handleSearch(e.target.textContent);
        if (this.searchInput) {
          this.searchInput.value = e.target.textContent;
        }
      }
    });

    document.addEventListener("click", (e) => {
      const productLink = e.target.closest(".product-link");
      if (productLink) {
        e.preventDefault(); // Mencegah aksi default jika menggunakan tag <a>
        const productCard = productLink.closest(".product-card");
        if (productCard) {
          const productId = productCard.dataset.id;
          const product = GamerTechData.products.find(p => p.id === Number.parseInt(productId));
          if (product) {
            // Tambahkan parameter tambahan seperti nama produk untuk SEO
            const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            window.location.href = `product-detail.html?id=${productId}&slug=${productSlug}`;
          } else {
            console.error(`Product with ID ${productId} not found.`);
            Catalog.showNotification("Product not found.", "error");
          }
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) {
        e.stopPropagation();
        const productCard = e.target.closest(".product-card");
        const productId = Number.parseInt(productCard.dataset.id);
        this.addToCart(productId);
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest(".product-action")) {
        e.stopPropagation();
        const action = e.target.closest(".product-action").dataset.action;
        const productCard = e.target.closest(".product-card");
        const productId = Number.parseInt(productCard.dataset.id);
        this.handleProductAction(action, productId);
      }
    });
  },

  initFilters() {
    this.filterGroups.forEach((group, index) => {
      if (index < 3) {
        group.classList.add("active");
      }
    });
  },

  initPriceSlider() {
    const rangeMin = document.querySelector(".range-min");
    const rangeMax = document.querySelector(".range-max");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const progress = document.querySelector(".progress");

    if (!rangeMin || !rangeMax || !progress) return;

    const updateSlider = () => {
      const minVal = Number.parseInt(rangeMin.value);
      const maxVal = Number.parseInt(rangeMax.value);
      const minPercent = (minVal / rangeMin.max) * 100;
      const maxPercent = (maxVal / rangeMax.max) * 100;

      progress.style.left = minPercent + "%";
      progress.style.right = 100 - maxPercent + "%";

      if (minPriceInput) minPriceInput.value = minVal;
      if (maxPriceInput) maxPriceInput.value = maxVal;

      CatalogState.currentFilters.priceRange = { min: minVal, max: maxVal };
      this.applyFilters();
    };

    rangeMin.addEventListener("input", updateSlider);
    rangeMax.addEventListener("input", updateSlider);

    if (minPriceInput) {
      minPriceInput.addEventListener("change", (e) => {
        rangeMin.value = e.target.value;
        updateSlider();
      });
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener("change", (e) => {
        rangeMax.value = e.target.value;
        updateSlider();
      });
    }
  },

  handleSearch(query) {
    CatalogState.searchQuery = query.toLowerCase();
    CatalogState.currentPage = 1;
    this.applyFilters();
  },

  handleSort(sortType) {
    CatalogState.currentSort = sortType;
    CatalogState.currentPage = 1;
    this.applyFilters();
  },

  handleViewChange(view) {
    CatalogState.currentView = view;

    this.viewButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });

    if (this.productsGrid) {
      this.productsGrid.classList.toggle("list-view", view === "list");
    }
  },

  handleFilterChange(filterType, value, checked) {
    const filters = CatalogState.currentFilters;

    if (filterType === "category") {
      if (checked) {
        filters.categories.push(value);
      } else {
        filters.categories = filters.categories.filter((cat) => cat !== value);
      }
    } else if (filterType === "brand") {
      if (checked) {
        filters.brands.push(value);
      } else {
        filters.brands = filters.brands.filter((brand) => brand !== value);
      }
    } else if (filterType === "rating") {
      if (checked) {
        filters.ratings.push(Number.parseInt(value));
      } else {
        filters.ratings = filters.ratings.filter((rating) => rating !== Number.parseInt(value));
      }
    } else if (filterType === "availability") {
      if (checked) {
        filters.availability.push(value);
      } else {
        filters.availability = filters.availability.filter((avail) => avail !== value);
      }
    }

    CatalogState.currentPage = 1;
    this.applyFilters();
    this.updateActiveFilters();
  },

  applyFilters() {
    let filtered = [...GamerTechData.products];

    if (CatalogState.searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(CatalogState.searchQuery) ||
          product.description.toLowerCase().includes(CatalogState.searchQuery) ||
          product.category.toLowerCase().includes(CatalogState.searchQuery) ||
          product.brand.toLowerCase().includes(CatalogState.searchQuery),
      );
    }

    if (CatalogState.currentFilters.categories.length > 0) {
      filtered = filtered.filter((product) => CatalogState.currentFilters.categories.includes(product.category));
    }

    if (CatalogState.currentFilters.brands.length > 0) {
      filtered = filtered.filter((product) => CatalogState.currentFilters.brands.includes(product.brand));
    }

    const { min, max } = CatalogState.currentFilters.priceRange;
    filtered = filtered.filter((product) => product.price >= min && product.price <= max);

    if (CatalogState.currentFilters.ratings.length > 0) {
      filtered = filtered.filter((product) => {
        return CatalogState.currentFilters.ratings.some((rating) => {
          if (rating === 5) {
            return product.rating >= 4.5;
          } else {
            return product.rating >= rating && product.rating < rating + 1;
          }
        });
      });
    }

    if (CatalogState.currentFilters.availability.length > 0) {
      filtered = filtered.filter((product) => {
        return CatalogState.currentFilters.availability.some((filter) => {
          switch (filter) {
            case "in-stock":
              return product.inStock;
            case "on-sale":
              return product.onSale;
            case "new-arrivals":
              return product.isNew;
            default:
              return true;
          }
        });
      });
    }

    filtered.sort((a, b) => {
      switch (CatalogState.currentSort) {
        case "newest":
          return b.isNew - a.isNew;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviewCount - a.reviewCount;
        case "featured":
        default:
          return b.isFeatured - a.isFeatured;
      }
    });

    CatalogState.filteredProducts = filtered;
    this.loadProducts();
    this.updateResultsCount();
    this.generatePagination();
  },

  loadProducts() {
    if (!this.productsGrid) return;

    const startIndex = (CatalogState.currentPage - 1) * CatalogState.productsPerPage;
    const endIndex = startIndex + CatalogState.productsPerPage;
    const productsToShow = CatalogState.filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
      this.showNoResults();
      return;
    }

    this.productsGrid.innerHTML = productsToShow.map((product) => this.createProductCard(product)).join("");

    const productCards = this.productsGrid.querySelectorAll(".product-card");
    productCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  },

  createProductCard(product) {
    const discount = Utils.calculateDiscount(product.originalPrice, product.price);
    const stockStatus = this.getStockStatus(product);

    let badge = "";
    if (product.onSale && discount > 0) {
      badge = `<div class="product-badge sale">-${discount}%</div>`;
    } else if (product.isNew) {
      badge = '<div class="product-badge new">New</div>';
    } else if (product.isFeatured) {
      badge = '<div class="product-badge featured">Featured</div>';
    }

    return `
        <div class="product-card" data-id="${product.id}" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
            ${badge}
            <div class="product-image">
                <a href="#" class="product-link" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                <div class="product-actions">
                    <button class="product-action" data-action="wishlist" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action" data-action="compare" title="Compare">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                    <button class="product-action" data-action="quick-view" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <div class="product-category">${this.getCategoryName(product.category)}</div>
                <a href="#" class="product-link" data-id="${product.id}">
                    <h3 class="product-title">${product.name}</h3>
                </a>
                ${CatalogState.currentView === "list" ? `<p class="product-description">${product.description}</p>` : ""}
                <div class="product-rating">
                    <div class="rating-stars">
                        ${Utils.generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${Utils.formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ""}
                    ${discount > 0 ? `<span class="discount-percentage">-${discount}%</span>` : ""}
                </div>
                <div class="product-footer">
                    <span class="stock-status ${stockStatus.class}">${stockStatus.text}</span>
                    <button class="add-to-cart" ${!product.inStock ? "disabled" : ""}>
                        <i class="fas fa-shopping-cart"></i>
                        <span>${product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
  },

  getStockStatus(product) {
    if (!product.inStock) {
      return { class: "out-of-stock", text: "Out of Stock" };
    } else if (product.stockCount <= 5) {
      return { class: "low-stock", text: `Only ${product.stockCount} left` };
    } else {
      return { class: "in-stock", text: "In Stock" };
    }
  },

  getCategoryName(category) {
    const categories = {
      "gaming-gear": "Gaming Gear",
      "pc-components": "PC Components",
      monitors: "Gaming Monitors",
      audio: "Gaming Audio",
      accessories: "Accessories",
    };
    return categories[category] || category;
  },

  showNoResults() {
    this.productsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-2xl);">
                <div class="no-results-content">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: var(--spacing-lg);"></i>
                    <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">No Products Found</h3>
                    <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">
                        Try adjusting your search criteria or filters to find what you're looking for.
                    </p>
                    <button class="btn btn-primary" onclick="Catalog.clearAllFilters()">
                        <span>Clear All Filters</span>
                    </button>
                </div>
            </div>
        `;
  },

  updateResultsCount() {
    if (!this.resultsCount) return;

    const total = CatalogState.filteredProducts.length;
    const startIndex = (CatalogState.currentPage - 1) * CatalogState.productsPerPage + 1;
    const endIndex = Math.min(startIndex + CatalogState.productsPerPage - 1, total);

    if (total === 0) {
      this.resultsCount.textContent = "No products found";
    } else {
      this.resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} products`;
    }
  },

  generatePagination() {
    if (!this.pagination) return;

    const totalProducts = CatalogState.filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / CatalogState.productsPerPage);
    const currentPage = CatalogState.currentPage;

    if (totalPages <= 1) {
      this.pagination.innerHTML = "";
      return;
    }

    let paginationHTML = "";

    paginationHTML += `
            <button class="pagination-item ${currentPage === 1 ? "disabled" : ""}" 
                    onclick="Catalog.goToPage(${currentPage - 1})" 
                    ${currentPage === 1 ? "disabled" : ""}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-item" onclick="Catalog.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-item disabled">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
                <button class="pagination-item ${i === currentPage ? "active" : ""}" 
                        onclick="Catalog.goToPage(${i})">
                    ${i}
                </button>
            `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-item disabled">...</span>`;
      }
      paginationHTML += `<button class="pagination-item" onclick="Catalog.goToPage(${totalPages})">${totalPages}</button>`;
    }

    paginationHTML += `
            <button class="pagination-item ${currentPage === totalPages ? "disabled" : ""}" 
                    onclick="Catalog.goToPage(${currentPage + 1})" 
                    ${currentPage === totalPages ? "disabled" : ""}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

    this.pagination.innerHTML = paginationHTML;
  },

  goToPage(page) {
    const totalPages = Math.ceil(CatalogState.filteredProducts.length / CatalogState.productsPerPage);

    if (page < 1 || page > totalPages) return;

    CatalogState.currentPage = page;
    this.loadProducts();
    this.updateResultsCount();
    this.generatePagination();

    if (this.productsGrid) {
      this.productsGrid.scrollIntoView({ behavior: "smooth" });
    }
  },

  updateActiveFilters() {
    if (!this.activeFiltersContainer) return;

    const activeFilters = [];
    const filters = CatalogState.currentFilters;

    filters.categories.forEach((category) => {
      activeFilters.push({
        type: "category",
        value: category,
        label: this.getCategoryName(category),
      });
    });

    filters.brands.forEach((brand) => {
      activeFilters.push({
        type: "brand",
        value: brand,
        label: brand.charAt(0).toUpperCase() + brand.slice(1),
      });
    });

    if (filters.priceRange.min > 0 || filters.priceRange.max < 5000) {
      activeFilters.push({
        type: "price",
        value: `${filters.priceRange.min}-${filters.priceRange.max}`,
        label: `${Utils.formatPrice(filters.priceRange.min)} - ${Utils.formatPrice(filters.priceRange.max)}`,
      });
    }

    filters.ratings.forEach((rating) => {
      activeFilters.push({
        type: "rating",
        value: rating,
        label: `${rating}+ Stars`,
      });
    });

    filters.availability.forEach((availability) => {
      const labels = {
        "in-stock": "In Stock",
        "on-sale": "On Sale",
        "new-arrivals": "New Arrivals",
      };
      activeFilters.push({
        type: "availability",
        value: availability,
        label: labels[availability],
      });
    });

    if (CatalogState.searchQuery) {
      activeFilters.push({
        type: "search",
        value: CatalogState.searchQuery,
        label: `Search: "${CatalogState.searchQuery}"`,
      });
    }

    if (activeFilters.length === 0) {
      this.activeFiltersContainer.innerHTML = "";
      return;
    }

    this.activeFiltersContainer.innerHTML = activeFilters
      .map(
        (filter) => `
            <div class="active-filter">
                <span class="filter-label">${filter.label}</span>
                <button class="remove-filter" onclick="Catalog.removeFilter('${filter.type}', '${filter.value}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `,
      )
      .join("");
  },

  removeFilter(type, value) {
    const filters = CatalogState.currentFilters;

    switch (type) {
      case "category":
        filters.categories = filters.categories.filter((cat) => cat !== value);
        break;
      case "brand":
        filters.brands = filters.brands.filter((brand) => brand !== value);
        break;
      case "rating":
        filters.ratings = filters.ratings.filter((rating) => rating !== Number.parseInt(value));
        break;
      case "availability":
        filters.availability = filters.availability.filter((avail) => avail !== value);
        break;
      case "price":
        filters.priceRange = { min: 0, max: 5000 };
        const rangeMin = document.querySelector(".range-min");
        const rangeMax = document.querySelector(".range-max");
        if (rangeMin) rangeMin.value = 0;
        if (rangeMax) rangeMax.value = 5000;
        break;
      case "search":
        CatalogState.searchQuery = "";
        if (this.searchInput) this.searchInput.value = "";
        break;
    }

    this.updateFilterCheckboxes();

    CatalogState.currentPage = 1;
    this.applyFilters();
    this.updateActiveFilters();
  },

  updateFilterCheckboxes() {
    const filters = CatalogState.currentFilters;

    document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
      checkbox.checked = filters.categories.includes(checkbox.value);
    });

    document.querySelectorAll('input[name="brand"]').forEach((checkbox) => {
      checkbox.checked = filters.brands.includes(checkbox.value);
    });

    document.querySelectorAll('input[name="rating"]').forEach((checkbox) => {
      checkbox.checked = filters.ratings.includes(Number.parseInt(checkbox.value));
    });

    document.querySelectorAll('input[name="availability"]').forEach((checkbox) => {
      checkbox.checked = filters.availability.includes(checkbox.value);
    });
  },

  clearAllFilters() {
    CatalogState.currentFilters = {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 5000 },
      ratings: [],
      availability: [],
    };
    CatalogState.searchQuery = "";
    CatalogState.currentPage = 1;

    this.updateFilterCheckboxes();
    if (this.searchInput) this.searchInput.value = "";

    const rangeMin = document.querySelector(".range-min");
    const rangeMax = document.querySelector(".range-max");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const progress = document.querySelector(".progress");

    if (rangeMin) rangeMin.value = 0;
    if (rangeMax) rangeMax.value = 5000;
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 5000;
    if (progress) {
      progress.style.left = "0%";
      progress.style.right = "0%";
    }

    this.applyFilters();
    this.updateActiveFilters();
  },

  toggleMobileFilters() {
    if (this.filtersSidebar) {
      this.filtersSidebar.classList.toggle("active");
    }
  },

  addToCart(productId) {
    const product = GamerTechData.products.find((p) => p.id === productId);
    if (!product || !product.inStock) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    this.updateCartCount();

    this.showNotification(`${product.name} added to cart!`, "success");
  },

  handleProductAction(action, productId) {
    const product = GamerTechData.products.find((p) => p.id === productId);
    if (!product) return;

    switch (action) {
      case "wishlist":
        this.toggleWishlist(productId);
        break;
      case "compare":
        this.addToCompare(productId);
        break;
      case "quick-view":
        this.showQuickView(productId);
        break;
    }
  },

  toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      this.showNotification("Removed from wishlist", "info");
    } else {
      wishlist.push(productId);
      this.showNotification("Added to wishlist!", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  },

  addToCompare(productId) {
    const compare = JSON.parse(localStorage.getItem("compare") || "[]");

    if (compare.length >= 4) {
      this.showNotification("You can only compare up to 4 products", "warning");
      return;
    }

    if (!compare.includes(productId)) {
      compare.push(productId);
      localStorage.setItem("compare", JSON.stringify(compare));
      this.showNotification("Added to compare list!", "success");
    } else {
      this.showNotification("Product already in compare list", "info");
    }
  },

  showQuickView(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
  },

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  },

  showNotification(message, type = "info") {
    document.querySelectorAll(".notification").forEach((notification) => {
      notification.remove();
    });

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : type === "warning" ? "fa-exclamation-triangle" : "fa-info-circle"}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                .notification {
                    position: fixed;
                    top: 90px;
                    right: var(--spacing-lg);
                    background: var(--bg-card);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-md);
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform var(--transition-normal);
                    max-width: 400px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.success { border-color: var(--success-color); }
                .notification.error { border-color: var(--error-color); }
                .notification.warning { border-color: var(--warning-color); }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                
                .notification-content i:first-child {
                    color: var(--primary-color);
                }
                
                .notification.success .notification-content i:first-child { color: var(--success-color); }
                .notification.error .notification-content i:first-child { color: var(--error-color); }
                .notification.warning .notification-content i:first-child { color: var(--warning-color); }
                
                .notification-content span {
                    flex: 1;
                    color: var(--text-primary);
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--spacing-xs);
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-fast);
                }
                
                .notification-close:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);

    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Catalog.init();
  Catalog.updateCartCount();
});

window.Catalog = Catalog;

class AdminDashboard {
  constructor() {
    this.charts = {};
    this.currentDateRange = 30;
    this.salesData = this.generateMockData();
    this.sectionManagers = {
      articles: null,
      products: null,
      users: null,
      transactions: null,
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCharts();
    this.loadDashboardData();
    this.hideLoadingScreen();
  }

  setupEventListeners() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const sidebar = document.getElementById("sidebar");
    const mobileOverlay = document.getElementById("mobileOverlay");

    mobileMenuToggle?.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
    });

    mobileOverlay?.addEventListener("click", () => {
      sidebar.classList.remove("active");
      mobileOverlay.classList.remove("active");
    });

    const dateRange = document.getElementById("dateRange");
    const customDateRange = document.getElementById("customDateRange");
    const applyDateRange = document.getElementById("applyDateRange");

    dateRange?.addEventListener("change", (e) => {
      if (e.target.value === "custom") {
        customDateRange.style.display = "flex";
      } else {
        customDateRange.style.display = "none";
        this.currentDateRange = Number.parseInt(e.target.value);
        this.updateDashboard();
      }
    });

    applyDateRange?.addEventListener("click", () => {
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;

      if (startDate && endDate) {
        this.applyCustomDateRange(startDate, endDate);
        customDateRange.style.display = "none";
      }
    });

    const refreshBtn = document.getElementById("refreshData");
    refreshBtn?.addEventListener("click", () => {
      this.refreshDashboard();
    });

    const chartBtns = document.querySelectorAll(".chart-btn");
    chartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        chartBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.updateSalesTrendChart(e.target.dataset.period);
      });
    });

    const navLinks = document.querySelectorAll(".nav-link");
    const dashboardContent = document.querySelector(".dashboard-content");
    const managementSections = document.querySelectorAll(".management-section");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        navLinks.forEach((l) => l.parentElement.classList.remove("active"));
        e.target.closest(".nav-item").classList.add("active");

        const section = e.target.dataset.section;

        dashboardContent.style.display = "none";
        managementSections.forEach((s) => (s.style.display = "none"));

        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
          targetSection.style.display = "block";
          const titles = {
            dashboard: "Sales Dashboard",
            articles: "Kelola Artikel",
            products: "Kelola Produk",
            users: "Kelola Pengguna",
            transactions: "Kelola Transaksi",
            analytics: "Analytics",
            reports: "Reports",
            settings: "Settings",
          };
          document.querySelector(".page-title").textContent = titles[section] || "Admin Panel";

          this.initializeSection(section);
        }
      });
    });
  }

  initializeSection(section) {
    if (!this.sectionManagers[section]) {
      switch (section) {
        case "articles":
          this.sectionManagers.articles = new ArticlesManager();
          break;
        case "products":
          this.sectionManagers.products = new ProductsManager();
          break;
        case "users":
          this.sectionManagers.users = new UsersManager();
          break;
        case "transactions":
          this.sectionManagers.transactions = new TransactionsManager();
          break;
        default:
          console.log(`No manager for section: ${section}`);
      }
    }
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loadingScreen");
      loadingScreen?.classList.add("hidden");
    }, 1500);
  }

  generateMockData() {
    const products = GamerTechData.products.map((p) => p.name);
    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Lisa Davis",
      "Tom Anderson",
      "Emily Taylor",
      "Chris Martin",
      "Anna Lee",
    ];
    const categories = ["Gaming Peripherals", "PC Components", "Gaming Furniture", "Accessories"];

    const salesData = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dailySales = Math.floor(Math.random() * 50) + 20;
      const revenue = dailySales * (Math.random() * 200 + 100);

      salesData.push({
        date: date.toISOString().split("T")[0],
        sales: dailySales,
        revenue: revenue,
        orders: Math.floor(dailySales * 0.8),
      });
    }

    const recentOrders = [];
    for (let i = 0; i < 10; i++) {
      const orderId = `ORD-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const amount = Math.floor(Math.random() * 500) + 50;
      const statuses = ["completed", "pending", "cancelled"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7));

      recentOrders.push({
        orderId,
        customer,
        product,
        amount,
        status,
        date: orderDate.toLocaleDateString(),
      });
    }

    const topProducts = products
      .map((product) => ({
        name: product,
        sales: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        growth: (Math.random() * 40 - 20).toFixed(1),
        stock: Math.floor(Math.random() * 100) + 10,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const categoryData = categories.map((category) => ({
      name: category,
      sales: Math.floor(Math.random() * 1000) + 500,
      percentage: Math.floor(Math.random() * 30) + 10,
    }));

    return {
      salesData,
      recentOrders,
      topProducts,
      categoryData,
      products,
      customers,
      categories,
    };
  }

  initializeCharts() {
    this.initKPISparklines();
    this.initSalesTrendChart();
    this.initCategoriesChart();
    this.initTopProductsChart();
  }

  initKPISparklines() {
    const sparklineData = this.salesData.salesData.slice(-7).map((d) => d.revenue);

    const revenueCtx = document.getElementById("revenueSparkline");
    if (revenueCtx) {
      this.charts.revenueSparkline = new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: Array(7).fill(""),
          datasets: [
            {
              data: sparklineData,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false },
          },
          elements: { point: { radius: 0 } },
        },
      });
    }

    const ordersCtx = document.getElementById("ordersSparkline");
    if (ordersCtx) {
      this.charts.ordersSparkline = new Chart(ordersCtx, {
        type: "line",
        data: {
          labels: Array(7).fill(""),
          datasets: [
            {
              data: this.salesData.salesData.slice(-7).map((d) => d.orders),
              borderColor: "#6366f1",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        },
      });
    }

    const aovCtx = document.getElementById("aovSparkline");
    if (aovCtx) {
      this.charts.aovSparkline = new Chart(aovCtx, {
        type: "line",
        data: {
          labels: Array(7).fill(""),
          datasets: [
            {
              data: this.salesData.salesData.slice(-7).map((d) => d.revenue / d.orders),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        },
      });
    }

    const customersCtx = document.getElementById("customersSparkline");
    if (customersCtx) {
      this.charts.customersSparkline = new Chart(customersCtx, {
        type: "line",
        data: {
          labels: Array(7).fill(""),
          datasets: [
            {
              data: Array(7)
                .fill(0)
                .map(() => Math.floor(Math.random() * 20) + 10),
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        },
      });
    }
  }

  initSalesTrendChart() {
    const ctx = document.getElementById("salesTrendChart");
    if (!ctx) return;

    const labels = this.salesData.salesData.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    this.charts.salesTrend = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue",
            data: this.salesData.salesData.map((d) => d.revenue),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Orders",
            data: this.salesData.salesData.map((d) => d.orders),
            borderColor: "#ec4899",
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#a1a1aa",
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(26, 26, 46, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#a1a1aa",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
              drawBorder: false,
            },
            ticks: {
              color: "#a1a1aa",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
              drawBorder: false,
            },
            ticks: {
              color: "#a1a1aa",
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: "#a1a1aa",
            },
          },
        },
      },
    });
  }

  initCategoriesChart() {
    const ctx = document.getElementById("categoriesChart");
    if (!ctx) return;

    this.charts.categories = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: this.salesData.categoryData.map((c) => c.name),
        datasets: [
          {
            data: this.salesData.categoryData.map((c) => c.sales),
            backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#a1a1aa",
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "rgba(26, 26, 46, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#a1a1aa",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
          },
        },
      },
    });
  }

  initTopProductsChart() {
    const ctx = document.getElementById("topProductsChart");
    if (!ctx) return;

    this.charts.topProducts = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.salesData.topProducts.map((p) => p.name.split(" ").slice(0, 2).join(" ")),
        datasets: [
          {
            label: "Sales",
            data: this.salesData.topProducts.map((p) => p.sales),
            backgroundColor: "rgba(99, 102, 241, 0.8)",
            borderColor: "#6366f1",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(26, 26, 46, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#a1a1aa",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#a1a1aa",
              maxRotation: 45,
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
              drawBorder: false,
            },
            ticks: {
              color: "#a1a1aa",
            },
          },
        },
      },
    });
  }

  loadDashboardData() {
    this.updateKPICards();
    this.loadRecentOrders();
    this.loadTopProductsTable();
  }

  updateKPICards() {
    const totalRevenue = this.salesData.salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = this.salesData.salesData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const newCustomers = Math.floor(Math.random() * 100) + 50;

    document.getElementById("totalRevenue").textContent = "$" + totalRevenue.toLocaleString();
    document.getElementById("totalOrders").textContent = totalOrders.toLocaleString();
    document.getElementById("avgOrderValue").textContent = "$" + avgOrderValue.toFixed(2);
    document.getElementById("newCustomers").textContent = newCustomers.toLocaleString();
  }

  loadRecentOrders() {
    const tbody = document.getElementById("recentOrdersBody");
    if (!tbody) return;

    tbody.innerHTML = this.salesData.recentOrders
      .map(
        (order) => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>$${order.amount}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${order.date}</td>
            </tr>
        `,
      )
      .join("");
  }

  loadTopProductsTable() {
    const tbody = document.getElementById("topProductsBody");
    if (!tbody) return;

    tbody.innerHTML = this.salesData.topProducts
      .map(
        (product) => `
            <tr>
                <td>${product.name}</td>
                <td>${product.sales}</td>
                <td>$${product.revenue.toLocaleString()}</td>
                <td class="${product.growth >= 0 ? "growth-positive" : "growth-negative"}">
                    ${product.growth >= 0 ? "+" : ""}${product.growth}%
                </td>
                <td>${product.stock}</td>
            </tr>
        `,
      )
      .join("");
  }

  updateSalesTrendChart(period) {
    console.log("Updating sales trend chart for period:", period);
  }

  applyCustomDateRange(startDate, endDate) {
    console.log("Applying custom date range:", startDate, "to", endDate);
  }

  refreshDashboard() {
    const refreshBtn = document.getElementById("refreshData");
    const icon = refreshBtn.querySelector("i");

    icon.style.animation = "spin 1s linear infinite";

    setTimeout(() => {
      icon.style.animation = "";
      this.salesData = this.generateMockData();
      this.loadDashboardData();
      this.updateCharts();
    }, 1000);
  }

  updateCharts() {
    Object.values(this.charts).forEach((chart) => {
      if (chart && typeof chart.update === "function") {
        chart.update();
      }
    });
  }
}

class ArticlesManager {
  constructor() {
    this.articles = this.generateMockArticles();
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.filteredArticles = [...this.articles];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderArticles();
    this.renderPagination();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("articleSearch");
    searchInput?.addEventListener("input", () => this.filterArticles());

    const categoryFilter = document.getElementById("categoryFilterArticles");
    const statusFilter = document.getElementById("statusFilterArticles");

    categoryFilter?.addEventListener("change", () => this.filterArticles());
    statusFilter?.addEventListener("change", () => this.filterArticles());

    const addBtn = document.getElementById("addArticleBtn");
    addBtn?.addEventListener("click", () => this.openModal());

    const modal = document.getElementById("articleModal");
    const closeBtn = document.getElementById("closeModalArticles");
    const cancelBtn = document.getElementById("cancelBtnArticles");
    const form = document.getElementById("articleForm");

    closeBtn?.addEventListener("click", () => this.closeModal());
    cancelBtn?.addEventListener("click", () => this.closeModal());
    form?.addEventListener("submit", (e) => this.handleSubmit(e));

    const imageInput = document.getElementById("articleImage");
    imageInput?.addEventListener("change", (e) => this.previewImage(e));
  }

  generateMockArticles() {
    const categories = ["gaming", "hardware", "review", "tutorial"];
    const statuses = ["published", "draft", "archived"];
    const titles = [
      "Review Gaming Mouse RGB Pro Terbaru",
      "Tutorial Setup Gaming PC untuk Pemula",
      "Hardware Terbaik untuk Gaming 2024",
      "Tips Memilih Keyboard Mechanical",
      "Review Graphics Card RTX 4080",
      "Panduan Overclock CPU untuk Gaming",
      "Gaming Monitor 4K vs 1440p",
      "Setup Streaming yang Optimal",
      "Review Gaming Chair Ergonomis",
      "Tips Maintenance PC Gaming",
      "Perbandingan SSD vs HDD untuk Gaming",
      "Gaming Headset dengan Audio Terbaik",
    ];

    return titles.map((title, index) => ({
      id: index + 1,
      title,
      category: categories[Math.floor(Math.random() * categories.length)],
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      content: "Full article content would be here...",
      image: `https://via.placeholder.com/320x200?text=Article+${index + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      author: "Admin User",
      publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 5000) + 100,
      tags: ["gaming", "tech", "review"].slice(0, Math.floor(Math.random() * 3) + 1),
    }));
  }

  filterArticles() {
    const searchTerm = document.getElementById("articleSearch")?.value.toLowerCase() || "";
    const categoryFilter = document.getElementById("categoryFilterArticles")?.value || "";
    const statusFilter = document.getElementById("statusFilterArticles")?.value || "";

    this.filteredArticles = this.articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm) || article.excerpt.toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryFilter || article.category === categoryFilter;
      const matchesStatus = !statusFilter || article.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    this.currentPage = 1;
    this.renderArticles();
    this.renderPagination();
  }

  renderArticles() {
    const grid = document.getElementById("articlesGrid");
    if (!grid) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

    grid.innerHTML = articlesToShow
      .map(
        (article) => `
      <div class="article-card" data-id="${article.id}">
        <div class="card-image">
          <img src="${article.image}" alt="${article.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; background: var(--bg-glass);">
            <i class="fas fa-newspaper" style="font-size: 3rem; color: var(--text-secondary);"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="card-category">${article.category}</span>
            <span class="card-status status-${article.status}">${article.status}</span>
          </div>
          <h3 class="card-title">${article.title}</h3>
          <p class="card-excerpt">${article.excerpt}</p>
          <div class="card-footer">
            <div class="card-info">
              <span class="card-author">By ${article.author}</span>
              <span class="card-date">${article.publishDate}</span>
              <span class="card-views">${article.views} views</span>
            </div>
            <div class="card-actions">
              <button class="action-btn edit" onclick="articlesManager.editArticle(${article.id})" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="articlesManager.deleteArticle(${article.id})" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderPagination() {
    const pagination = document.getElementById("articlesPagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
      <button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} 
              onclick="articlesManager.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="articlesManager.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="pagination-ellipsis">...</span>';
      }
    }

    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? "disabled" : ""} 
              onclick="articlesManager.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderArticles();
    this.renderPagination();
  }

  openModal(article = null) {
    const modal = document.getElementById("articleModal");
    const modalTitle = document.getElementById("modalTitleArticles");
    const form = document.getElementById("articleForm");

    if (article) {
      modalTitle.textContent = "Edit Artikel";
      this.populateForm(article);
    } else {
      modalTitle.textContent = "Tambah Artikel";
      form.reset();
      document.getElementById("imagePreview").innerHTML = `
        <i class="fas fa-image"></i>
        <span>Upload Gambar</span>
      `;
    }

    modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("articleModal");
    modal.classList.remove("active");
  }

  populateForm(article) {
    document.getElementById("articleTitle").value = article.title;
    document.getElementById("articleCategory").value = article.category;
    document.getElementById("articleExcerpt").value = article.excerpt;
    document.getElementById("articleContent").value = article.content;
    document.getElementById("articleStatus").value = article.status;
    document.getElementById("articleTags").value = article.tags.join(", ");
    document.getElementById("imagePreview").innerHTML = `
      <img src="${article.image}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
    `;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const imagePreview = document.getElementById("imagePreview").querySelector("img");
    const articleData = {
      title: formData.get("title"),
      category: formData.get("category"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      status: formData.get("status"),
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      image: imagePreview?.src || `https://via.placeholder.com/320x200?text=${encodeURIComponent(formData.get("title"))}`,
      author: "Admin User",
      publishDate: new Date().toLocaleDateString(),
      views: 0,
    };

    const existingIndex = this.articles.findIndex((a) => a.id === this.editingId);
    if (existingIndex >= 0) {
      this.articles[existingIndex] = { ...this.articles[existingIndex], ...articleData };
    } else {
      articleData.id = this.articles.length + 1;
      this.articles.push(articleData);
    }

    this.filteredArticles = [...this.articles];
    this.renderArticles();
    this.renderPagination();
    this.closeModal();
    this.showNotification("Artikel berhasil disimpan!", "success");
  }

  editArticle(id) {
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      this.editingId = id;
      this.openModal(article);
    }
  }

  deleteArticle(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      this.articles = this.articles.filter((a) => a.id !== id);
      this.filterArticles();
      this.showNotification("Artikel berhasil dihapus!", "success");
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    const preview = document.getElementById("imagePreview");

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
      };
      reader.readAsDataURL(file);
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check" : "info"}-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

class ProductsManager {
  constructor() {
    this.products = GamerTechData.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stockCount || p.stock || 0,
      sku: `SKU-${String(p.id).padStart(3, "0")}`,
      brand: p.brand,
      weight: (Math.random() * 5 + 0.5).toFixed(1),
      status: p.inStock ? "active" : "inactive",
      images: [p.image],
      specifications: p.description,
      createdDate: new Date().toLocaleDateString(),
      sales: p.reviewCount || 0,
    }));
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.filteredProducts = [...this.products];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderProducts();
    this.renderPagination();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("productSearch");
    searchInput?.addEventListener("input", () => this.filterProducts());

    const categoryFilter = document.getElementById("categoryFilterProducts");
    const stockFilter = document.getElementById("stockFilter");

    categoryFilter?.addEventListener("change", () => this.filterProducts());
    stockFilter?.addEventListener("change", () => this.filterProducts());

    const addBtn = document.getElementById("addProductBtn");
    addBtn?.addEventListener("click", () => this.openModal());

    const modal = document.getElementById("productModal");
    const closeBtn = document.getElementById("closeModalProducts");
    const cancelBtn = document.getElementById("cancelBtnProducts");
    const form = document.getElementById("productForm");

    closeBtn?.addEventListener("click", () => this.closeModal());
    cancelBtn?.addEventListener("click", () => this.closeModal());
    form?.addEventListener("submit", (e) => this.handleSubmit(e));

    const imagesInput = document.getElementById("productImages");
    imagesInput?.addEventListener("change", (e) => this.previewImages(e));
  }

  filterProducts() {
    const searchTerm = document.getElementById("productSearch")?.value.toLowerCase() || "";
    const categoryFilter = document.getElementById("categoryFilterProducts")?.value || "";
    const stockFilter = document.getElementById("stockFilter")?.value || "";

    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStock = !stockFilter || this.getStockStatus(product) === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });

    this.currentPage = 1;
    this.renderProducts();
    this.renderPagination();
  }

  getStockStatus(product) {
    if (product.stock === 0) return "out-of-stock";
    if (product.stock < 10) return "low-stock";
    return "in-stock";
  }

  renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

    grid.innerHTML = productsToShow
      .map((product) => `
        <div class="product-card" data-id="${product.id}">
          <div class="card-image">
            <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/320x200?text=${encodeURIComponent(product.name)}';">
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="product-sku">SKU: ${product.sku}</span>
              <span class="card-status status-${product.status}">${product.status}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Rp${product.price.toLocaleString()}</p>
            <div class="product-details">
              <span class="product-brand">${product.brand}</span>
              <span class="product-stock">Stock: ${product.stock}</span>
            </div>
            <div class="card-actions">
              <button class="action-btn edit" onclick="productsManager.editProduct(${product.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="productsManager.deleteProduct(${product.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `)
      .join("");
  }
  renderPagination() {
    const pagination = document.getElementById("productsPagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
      <button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} 
              onclick="productsManager.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="productsManager.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="pagination-ellipsis">...</span>';
      }
    }

    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? "disabled" : ""} 
              onclick="productsManager.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderProducts();
    this.renderPagination();
  }

  openModal(product = null) {
    const modal = document.getElementById("productModal");
    const modalTitle = document.getElementById("modalTitleProducts");
    const form = document.getElementById("productForm");

    if (product) {
      modalTitle.textContent = "Edit Produk";
      this.populateForm(product);
    } else {
      modalTitle.textContent = "Tambah Produk";
      form.reset();
      document.getElementById("imagesPreview").innerHTML = `
        <div class="image-preview-placeholder">
          <i class="fas fa-images"></i>
          <span>Upload Gambar</span>
        </div>
      `;
    }

    modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("productModal");
    modal.classList.remove("active");
  }

  populateForm(product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productSKU").value = product.sku;
    document.getElementById("productBrand").value = product.brand;
    document.getElementById("productWeight").value = product.weight;
    document.getElementById("productStatus").value = product.status;
    document.getElementById("productSpecifications").value = product.specifications;

    const imagesPreview = document.getElementById("imagesPreview");
    imagesPreview.innerHTML = product.images
      .map(
        (img, index) => `
        <div class="image-preview-item">
          <img src="${img}" alt="Preview ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
          <button type="button" class="remove-image" onclick="productsManager.removeImage(this)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `,
      )
      .join("");
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const imagesPreview = document.getElementById("imagesPreview").querySelectorAll("img");
    const productData = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      price: Number.parseFloat(formData.get("price")),
      stock: Number.parseInt(formData.get("stock")),
      sku: formData.get("sku"),
      brand: formData.get("brand"),
      weight: Number.parseFloat(formData.get("weight")),
      status: formData.get("status"),
      specifications: formData.get("specifications"),
      images: Array.from(imagesPreview).map((img) => img.src),
      createdDate: new Date().toLocaleDateString(),
      sales: 0,
    };

    const existingIndex = this.products.findIndex((p) => p.id === this.editingId);
    if (existingIndex >= 0) {
      // Update existing product
      this.products[existingIndex] = { ...this.products[existingIndex], ...productData };
      this.updateSharedProduct(existingIndex, productData);
    } else {
      // Add new product
      productData.id = this.products.length + 1;
      this.products.push(productData);
      this.addToSharedProducts(productData);
    }

    this.filteredProducts = [...this.products];
    this.renderProducts();
    this.renderPagination();
    this.closeModal();
    this.showNotification("Produk berhasil disimpan!", "success");

    // Notify catalog to refresh
    CatalogState.products = [...GamerTechData.products];
    CatalogState.filteredProducts = [...GamerTechData.products];
    Catalog.applyFilters();
  }

  addToSharedProducts(productData) {
    const sharedProduct = {
      id: productData.id,
      name: productData.name,
      category: productData.category,
      brand: productData.brand,
      price: productData.price,
      originalPrice: null,
      image: productData.images[0] || "https://via.placeholder.com/320x200",
      rating: 4.5, // Default rating
      reviewCount: 0,
      inStock: productData.stock > 0,
      stockCount: productData.stock,
      isNew: true,
      isFeatured: false,
      onSale: false,
      description: productData.description,
    };
    GamerTechData.products.push(sharedProduct);
  }

  updateSharedProduct(index, productData) {
    const sharedIndex = GamerTechData.products.findIndex((p) => p.id === this.products[index].id);
    if (sharedIndex >= 0) {
      GamerTechData.products[sharedIndex] = {
        ...GamerTechData.products[sharedIndex],
        name: productData.name,
        category: productData.category,
        brand: productData.brand,
        price: productData.price,
        image: productData.images[0] || GamerTechData.products[sharedIndex].image,
        inStock: productData.stock > 0,
        stockCount: productData.stock,
        description: productData.description,
      };
    }
  }

  editProduct(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      this.editingId = id;
      this.openModal(product);
    }
  }

  deleteProduct(id) {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      this.products = this.products.filter((p) => p.id !== id);
      GamerTechData.products = GamerTechData.products.filter((p) => p.id !== id);
      this.filterProducts();
      this.showNotification("Produk berhasil dihapus!", "success");

      // Notify catalog to refresh
      CatalogState.products = [...GamerTechData.products];
      CatalogState.filteredProducts = [...GamerTechData.products];
      Catalog.applyFilters();
    }
  }

  previewImages(e) {
    const files = e.target.files;
    const preview = document.getElementById("imagesPreview");

    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageItem = document.createElement("div");
          imageItem.className = "image-preview-item";
          imageItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            <button type="button" class="remove-image" onclick="productsManager.removeImage(this)">
              <i class="fas fa-times"></i>
            </button>
          `;
          preview.appendChild(imageItem);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(button) {
    button.parentElement.remove();
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check" : "info"}-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

class UsersManager {
  constructor() {
    this.users = this.generateMockUsers();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filteredUsers = [...this.users];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderUsers();
    this.renderPagination();
  }

  generateMockUsers() {
    const roles = ["admin", "customer", "editor"];
    const names = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Lisa Davis",
      "Tom Anderson",
      "Emily Taylor",
      "Chris Martin",
      "Anna Lee",
    ];

    return names.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: Math.random() > 0.2 ? "active" : "inactive",
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      orders: Math.floor(Math.random() * 20),
    }));
  }

  setupEventListeners() {
    const searchInput = document.getElementById("userSearch");
    searchInput?.addEventListener("input", () => this.filterUsers());

    const roleFilter = document.getElementById("roleFilter");
    roleFilter?.addEventListener("change", () => this.filterUsers());

    const statusFilter = document.getElementById("userStatusFilter");
    statusFilter?.addEventListener("change", () => this.filterUsers());

    const addBtn = document.getElementById("addUserBtn");
    addBtn?.addEventListener("click", () => this.openModal());

    const modal = document.getElementById("userModal");
    const closeBtn = document.getElementById("closeModalUsers");
    const cancelBtn = document.getElementById("cancelBtnUsers");
    const form = document.getElementById("userForm");

    closeBtn?.addEventListener("click", () => this.closeModal());
    cancelBtn?.addEventListener("click", () => this.closeModal());
    form?.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  filterUsers() {
    const searchTerm = document.getElementById("userSearch")?.value.toLowerCase() || "";
    const roleFilter = document.getElementById("roleFilter")?.value || "";
    const statusFilter = document.getElementById("userStatusFilter")?.value || "";

    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    this.currentPage = 1;
    this.renderUsers();
    this.renderPagination();
  }

  renderUsers() {
    const tableBody = document.getElementById("usersTableBody");
    if (!tableBody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

    tableBody.innerHTML = usersToShow
      .map(
        (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td><span class="status-badge status-${user.status}">${user.status}</span></td>
          <td>${user.joinDate}</td>
          <td>${user.lastLogin}</td>
          <td>${user.orders}</td>
          <td>
            <button class="action-btn edit" onclick="usersManager.editUser(${user.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="usersManager.deleteUser(${user.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `,
      )
      .join("");
  }

  renderPagination() {
    const pagination = document.getElementById("usersPagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
      <button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} 
              onclick="usersManager.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="usersManager.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="pagination-ellipsis">...</span>';
      }
    }

    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? "disabled" : ""} 
              onclick="usersManager.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderUsers();
    this.renderPagination();
  }

  openModal(user = null) {
    const modal = document.getElementById("userModal");
    const modalTitle = document.getElementById("modalTitleUsers");
    const form = document.getElementById("userForm");

    if (user) {
      modalTitle.textContent = "Edit Pengguna";
      this.populateForm(user);
    } else {
      modalTitle.textContent = "Tambah Pengguna";
      form.reset();
    }

    modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("userModal");
    modal.classList.remove("active");
  }

  populateForm(user) {
    document.getElementById("userName").value = user.name;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userRole").value = user.role;
    document.getElementById("userStatus").value = user.status;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      status: formData.get("status"),
      joinDate: new Date().toLocaleDateString(),
      lastLogin: new Date().toLocaleDateString(),
      orders: 0,
    };

    const existingIndex = this.users.findIndex((u) => u.id === this.editingId);
    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...userData };
    } else {
      userData.id = this.users.length + 1;
      this.users.push(userData);
    }

    this.filteredUsers = [...this.users];
    this.renderUsers();
    this.renderPagination();
    this.closeModal();
    this.showNotification("Pengguna berhasil disimpan!", "success");
  }

  editUser(id) {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      this.editingId = id;
      this.openModal(user);
    }
  }

  deleteUser(id) {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      this.users = this.users.filter((u) => u.id !== id);
      this.filterUsers();
      this.showNotification("Pengguna berhasil dihapus!", "success");
    }
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check" : "info"}-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

class TransactionsManager {
  constructor() {
    this.transactions = this.generateMockTransactions();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filteredTransactions = [...this.transactions];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderTransactions();
    this.renderPagination();
  }

  generateMockTransactions() {
    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Lisa Davis",
      "Tom Anderson Jr",
      "Emily Taylor",
      "Chris Martin Jr",
      "Anna Lee",
    ];
    const statuses = ["pending", "completed", "cancelled", "refunded"];
    const paymentMethods = ["credit-card", "paypal", "bank-transfer", "cod"];

    return Array(100).fill().map((_, index) => ({
      id: `TXN-${index}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      amount: (Math.random() * 1000 + 50).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      orderId: `ORD-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    }));
  }

  setupEventListeners() {
    const searchInput = document.getElementById("transactionSearch");
    searchInput?.addEventListener("input", () => this.filterTransactions());

    const statusFilter = document.getElementById("transactionStatusFilter");
    statusFilter?.addEventListener("change", () => this.filterTransactions());

    const paymentFilter = document.getElementById("paymentFilter");
    paymentFilter?.addEventListener("change", () => this.filterTransactions());
  }

  filterTransactions() {
    const searchTerm = document.getElementById("transactionSearch")?.value.toLowerCase() || "";
    const statusFilter = document.getElementById("transactionStatusFilter")?.value || "";
    const paymentFilter = document.getElementById("paymentFilter")?.value || "";

    this.filteredTransactions = this.transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchTerm) ||
        transaction.customer.toLowerCase().includes(searchTerm) ||
        transaction.orderId.toLowerCase().includes(searchTerm);
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesPayment = !paymentFilter || transaction.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    this.currentPage = 1;
    this.renderTransactions();
    this.renderPagination();
  }

  renderTransactions() {
    const tableBody = document.getElementById("transactionsTableBody");
    if (!tableBody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const transactionsToShow = this.filteredTransactions.slice(startIndex, endIndex);

    tableBody.innerHTML = transactionsToShow
      .map((transaction) => `
        <tr>
          <td>${transaction.id}</td>
          <td>${transaction.customer}</td>
          <td>Rp$${transaction.amount.toLocaleString()}</td>
          <td><span class="status-badge status-${transaction.status}">${transaction.status}</span></td>
          <td>${transaction.paymentMethod}</td>
          <td>${transaction.date}</td>
          <td>${transaction.orderId}</td>
          <td>
            <button class="action-btn" onclick="transactionsManager.viewDetails(${transaction.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn" onclick="transactionsManager.updateStatus(${transaction.id})">
              <i class="fas fa-sync"></i>
            </button>
          </tr>
        </td>
      `
      )
      .join("");
  }

  renderPagination() {
    const pagination = document.getElementById("transactionsPagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
      <button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} 
              onclick="transactionsManager.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="transactionsManager.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="pagination-ellipsis">...</span>';
      }
    }

    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? "disabled" : ""} 
              onclick="transactionsManager.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderTransactions();
    this.renderPagination();
  }

  viewDetails(id) {
    const transaction = this.transactions.find((t) => t.id === id);
    if (transaction) {
      alert(`Transaction Details:\nID: ${transaction.id}\nCustomer: ${transaction.customer}\nAmount: Rp$${transaction.amount}\nStatus: ${transaction.status}\nPayment Method: ${transaction.paymentMethod}\nDate: ${transaction.date}\nOrder ID: ${transaction.orderId}`);
    }
  }

  updateStatus(id) {
    const transaction = this.transactions.find((t) => t.id === id);
    if (transaction) {
      const newStatus = prompt(`Enter new status for transaction ${transaction.id} (pending, completed, cancelled, refunded):`, transaction.status);
      const validStatuses = ["pending", "completed", "cancelled", "refunded"]; // Define valid statuses
      if (validStatuses.includes(newStatus)) {
        transaction.status = newStatus;
        this.renderTransactions();
        this.showNotification(`Transaction ${transaction.id} updated to ${newStatus}!`, "success");
      } else {
        this.showNotification("Invalid status!", "error");
      }
    }
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check" : "info"}-circle"></i>
    <span>${message}</span>
  `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

const adminDashboard = new AdminDashboard();

window.productsManager = productsManager;
window.articlesManager = articlesManager;
window.usersManager = usersManager;
window.transactionsManager = transactionsManager;