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
    // Mobile menu toggle
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

    // Date range filter
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

    // Refresh data
    const refreshBtn = document.getElementById("refreshData");
    refreshBtn?.addEventListener("click", () => {
      this.refreshDashboard();
    });

    // Chart period buttons
    const chartBtns = document.querySelectorAll(".chart-btn");
    chartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        chartBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.updateSalesTrendChart(e.target.dataset.period);
      });
    });

    // Navigation
    const navLinks = document.querySelectorAll(".nav-link");
    const dashboardContent = document.querySelector(".dashboard-content");
    const managementSections = document.querySelectorAll(".management-section");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all nav items
        navLinks.forEach((l) => l.parentElement.classList.remove("active"));

        // Add active class to clicked nav item
        e.target.closest(".nav-item").classList.add("active");

        // Get section name
        const section = e.target.dataset.section;

        // Hide all sections
        dashboardContent.style.display = "none";
        managementSections.forEach((s) => (s.style.display = "none"));

        // Show selected section
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
          targetSection.style.display = "block";
          // Update page title
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

          // Initialize section manager if not already initialized
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
    const products = [
      "Gaming Mouse RGB Pro",
      "Mechanical Keyboard",
      "Gaming Headset",
      "Graphics Card RTX 4080",
      'Gaming Monitor 27"',
      "Gaming Chair Pro",
      "SSD 1TB NVMe",
      "RAM 32GB DDR5",
      "CPU Cooler RGB",
      "Power Supply 850W",
    ];

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

    // Generate sales data for the last 30 days
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

    // Generate recent orders
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

    // Generate top products
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

    // Generate category data
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

    // Revenue Sparkline
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

    // Orders Sparkline
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

    // AOV Sparkline
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

    // Customers Sparkline
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
                    <td>$${order.amount.toLocaleString()}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>${order.date}</td>
                </tr>
            `
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
        `
      )
      .join("");
  }

  updateSalesTrendChart(period) {
    console.log("Updating sales trend chart for period:", period);
    // Implement period-based data filtering if needed
  }

  applyCustomDateRange(startDate, endDate) {
    console.log("Applying custom date range:", startDate, "to", endDate);
    // Implement date range filtering if needed
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

// Articles Manager
class ArticlesManager {
  constructor() {
    this.articles = [
      {
        id: 1,
        title: "Top 10 Gaming Trends in 2025",
        category: "gaming",
        excerpt: "Explore the latest trends shaping the gaming industry this year.",
        content: "The gaming industry in 2025 is booming with innovations like VR integration, AI-driven NPCs, and cross-platform play. This article dives into the top 10 trends you need to know.",
        status: "published",
        tags: ["gaming", "trends", "2025"],
        image: "https://via.placeholder.com/150/FF5733",
        author: "Admin",
        publishDate: "2025-06-01",
        views: 150
      },
      {
        id: 2,
        title: "Best GPUs for Gaming PCs",
        category: "hardware",
        excerpt: "A guide to choosing the best graphics card for your gaming setup.",
        content: "This article compares the latest GPUs from NVIDIA, AMD, and Intel, highlighting performance, price, and features for gamers.",
        status: "published",
        tags: ["hardware", "GPU", "gaming"],
        image: "https://via.placeholder.com/150/33FF57",
        author: "TechGuru",
        publishDate: "2025-05-20",
        views: 230
      },
      {
        id: 3,
        title: "How to Build a Budget Gaming PC",
        category: "tutorial",
        excerpt: "Step-by-step guide to building a gaming PC on a budget.",
        content: "Learn how to select components, assemble your PC, and optimize performance without breaking the bank.",
        status: "draft",
        tags: ["tutorial", "PC build", "budget"],
        image: "https://via.placeholder.com/150/5733FF",
        author: "DIYMaster",
        publishDate: "2025-06-10",
        views: 50
      },
      {
        id: 4,
        title: "Review: Cyberpunk 2077 Next-Gen Update",
        category: "review",
        excerpt: "Is the next-gen update for Cyberpunk 2077 worth your time?",
        content: "We dive into the improvements, new features, and performance of the Cyberpunk 2077 next-gen update on modern consoles and PCs.",
        status: "published",
        tags: ["review", "cyberpunk", "gaming"],
        image: "https://via.placeholder.com/150/FF33A1",
        author: "GameCritic",
        publishDate: "2025-04-15",
        views: 320
      },
      {
        id: 5,
        title: "The Rise of Esports in Asia",
        category: "gaming",
        excerpt: "How Asia is becoming the global hub for competitive gaming.",
        content: "From South Korea to China, esports is exploding in Asia. This article explores the key players, events, and trends driving the scene.",
        status: "published",
        tags: ["esports", "gaming", "asia"],
        image: "https://via.placeholder.com/150/33FFA1",
        author: "Admin",
        publishDate: "2025-06-05",
        views: 180
      },
      {
        id: 6,
        title: "Overclocking Your CPU Safely",
        category: "tutorial",
        excerpt: "Learn how to boost your CPU performance with safe overclocking.",
        content: "This tutorial covers the basics of overclocking, including tools, settings, and safety tips to avoid damaging your hardware.",
        status: "archived",
        tags: ["tutorial", "overclocking", "hardware"],
        image: "https://via.placeholder.com/150/A133FF",
        author: "TechGuru",
        publishDate: "2025-03-01",
        views: 90
      },
      {
        id: 7,
        title: "Review: Razer DeathAdder V3 Pro",
        category: "review",
        excerpt: "A detailed look at Razer's latest gaming mouse.",
        content: "The Razer DeathAdder V3 Pro promises precision and comfort. We test its performance in gaming and productivity tasks.",
        status: "published",
        tags: ["review", "gaming mouse", "razer"],
        image: "https://via.placeholder.com/150/FF5733",
        author: "GameCritic",
        publishDate: "2025-05-25",
        views: 260
      },
      {
        id: 8,
        title: "The Future of VR Gaming",
        category: "gaming",
        excerpt: "What’s next for virtual reality in gaming?",
        content: "From lightweight headsets to immersive worlds, we explore the advancements driving VR gaming in 2025 and beyond.",
        status: "draft",
        tags: ["VR", "gaming", "future"],
        image: "https://via.placeholder.com/150/33FF57",
        author: "Admin",
        publishDate: "2025-06-15",
        views: 70
      },
      {
        id: 9,
        title: "Upgrading Your RAM: What You Need to Know",
        category: "hardware",
        excerpt: "A guide to choosing and installing RAM for your PC.",
        content: "This article explains how to select the right RAM, install it, and optimize your system for better performance.",
        status: "published",
        tags: ["hardware", "RAM", "upgrade"],
        image: "https://via.placeholder.com/150/5733FF",
        author: "DIYMaster",
        publishDate: "2025-04-10",
        views: 200
      },
      {
        id: 10,
        title: "Review: Elden Ring DLC",
        category: "review",
        excerpt: "Does the new Elden Ring DLC live up to the hype?",
        content: "We explore the new areas, bosses, and mechanics in the Elden Ring DLC, comparing it to the base game.",
        status: "published",
        tags: ["review", "elden ring", "DLC"],
        image: "https://via.placeholder.com/150/FF33A1",
        author: "GameCritic",
        publishDate: "2025-06-20",
        views: 400
      },
      {
        id: 11,
        title: "Optimizing Your Gaming Setup",
        category: "tutorial",
        excerpt: "Tips to enhance your gaming experience with the right setup.",
        content: "From monitor placement to cable management, this guide helps you create the ultimate gaming environment.",
        status: "published",
        tags: ["tutorial", "gaming setup", "optimization"],
        image: "https://via.placeholder.com/150/33FFA1",
        author: "Admin",
        publishDate: "2025-05-30",
        views: 140
      },
      {
        id: 12,
        title: "The Evolution of Gaming Consoles",
        category: "gaming",
        excerpt: "A look at how consoles have changed over the decades.",
        content: "From the Atari 2600 to the latest PlayStation and Xbox, we trace the history and future of gaming consoles.",
        status: "archived",
        tags: ["gaming", "consoles", "history"],
        image: "https://via.placeholder.com/150/A133FF",
        author: "TechGuru",
        publishDate: "2025-02-15",
        views: 110
      }
    ]
    this.filteredArticles = [...this.articles];
    this.currentPage = 1;
    this.itemsPerPage = 6;
    this.editingId = null;
    this.setupEventListeners();
    this.renderArticles();
    this.renderPagination();
  }

  setupEventListeners() {
    try {
      const searchInput = document.getElementById("articleSearch");
      const categoryFilter = document.getElementById("categoryFilter");
      const statusFilter = document.getElementById("statusFilter");
      const addBtn = document.getElementById("addArticleBtn");
      const modal = document.getElementById("articleModal");
      const closeBtn = document.getElementById("closeModalBtn");
      const cancelBtn = document.getElementById("cancelBtnArticles");
      const form = document.getElementById("modalForm");
      const imageInput = document.getElementById("imageInput");

      if (!modal || !form || !closeBtn || !cancelBtn) {
        console.error("Required modal elements not found");
        return;
      }

      searchInput?.addEventListener("input", () => this.filterArticles());
      categoryFilter?.addEventListener("change", () => this.filterArticles());
      statusFilter?.addEventListener("change", () => this.filterArticles());
      addBtn?.addEventListener("click", () => this.openModal());
      closeBtn?.addEventListener("click", () => this.closeModal());
      cancelBtn?.addEventListener("click", () => this.closeModal());
      form?.addEventListener("submit", (e) => this.handleSubmit(e));
      imageInput?.addEventListener("change", (e) => this.previewImage(e));
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    }
  }

  openModal(article = null) {
    try {
      const modal = document.getElementById("articleModal");
      const modalTitle = document.getElementById("modalTitleArticles");
      const form = document.getElementById("modalForm");

      if (!modal || !modalTitle || !form) {
        console.error("Modal elements not found");
        return;
      }

      modal.classList.add("active");
      modalTitle.textContent = article ? "Edit Artikel" : "Tambah Artikel";
      this.editingId = article ? article.id : null;

      // Populate form if editing
      document.getElementById("nameInput").value = article?.title || "";
      document.getElementById("categoryInput").value = article?.category || "gaming";
      document.getElementById("excerptInput").value = article?.excerpt || "";
      document.getElementById("contentInput").value = article?.content || "";
      document.getElementById("statusSelect").value = article?.status || "published";
      document.getElementById("tagsInput").value = article?.tags?.join(", ") || "";
      document.getElementById("imagePreview").innerHTML = article?.image
        ? `<img src="${article.image}" alt="Preview" style="max-width: 100px;">`
        : "";
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  }

  closeModal() {
    try {
      const modal = document.getElementById("articleModal");
      const form = document.getElementById("modalForm");

      if (!modal || !form) return;

      modal.classList.remove("active");
      form.reset();
      document.getElementById("imagePreview").innerHTML = "";
      this.editingId = null;
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  }

  previewImage(event) {
    try {
      const file = event.target.files[0];
      const preview = document.getElementById("imagePreview");

      if (!preview) return;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100px;">`;
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = "";
      }
    } catch (error) {
      console.error("Error previewing image:", error);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const article = {
        id: this.editingId || Date.now(),
        title: formData.get("title"),
        category: formData.get("category"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        status: formData.get("status"),
        tags: formData.get("tags").split(",").map(tag => tag.trim()).filter(tag => tag),
        image: document.getElementById("imagePreview").querySelector("img")?.src || "https://via.placeholder.com/150",
        author: "Admin",
        publishDate: new Date().toISOString().split("T")[0],
        views: this.editingId ? this.articles.find(a => a.id === this.editingId)?.views || 0 : 0
      };

      if (this.editingId) {
        const index = this.articles.findIndex(a => a.id === this.editingId);
        if (index !== -1) {
          this.articles[index] = article;
        }
      } else {
        this.articles.push(article);
      }

      this.filteredArticles = [...this.articles];
      this.renderArticles();
      this.renderPagination();
      this.closeModal();
      this.showNotification(`Artikel ${this.editingId ? "diperbarui" : "ditambahkan"}!`, "success");
    } catch (error) {
      console.error("Error handling form submission:", error);
      this.showNotification("Gagal menyimpan artikel!", "error");
    }
  }

  editArticle(id) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      this.openModal(article);
    }
  }

  deleteArticle(id) {
    if (confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        this.articles = this.articles.filter(a => a.id !== id);
        this.filteredArticles = [...this.articles];
        this.renderArticles();
        this.renderPagination();
        this.showNotification("Artikel dihapus!", "success");
      } catch (error) {
        console.error("Error deleting article:", error);
        this.showNotification("Gagal menghapus artikel!", "error");
      }
    }
  }

  filterArticles() {
    try {
      const searchTerm = document.getElementById("articleSearch")?.value.toLowerCase() || "";
      const category = document.getElementById("categoryFilter")?.value || "";
      const status = document.getElementById("statusFilter")?.value || "";

      this.filteredArticles = this.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || article.category === category;
        const matchesStatus = !status || article.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
      });

      this.currentPage = 1;
      this.renderArticles();
      this.renderPagination();
    } catch (error) {
      console.error("Error filtering articles:", error);
    }
  }

  renderArticles() {
    try {
      const grid = document.getElementById("articlesGrid");
      if (!grid) {
        console.error("Articles grid element not found");
        return;
      }

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
                                        <button class="action-btn edit" onclick="window.articlesManager.editArticle(${article.id})" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn delete" onclick="window.articlesManager.deleteArticle(${article.id})" title="Delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
        )
        .join("") || "<p>Tidak ada artikel ditemukan.</p>";
    } catch (error) {
      console.error("Error rendering articles:", error);
    }
  }

  renderPagination() {
    try {
      const pagination = document.getElementById("articlesPagination");
      if (!pagination) {
        console.error("Pagination element not found");
        return;
      }

      const pageCount = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
      let paginationHTML = "";

      if (pageCount <= 1) {
        pagination.innerHTML = "";
        return;
      }

      paginationHTML += `<button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} onclick="window.articlesManager.changePage(${this.currentPage - 1})">Previous</button>`;

      for (let i = 1; i <= pageCount; i++) {
        if (pageCount > 7 && (i > 3 && i < pageCount - 2 && Math.abs(i - this.currentPage) > 1)) {
          if (i === 4) paginationHTML += `<span class="pagination-ellipsis">...</span>`;
          continue;
        }
        paginationHTML += `<button class="pagination-btn ${i === this.currentPage ? "active" : ""}" onclick="window.articlesManager.changePage(${i})">${i}</button>`;
      }

      paginationHTML += `<button class="pagination-btn" ${this.currentPage === pageCount ? "disabled" : ""} onclick="window.articlesManager.changePage(${this.currentPage + 1})">Next</button>`;

      pagination.innerHTML = paginationHTML;
    } catch (error) {
      console.error("Error rendering pagination:", error);
    }
  }

  changePage(page) {
    this.currentPage = page;
    this.renderArticles();
    this.renderPagination();
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }, 100);
  }
}

