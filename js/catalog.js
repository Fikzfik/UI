/**
 * Catalog Page JavaScript
 * Handles product filtering, sorting, searching, and pagination
 */

// Sample products data
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
]

// Catalog state
const CatalogState = {
  products: [...PRODUCTS_DATA],
  filteredProducts: [...PRODUCTS_DATA],
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
}

// Utility functions
const Utils = {
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  },

  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  },

  debounce(func, wait) {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },

  generateStars(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    let starsHTML = ""

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>'
    }

    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>'
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star"></i>'
    }

    return starsHTML
  },
}

// Catalog controller
const Catalog = {
  // DOM elements
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

  // Initialize catalog functionality
  init() {
    this.bindElements()
    this.bindEvents()
    this.initFilters()
    this.initPriceSlider()
    this.loadProducts()
    this.updateResultsCount()
    this.generatePagination()
  },

  // Bind DOM elements
  bindElements() {
    this.productsGrid = document.getElementById("products-grid")
    this.searchInput = document.getElementById("product-search")
    this.sortSelect = document.getElementById("sort-select")
    this.viewButtons = document.querySelectorAll(".view-btn")
    this.filterGroups = document.querySelectorAll(".filter-group")
    this.activeFiltersContainer = document.getElementById("active-filters")
    this.resultsCount = document.getElementById("results-count")
    this.pagination = document.getElementById("pagination")
    this.mobileFilterToggle = document.getElementById("mobile-filter-toggle")
    this.filtersSidebar = document.getElementById("filters-sidebar")
    this.clearFiltersBtn = document.getElementById("clear-filters")
  },

  // Bind event listeners
  bindEvents() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        Utils.debounce((e) => {
          this.handleSearch(e.target.value)
        }, 300),
      )
    }

    // Sort functionality
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.handleSort(e.target.value)
      })
    }

    // View toggle
    this.viewButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleViewChange(e.target.dataset.view)
      })
    })

    // Filter groups toggle
    this.filterGroups.forEach((group) => {
      const title = group.querySelector(".filter-title")
      if (title) {
        title.addEventListener("click", () => {
          group.classList.toggle("active")
        })
      }
    })

    // Filter checkboxes
    document.addEventListener("change", (e) => {
      if (e.target.type === "checkbox" && e.target.name) {
        this.handleFilterChange(e.target.name, e.target.value, e.target.checked)
      }
    })

    // Mobile filter toggle
    if (this.mobileFilterToggle) {
      this.mobileFilterToggle.addEventListener("click", () => {
        this.toggleMobileFilters()
      })
    }

    // Clear filters
    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters()
      })
    }

    // Suggestion tags
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-tag")) {
        this.handleSearch(e.target.textContent)
        if (this.searchInput) {
          this.searchInput.value = e.target.textContent
        }
      }
    })

    // Product card clicks
    document.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card")
      if (productCard && !e.target.closest("button")) {
        const productId = productCard.dataset.id
        window.location.href = `product-detail.html?id=${productId}`
      }
    })

    // Add to cart buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) {
        e.stopPropagation()
        const productCard = e.target.closest(".product-card")
        const productId = Number.parseInt(productCard.dataset.id)
        this.addToCart(productId)
      }
    })

    // Product actions (wishlist, compare, quick view)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".product-action")) {
        e.stopPropagation()
        const action = e.target.closest(".product-action").dataset.action
        const productCard = e.target.closest(".product-card")
        const productId = Number.parseInt(productCard.dataset.id)
        this.handleProductAction(action, productId)
      }
    })
  },

  // Initialize filters (open first few filter groups)
  initFilters() {
    // Open first 3 filter groups by default
    this.filterGroups.forEach((group, index) => {
      if (index < 3) {
        group.classList.add("active")
      }
    })
  },

  // Initialize price range slider
  initPriceSlider() {
    const rangeMin = document.querySelector(".range-min")
    const rangeMax = document.querySelector(".range-max")
    const minPriceInput = document.getElementById("min-price")
    const maxPriceInput = document.getElementById("max-price")
    const progress = document.querySelector(".progress")

    if (!rangeMin || !rangeMax || !progress) return

    const updateSlider = () => {
      const minVal = Number.parseInt(rangeMin.value)
      const maxVal = Number.parseInt(rangeMax.value)
      const minPercent = (minVal / rangeMin.max) * 100
      const maxPercent = (maxVal / rangeMax.max) * 100

      progress.style.left = minPercent + "%"
      progress.style.right = 100 - maxPercent + "%"

      if (minPriceInput) minPriceInput.value = minVal
      if (maxPriceInput) maxPriceInput.value = maxVal

      // Update filter
      CatalogState.currentFilters.priceRange = { min: minVal, max: maxVal }
      this.applyFilters()
    }

    rangeMin.addEventListener("input", updateSlider)
    rangeMax.addEventListener("input", updateSlider)

    // Handle manual input
    if (minPriceInput) {
      minPriceInput.addEventListener("change", (e) => {
        rangeMin.value = e.target.value
        updateSlider()
      })
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener("change", (e) => {
        rangeMax.value = e.target.value
        updateSlider()
      })
    }
  },

  // Handle search
  handleSearch(query) {
    CatalogState.searchQuery = query.toLowerCase()
    CatalogState.currentPage = 1
    this.applyFilters()
  },

  // Handle sort
  handleSort(sortType) {
    CatalogState.currentSort = sortType
    CatalogState.currentPage = 1
    this.applyFilters()
  },

  // Handle view change
  handleViewChange(view) {
    CatalogState.currentView = view

    // Update active button
    this.viewButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view)
    })

    // Update grid class
    if (this.productsGrid) {
      this.productsGrid.classList.toggle("list-view", view === "list")
    }
  },

  // Handle filter change
  handleFilterChange(filterType, value, checked) {
    const filters = CatalogState.currentFilters

    if (filterType === "category") {
      if (checked) {
        filters.categories.push(value)
      } else {
        filters.categories = filters.categories.filter((cat) => cat !== value)
      }
    } else if (filterType === "brand") {
      if (checked) {
        filters.brands.push(value)
      } else {
        filters.brands = filters.brands.filter((brand) => brand !== value)
      }
    } else if (filterType === "rating") {
      if (checked) {
        filters.ratings.push(Number.parseInt(value))
      } else {
        filters.ratings = filters.ratings.filter((rating) => rating !== Number.parseInt(value))
      }
    } else if (filterType === "availability") {
      if (checked) {
        filters.availability.push(value)
      } else {
        filters.availability = filters.availability.filter((avail) => avail !== value)
      }
    }

    CatalogState.currentPage = 1
    this.applyFilters()
    this.updateActiveFilters()
  },

  // Apply all filters
  applyFilters() {
    let filtered = [...CatalogState.products]

    // Apply search filter
    if (CatalogState.searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(CatalogState.searchQuery) ||
          product.description.toLowerCase().includes(CatalogState.searchQuery) ||
          product.category.toLowerCase().includes(CatalogState.searchQuery) ||
          product.brand.toLowerCase().includes(CatalogState.searchQuery),
      )
    }

    // Apply category filter
    if (CatalogState.currentFilters.categories.length > 0) {
      filtered = filtered.filter((product) => CatalogState.currentFilters.categories.includes(product.category))
    }

    // Apply brand filter
    if (CatalogState.currentFilters.brands.length > 0) {
      filtered = filtered.filter((product) => CatalogState.currentFilters.brands.includes(product.brand))
    }

    // Apply price range filter
    const { min, max } = CatalogState.currentFilters.priceRange
    filtered = filtered.filter((product) => product.price >= min && product.price <= max)

    // Apply rating filter
    if (CatalogState.currentFilters.ratings.length > 0) {
      filtered = filtered.filter((product) => {
        return CatalogState.currentFilters.ratings.some((rating) => {
          if (rating === 5) {
            return product.rating >= 4.5
          } else {
            return product.rating >= rating && product.rating < rating + 1
          }
        })
      })
    }

    // Apply availability filter
    if (CatalogState.currentFilters.availability.length > 0) {
      filtered = filtered.filter((product) => {
        return CatalogState.currentFilters.availability.some((filter) => {
          switch (filter) {
            case "in-stock":
              return product.inStock
            case "on-sale":
              return product.onSale
            case "new-arrivals":
              return product.isNew
            default:
              return true
          }
        })
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (CatalogState.currentSort) {
        case "newest":
          return b.isNew - a.isNew
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
          return b.reviewCount - a.reviewCount
        case "featured":
        default:
          return b.isFeatured - a.isFeatured
      }
    })

    CatalogState.filteredProducts = filtered
    this.loadProducts()
    this.updateResultsCount()
    this.generatePagination()
  },

  // Load and display products
  loadProducts() {
    if (!this.productsGrid) return

    const startIndex = (CatalogState.currentPage - 1) * CatalogState.productsPerPage
    const endIndex = startIndex + CatalogState.productsPerPage
    const productsToShow = CatalogState.filteredProducts.slice(startIndex, endIndex)

    if (productsToShow.length === 0) {
      this.showNoResults()
      return
    }

    this.productsGrid.innerHTML = productsToShow.map((product) => this.createProductCard(product)).join("")

    // Animate product cards
    const productCards = this.productsGrid.querySelectorAll(".product-card")
    productCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 100)
    })
  },

  // Create product card HTML
  createProductCard(product) {
    const discount = Utils.calculateDiscount(product.originalPrice, product.price)
    const stockStatus = this.getStockStatus(product)

    let badge = ""
    if (product.onSale && discount > 0) {
      badge = `<div class="product-badge sale">-${discount}%</div>`
    } else if (product.isNew) {
      badge = '<div class="product-badge new">New</div>'
    } else if (product.isFeatured) {
      badge = '<div class="product-badge featured">Featured</div>'
    }

    return `
            <div class="product-card" data-id="${product.id}" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
                ${badge}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
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
                    <h3 class="product-title">${product.name}</h3>
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
        `
  },

  // Get stock status
  getStockStatus(product) {
    if (!product.inStock) {
      return { class: "out-of-stock", text: "Out of Stock" }
    } else if (product.stockCount <= 5) {
      return { class: "low-stock", text: `Only ${product.stockCount} left` }
    } else {
      return { class: "in-stock", text: "In Stock" }
    }
  },

  // Get category display name
  getCategoryName(category) {
    const categories = {
      "gaming-gear": "Gaming Gear",
      "pc-components": "PC Components",
      monitors: "Gaming Monitors",
      audio: "Gaming Audio",
      accessories: "Accessories",
    }
    return categories[category] || category
  },

  // Show no results message
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
        `
  },

  // Update results count
  updateResultsCount() {
    if (!this.resultsCount) return

    const total = CatalogState.filteredProducts.length
    const startIndex = (CatalogState.currentPage - 1) * CatalogState.productsPerPage + 1
    const endIndex = Math.min(startIndex + CatalogState.productsPerPage - 1, total)

    if (total === 0) {
      this.resultsCount.textContent = "No products found"
    } else {
      this.resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} products`
    }
  },

  // Generate pagination
  generatePagination() {
    if (!this.pagination) return

    const totalProducts = CatalogState.filteredProducts.length
    const totalPages = Math.ceil(totalProducts / CatalogState.productsPerPage)
    const currentPage = CatalogState.currentPage

    if (totalPages <= 1) {
      this.pagination.innerHTML = ""
      return
    }

    let paginationHTML = ""

    // Previous button
    paginationHTML += `
            <button class="pagination-item ${currentPage === 1 ? "disabled" : ""}" 
                    onclick="Catalog.goToPage(${currentPage - 1})" 
                    ${currentPage === 1 ? "disabled" : ""}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `

    // Page numbers
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-item" onclick="Catalog.goToPage(1)">1</button>`
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-item disabled">...</span>`
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
                <button class="pagination-item ${i === currentPage ? "active" : ""}" 
                        onclick="Catalog.goToPage(${i})">
                    ${i}
                </button>
            `
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-item disabled">...</span>`
      }
      paginationHTML += `<button class="pagination-item" onclick="Catalog.goToPage(${totalPages})">${totalPages}</button>`
    }

    // Next button
    paginationHTML += `
            <button class="pagination-item ${currentPage === totalPages ? "disabled" : ""}" 
                    onclick="Catalog.goToPage(${currentPage + 1})" 
                    ${currentPage === totalPages ? "disabled" : ""}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `

    this.pagination.innerHTML = paginationHTML
  },

  // Go to specific page
  goToPage(page) {
    const totalPages = Math.ceil(CatalogState.filteredProducts.length / CatalogState.productsPerPage)

    if (page < 1 || page > totalPages) return

    CatalogState.currentPage = page
    this.loadProducts()
    this.updateResultsCount()
    this.generatePagination()

    // Scroll to top of products
    if (this.productsGrid) {
      this.productsGrid.scrollIntoView({ behavior: "smooth" })
    }
  },

  // Update active filters display
  updateActiveFilters() {
    if (!this.activeFiltersContainer) return

    const activeFilters = []
    const filters = CatalogState.currentFilters

    // Category filters
    filters.categories.forEach((category) => {
      activeFilters.push({
        type: "category",
        value: category,
        label: this.getCategoryName(category),
      })
    })

    // Brand filters
    filters.brands.forEach((brand) => {
      activeFilters.push({
        type: "brand",
        value: brand,
        label: brand.charAt(0).toUpperCase() + brand.slice(1),
      })
    })

    // Price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < 5000) {
      activeFilters.push({
        type: "price",
        value: `${filters.priceRange.min}-${filters.priceRange.max}`,
        label: `${Utils.formatPrice(filters.priceRange.min)} - ${Utils.formatPrice(filters.priceRange.max)}`,
      })
    }

    // Rating filters
    filters.ratings.forEach((rating) => {
      activeFilters.push({
        type: "rating",
        value: rating,
        label: `${rating}+ Stars`,
      })
    })

    // Availability filters
    filters.availability.forEach((availability) => {
      const labels = {
        "in-stock": "In Stock",
        "on-sale": "On Sale",
        "new-arrivals": "New Arrivals",
      }
      activeFilters.push({
        type: "availability",
        value: availability,
        label: labels[availability],
      })
    })

    // Search query
    if (CatalogState.searchQuery) {
      activeFilters.push({
        type: "search",
        value: CatalogState.searchQuery,
        label: `Search: "${CatalogState.searchQuery}"`,
      })
    }

    // Render active filters
    if (activeFilters.length === 0) {
      this.activeFiltersContainer.innerHTML = ""
      return
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
      .join("")
  },

  // Remove specific filter
  removeFilter(type, value) {
    const filters = CatalogState.currentFilters

    switch (type) {
      case "category":
        filters.categories = filters.categories.filter((cat) => cat !== value)
        break
      case "brand":
        filters.brands = filters.brands.filter((brand) => brand !== value)
        break
      case "rating":
        filters.ratings = filters.ratings.filter((rating) => rating !== Number.parseInt(value))
        break
      case "availability":
        filters.availability = filters.availability.filter((avail) => avail !== value)
        break
      case "price":
        filters.priceRange = { min: 0, max: 5000 }
        // Reset price slider
        const rangeMin = document.querySelector(".range-min")
        const rangeMax = document.querySelector(".range-max")
        if (rangeMin) rangeMin.value = 0
        if (rangeMax) rangeMax.value = 5000
        break
      case "search":
        CatalogState.searchQuery = ""
        if (this.searchInput) this.searchInput.value = ""
        break
    }

    // Update checkboxes
    this.updateFilterCheckboxes()

    CatalogState.currentPage = 1
    this.applyFilters()
    this.updateActiveFilters()
  },

  // Update filter checkboxes based on current state
  updateFilterCheckboxes() {
    const filters = CatalogState.currentFilters

    // Update category checkboxes
    document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
      checkbox.checked = filters.categories.includes(checkbox.value)
    })

    // Update brand checkboxes
    document.querySelectorAll('input[name="brand"]').forEach((checkbox) => {
      checkbox.checked = filters.brands.includes(checkbox.value)
    })

    // Update rating checkboxes
    document.querySelectorAll('input[name="rating"]').forEach((checkbox) => {
      checkbox.checked = filters.ratings.includes(Number.parseInt(checkbox.value))
    })

    // Update availability checkboxes
    document.querySelectorAll('input[name="availability"]').forEach((checkbox) => {
      checkbox.checked = filters.availability.includes(checkbox.value)
    })
  },

  // Clear all filters
  clearAllFilters() {
    CatalogState.currentFilters = {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 5000 },
      ratings: [],
      availability: [],
    }
    CatalogState.searchQuery = ""
    CatalogState.currentPage = 1

    // Reset UI
    this.updateFilterCheckboxes()
    if (this.searchInput) this.searchInput.value = ""

    // Reset price slider
    const rangeMin = document.querySelector(".range-min")
    const rangeMax = document.querySelector(".range-max")
    const minPriceInput = document.getElementById("min-price")
    const maxPriceInput = document.getElementById("max-price")
    const progress = document.querySelector(".progress")

    if (rangeMin) rangeMin.value = 0
    if (rangeMax) rangeMax.value = 5000
    if (minPriceInput) minPriceInput.value = 0
    if (maxPriceInput) maxPriceInput.value = 5000
    if (progress) {
      progress.style.left = "0%"
      progress.style.right = "0%"
    }

    this.applyFilters()
    this.updateActiveFilters()
  },

  // Toggle mobile filters
  toggleMobileFilters() {
    if (this.filtersSidebar) {
      this.filtersSidebar.classList.toggle("active")
    }
  },

  // Add product to cart
  addToCart(productId) {
    const product = CatalogState.products.find((p) => p.id === productId)
    if (!product || !product.inStock) return

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count in navbar
    this.updateCartCount()

    // Show notification
    this.showNotification(`${product.name} added to cart!`, "success")
  },

  // Handle product actions (wishlist, compare, quick view)
  handleProductAction(action, productId) {
    const product = CatalogState.products.find((p) => p.id === productId)
    if (!product) return

    switch (action) {
      case "wishlist":
        this.toggleWishlist(productId)
        break
      case "compare":
        this.addToCompare(productId)
        break
      case "quick-view":
        this.showQuickView(productId)
        break
    }
  },

  // Toggle wishlist
  toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const index = wishlist.indexOf(productId)

    if (index > -1) {
      wishlist.splice(index, 1)
      this.showNotification("Removed from wishlist", "info")
    } else {
      wishlist.push(productId)
      this.showNotification("Added to wishlist!", "success")
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  },

  // Add to compare
  addToCompare(productId) {
    const compare = JSON.parse(localStorage.getItem("compare") || "[]")

    if (compare.length >= 4) {
      this.showNotification("You can only compare up to 4 products", "warning")
      return
    }

    if (!compare.includes(productId)) {
      compare.push(productId)
      localStorage.setItem("compare", JSON.stringify(compare))
      this.showNotification("Added to compare list!", "success")
    } else {
      this.showNotification("Product already in compare list", "info")
    }
  },

  // Show quick view modal
  showQuickView(productId) {
    // This would open a modal with product details
    // For now, just redirect to product detail page
    window.location.href = `product-detail.html?id=${productId}`
  },

  // Update cart count in navbar
  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      cartCountElement.textContent = totalItems
    }
  },

  // Show notification
  showNotification(message, type = "info") {
    // Remove existing notifications
    document.querySelectorAll(".notification").forEach((notification) => {
      notification.remove()
    })

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : type === "warning" ? "fa-exclamation-triangle" : "fa-info-circle"}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

    // Add styles if not already added
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style")
      style.id = "notification-styles"
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
            `
      document.head.appendChild(style)
    }

    // Add to DOM
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100)

    // Bind close event
    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => notification.remove(), 300)
    })

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove("show")
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)
  },
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  Catalog.init()
  Catalog.updateCartCount() // Update cart count on page load
})

// Export for global access
window.Catalog = Catalog