class ProductsManager {
  constructor() {
    this.products = this.generateMockProducts();
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

  generateMockProducts() {
    const categories = [
      "gaming-peripherals",
      "pc-components",
      "gaming-furniture",
      "accessories",
    ];
    const statuses = ["active", "inactive", "discontinued"];
    const products = [
      { name: "Gaming Mouse RGB Pro", brand: "TechGear", price: 750000 },
      { name: "Mechanical Keyboard Cherry MX", brand: "KeyMaster", price: 1200000 },
      { name: "Gaming Headset 7.1 Surround", brand: "AudioMax", price: 850000 },
      { name: "Graphics Card RTX 4080", brand: "NVIDIA", price: 15000000 },
      { name: 'Gaming Monitor 27" 144Hz', brand: "ViewPro", price: 4500000 },
      { name: "Gaming Chair Ergonomic", brand: "ComfortZone", price: 2800000 },
      { name: "SSD 1TB NVMe", brand: "SpeedDrive", price: 1500000 },
      { name: "RAM 32GB DDR5", brand: "MemoryMax", price: 3200000 },
      { name: "CPU Cooler RGB", brand: "CoolTech", price: 650000 },
      { name: "Power Supply 850W", brand: "PowerCore", price: 1800000 },
      { name: "Wireless Gaming Controller", brand: "GamePad", price: 950000 },
      { name: "RGB LED Strip Kit", brand: "LightTech", price: 350000 },
    ];

    return products.map((product, index) => ({
      id: index + 1,
      name: product.name,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `High-quality ${product.name.toLowerCase()} designed for professional gaming and productivity.`,
      price: product.price,
      stock: Math.floor(Math.random() * 100) + 10,
      sku: `SKU-${String(index + 1).padStart(3, "0")}`,
      brand: product.brand,
      weight: (Math.random() * 5 + 0.5).toFixed(1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      images: [
        `https://via.placeholder.com/320x200?text=${encodeURIComponent(product.name)}`, // Reliable placeholder
      ],
      specifications: `Technical specifications for ${product.name} include high-performance features tailored for gaming.`,
      createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      sales: Math.floor(Math.random() * 200) + 20,
    }));
  }

  setupEventListeners() {
    const searchInput = document.getElementById("productSearch");
    searchInput?.addEventListener("input", () => this.filterProducts());

    const categoryFilter = document.getElementById("productCategoryFilter"); // Fixed ID
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
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
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
                <div class="upload-placeholder">
                    <i class="fas fa-images"></i>
                    <span>Upload Gambar (Max 5)</span>
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
    document.getElementById("productSpecs").value = product.specifications;
    // Show existing images in preview
    const preview = document.getElementById("imagesPreview");
    preview.innerHTML = product.images
      .map((img) => `
                <img src="${img}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover; margin: 5px; border-radius: 8px;">
            `)
      .join("");
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const imagesPreview = document.getElementById("imagesPreview");
    const productData = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      price: Number.parseInt(formData.get("price")),
      stock: Number.parseInt(formData.get("stock")),
      sku: formData.get("sku"),
      brand: formData.get("brand"),
      weight: Number.parseFloat(formData.get("weight")),
      status: formData.get("status"),
      specifications: formData.get("specifications"),
      images: Array.from(imagesPreview.querySelectorAll("img"))
        .map((img) => img.src)
        .length > 0
        ? Array.from(imagesPreview.querySelectorAll("img")).map((img) => img.src)
        : [`https://via.placeholder.com/320x200?text=${encodeURIComponent(formData.get("name"))}`],
      createdDate: new Date().toLocaleDateString(),
      sales: 0,
    };

    const existingIndex = this.products.findIndex((p) => p.id === this.editingId);
    if (existingIndex >= 0) {
      this.products[existingIndex] = {
        ...this.products[existingIndex],
        ...productData,
      };
    } else {
      productData.id = this.products.length + 1;
      this.products.push(productData);
    }

    this.filteredProducts = [...this.products]; // Update filteredProducts
    this.renderProducts();
    this.renderPagination();
    this.closeModal();
    this.showNotification("Produk berhasil disimpan!", "success");
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
      this.filterProducts();
      this.showNotification("Produk berhasil dihapus!", "success");
    }
  }

  previewImages(e) {
    const files = e.target.files;
    const preview = document.getElementById("imagesPreview");

    preview.innerHTML = "";
    Array.from(files)
      .slice(0, 5)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style.margin = "5px";
          img.style.borderRadius = "8px";
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
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

// Users Manager
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
    const roles = ["admin", "customer", "moderator"];
    const statuses = ["active", "inactive", "banned"];
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
      "Robert Clark",
      "Megan White",
    ];

    return names.map((name, index) => ({
      id: index + 1,
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1] || "",
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: `+62${Math.floor(800000000 + Math.random() * 99999999)}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      address: `${Math.floor(Math.random() * 100)} Jalan Example, Jakarta`,
      avatar: `/placeholder.svg?height=40&width=40&text=${name[0]}`,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
    }));
  }

  setupEventListeners() {
    const searchInput = document.getElementById("userSearch");
    searchInput?.addEventListener("input", () => this.filterUsers());

    const roleFilter = document.getElementById("roleFilter");
    const statusFilter = document.getElementById("statusFilterUsers");

    roleFilter?.addEventListener("change", () => this.filterUsers());
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

    const avatarInput = document.getElementById("userAvatar");
    avatarInput?.addEventListener("change", (e) => this.previewAvatar(e));

    const selectAll = document.getElementById("selectAll");
    selectAll?.addEventListener("change", (e) => this.toggleSelectAll(e.target.checked));
  }

  filterUsers() {
    const searchTerm = document.getElementById("userSearch")?.value.toLowerCase() || "";
    const roleFilter = document.getElementById("roleFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilterUsers")?.value || "";

    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch = user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    this.currentPage = 1;
    this.renderUsers();
    this.renderPagination();
  }

  renderUsers() {
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

    tbody.innerHTML = usersToShow
      .map((user) => `
                <tr>
                    <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
                    <td><img src="${user.avatar}" alt="${user.firstName}" class="avatar-img" onerror="this.src='/placeholder.png';"></td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                    <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                    <td>${user.joinDate}</td>
                    <td>${user.lastLogin}</td>
                    <td>
                        <button class="action-btn" onclick="usersManager.editUser(${user.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="usersManager.deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `)
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

  toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll(".user-checkbox");
    checkboxes.forEach((checkbox) => (checkbox.checked = checked));
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
      form?.reset();
      document.getElementById("avatarPreview").innerHTML = `
                <i class="fas fa-user"></i>
            `;
    }

    modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("userModal");
    modal.classList.remove("active");
  }

  populateForm(user) {
    document.getElementById("userFirstName").value = user.firstName;
    document.getElementById("userLastName").value = user.lastName;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userPhone").value = user.phone;
    document.getElementById("userRole").value = user.role;
    document.getElementById("userAddress").value = user.address;
    document.getElementById("userStatus").value = user.status;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      address: formData.get("address"),
      status: formData.get("status"),
      avatar: "/placeholder.svg?height=100&width=40&text=New+Avatar",
      joinDate: new Date().toLocaleDateString(),
      lastLogin: new Date().toLocaleString(),
    };

    const existingIndex = this.users.findIndex((u) => u.id === this.editingId);
    if (existingIndex >= 0) {
      this.users[existingIndex] = {
        ...this.users[existingIndex],
        ...userData,
      };
    } else {
      userData.id = this.users.length + 1;
      this.users.push(userData);
    }

    this.filterUsers();
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

  previewAvatar(e) {
    const file = e.target.files[0];
    const preview = document.getElementById("avatarPreview");

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
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

// Transactions Manager
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
    const statuses = ["pending", "processing", "completed", "cancelled", "refunded"];
    const payments = ["credit-card", "bank-transfer", "e-wallet", "cod"];
    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
    ];
    const products = [
      "Gaming Mouse RGB Pro",
      "Mechanical Keyboard",
      "Gaming Headset",
      "Graphics Card RTX 4080",
      'Gaming Monitor 27"',
    ];

    const transactions = [];
    for (let i = 0; i < 50; i++) {
      const orderId = `TXN-${String(i + 1).padStart(4, "0")}`;
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const total = Math.floor(Math.random() * 5000000) + 100000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const payment = payments[Math.floor(Math.random() * payments.length)];
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      transactions.push({
        id: i + 1,
        orderId,
        customer,
        product,
        total,
        payment,
        status,
        date: date.toLocaleDateString(),
        dateRaw: date,
      });
    }

    return transactions;
  }

  setupEventListeners() {
    const searchInput = document.getElementById("transactionSearch");
    searchInput?.addEventListener("input", () => this.filterTransactions());

    const statusFilter = document.getElementById("transactionStatus");
    const paymentFilter = document.getElementById("paymentFilter");
    const dateFilter = document.getElementById("transactionDate");

    statusFilter?.addEventListener("change", () => this.filterTransactions());
    paymentFilter?.addEventListener("change", () => this.filterTransactions());
    dateFilter?.addEventListener("change", () => this.filterTransactions());

    const detailModal = document.getElementById("transactionModal");
    const detailCloseBtn = document.getElementById("closeModalTransactions");
    const detailCancelBtn = document.getElementById("cancelBtnTransactions");

    detailCloseBtn?.addEventListener("click", () => this.closeDetailModal());
    detailCancelBtn?.addEventListener("click", () => this.closeDetailModal());

    const statusModal = document.getElementById("statusModal");
    const statusCloseBtn = document.getElementById("closeStatusModal");
    const statusCancelBtn = document.getElementById("cancelStatusBtn");
    const statusForm = document.getElementById("statusForm");

    statusCloseBtn?.addEventListener("click", () => this.closeStatusModal());
    statusCancelBtn?.addEventListener("click", () => this.closeStatusModal());
    statusForm?.addEventListener("submit", (e) => this.handleStatusUpdate(e));

    const updateStatusBtn = document.getElementById("updateStatusBtn");
    updateStatusBtn?.addEventListener("click", () => this.openStatusModal());

    const printInvoiceBtn = document.getElementById("printInvoiceBtn");
    printInvoiceBtn?.addEventListener("click", () => this.printInvoice());
  }

  filterTransactions() {
    const searchTerm = document.getElementById("transactionSearch")?.value.toLowerCase() || "";
    const statusFilter = document.getElementById("transactionStatus")?.value || "";
    const paymentFilter = document.getElementById("paymentFilter")?.value || "";
    const dateFilter = document.getElementById("transactionDate")?.value || "";

    this.filteredTransactions = this.transactions.filter((transaction) => {
      const matchesSearch = transaction.orderId.toLowerCase().includes(searchTerm) ||
        transaction.customer.toLowerCase().includes(searchTerm) ||
        transaction.product.toLowerCase().includes(searchTerm);
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesPayment = !paymentFilter || transaction.payment === paymentFilter;
      const matchesDate = !dateFilter || transaction.dateRaw.toISOString().split("T")[0] === dateFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    this.currentPage = 1;
    this.renderTransactions();
    this.renderPagination();
  }

  renderTransactions() {
    const tbody = document.getElementById("transactionsTableBody");
    if (!tbody) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const transactionsToShow = this.filteredTransactions.slice(startIndex, endIndex);

    tbody.innerHTML = transactionsToShow
      .map((transaction) => `
                <tr>
                    <td>${transaction.orderId}</td>
                    <td>${transaction.customer}</td>
                    <td>${transaction.product}</td>
                    <td>Rp${transaction.total.toLocaleString()}</td>
                    <td>${transaction.payment}</td>
                    <td><span class="status-badge status-${transaction.status}">${transaction.status}</span></td>
                    <td>${transaction.date}</td>
                    <td>
                        <button class="action-btn" onclick="transactionsManager.viewDetails(${transaction.id})"><i class="fas fa-eye"></i></button>
                    </td>
                </tr>
            `)
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
      this.currentTransactionId = id;
      const detailContainer = document.getElementById("transactionDetail");
      detailContainer.innerHTML = `
                <div class="transaction-detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${transaction.orderId}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${transaction.customer}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Product:</span>
                    <span class="detail-value">${transaction.product}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">Rp${transaction.total.toLocaleString()}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${transaction.payment}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value status-${transaction.status}">${transaction.status}</span>
                </div>
                <div class="transaction-detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${transaction.date}</span>
                </div>
            `;
      const modal = document.getElementById("transactionModal");
      modal.classList.add("active");
    }
  }

  closeDetailModal() {
    const modal = document.getElementById("transactionModal");
    modal.classList.remove("active");
  }

  openStatusModal() {
    const modal = document.getElementById("statusModal");
    modal.classList.add("active");
  }

  closeStatusModal() {
    const modal = document.getElementById("statusModal");
    modal.classList.remove("active");
  }

  handleStatusUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newStatus = formData.get("status");
    const note = formData.get("note");

    const transactionIndex = this.transactions.findIndex((t) => t.id === this.currentTransactionId);
    if (transactionIndex >= 0) {
      this.transactions[transactionIndex].status = newStatus;
      this.filterTransactions();
      this.closeStatusModal();
      this.closeDetailModal();
      this.showNotification(`Status transaksi diperbarui menjadi ${newStatus}!`, "success");
    }
  }

  printInvoice() {
    const transaction = this.transactions.find((t) => t.id === this.currentTransactionId);
    if (transaction) {
      const invoiceWindow = window.open("", "_blank");
      invoiceWindow.document.write(`
                <html>
                    <head>
                        <title>Invoice ${transaction.orderId}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .invoice { max-width: 600px; margin: auto; }
                            .invoice-header { text-align: center; }
                            .invoice-details { margin: 20px 0; }
                            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                            .detail-label { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="invoice">
                            <div class="invoice-header">
                                <h1>Invoice</h1>
                                <p>GamerTech</p>
                            </div>
                            <div class="invoice-details">
                                <div class="detail-row">
                                    <span class="detail-label">Order ID:</span>
                                    <span>${transaction.orderId}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Customer:</span>
                                    <span>${transaction.customer}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Product:</span>
                                    <span>${transaction.product}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Total:</span>
                                    <span>Rp${transaction.total.toLocaleString()}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Payment Method:</span>
                                    <span>${transaction.payment}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Status:</span>
                                    <span>${transaction.status}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date:</span>
                                    <span>${transaction.date}</span>
                                </div>
                            </div>
                        </div>
                        <script>
                            window.print();
                            window.onafterprint = () => window.close();
                        </script>
                    </body>
                </html>
            `);
      invoiceWindow.document.close();
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

// Initialize Dashboard
// Initialize Dashboard
const dashboard = new AdminDashboard();

// Expose managers to global scope for onclick events
window.articlesManager = dashboard.sectionManagers.articles || new ArticlesManager();
window.productsManager = dashboard.sectionManagers.products || new ProductsManager();
window.usersManager = dashboard.sectionManagers.users || new UsersManager();
window.transactionsManager = dashboard.sectionManagers.transactions || new TransactionsManager();

// Ensure managers are updated when sections are initialized
dashboard.initializeSection = function (section) {
  if (!this.sectionManagers[section]) {
    switch (section) {
      case "articles":
        this.sectionManagers.articles = new ArticlesManager();
        window.articlesManager = this.sectionManagers.articles;
        break;
      case "products":
        this.sectionManagers.products = new ProductsManager();
        window.productsManager = this.sectionManagers.products;
        break;
      case "users":
        this.sectionManagers.users = new UsersManager();
        window.usersManager = this.sectionManagers.users;
        break;
      case "transactions":
        this.sectionManagers.transactions = new TransactionsManager();
        window.transactionsManager = this.sectionManagers.transactions;
        break;
      default:
        console.log(`No manager for section: ${section}`);
    }
  }
};