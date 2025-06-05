/**
 * Blog Page JavaScript
 * Handles article loading, filtering, searching, and interactions
 */

// Sample blog articles data
const BLOG_ARTICLES = [
    {
        id: 1,
        title: "The Ultimate Gaming Setup Guide for 2024",
        excerpt: "Discover the best gaming peripherals, components, and accessories to build your dream gaming setup. From budget-friendly options to premium gear.",
        content: "Full article content here...",
        category: "guides",
        author: {
            name: "Alex Johnson",
            title: "Senior Gaming Editor",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        publishDate: "2024-12-15",
        readTime: 8,
        views: 1250,
        likes: 89,
        featured: true,
        tags: ["gaming", "setup", "peripherals", "guide"]
    },
    {
        id: 2,
        title: "RTX 4090 vs RTX 4080: Which GPU Should You Buy?",
        excerpt: "A comprehensive comparison of NVIDIA's flagship graphics cards. We break down performance, price, and value to help you make the right choice.",
        content: "Full article content here...",
        category: "reviews",
        author: {
            name: "Sarah Chen",
            title: "Hardware Specialist",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
        },
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        publishDate: "2024-12-14",
        readTime: 12,
        views: 2100,
        likes: 156,
        featured: false,
        tags: ["gpu", "nvidia", "review", "comparison"]
    },
    {
        id: 3,
        title: "Top 10 Indie Games You Must Play This Month",
        excerpt: "Discover hidden gems in the indie gaming world. From atmospheric adventures to challenging puzzlers, these games deserve your attention.",
        content: "Full article content here...",
        category: "reviews",
        author: {
            name: "Mike Rodriguez",
            title: "Game Reviewer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        },
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8",
        publishDate: "2024-12-13",
        readTime: 6,
        views: 890,
        likes: 67,
        featured: false,
        tags: ["indie", "games", "review", "recommendations"]
    },
    {
        id: 4,
        title: "Mechanical Keyboards: A Beginner's Guide",
        excerpt: "Everything you need to know about mechanical keyboards. Switch types, layouts, and recommendations for every budget and use case.",
        content: "Full article content here...",
        category: "guides",
        author: {
            name: "Emma Wilson",
            title: "Peripheral Expert",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
        },
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
        publishDate: "2024-12-12",
        readTime: 10,
        views: 1560,
        likes: 123,
        featured: false,
        tags: ["keyboard", "mechanical", "guide", "peripherals"]
    },
    {
        id: 5,
        title: "Esports Tournament Highlights: World Championship 2024",
        excerpt: "Recap of the most exciting moments from this year's world championship. Incredible plays, upsets, and the crowning of new champions.",
        content: "Full article content here...",
        category: "esports",
        author: {
            name: "David Kim",
            title: "Esports Analyst",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
        },
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        publishDate: "2024-12-11",
        readTime: 7,
        views: 3200,
        likes: 245,
        featured: false,
        tags: ["esports", "tournament", "championship", "highlights"]
    },
    {
        id: 6,
        title: "Building Your First Gaming PC: Step-by-Step Guide",
        excerpt: "A complete beginner's guide to building a gaming PC. From choosing components to assembly tips, we'll walk you through every step.",
        content: "Full article content here...",
        category: "guides",
        author: {
            name: "Alex Johnson",
            title: "Senior Gaming Editor",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        publishDate: "2024-12-10",
        readTime: 15,
        views: 2800,
        likes: 198,
        featured: false,
        tags: ["pc", "build", "guide", "components"]
    },
    {
        id: 7,
        title: "Gaming Monitor Buying Guide 2024",
        excerpt: "Find the perfect gaming monitor for your setup. We cover refresh rates, resolution, panel types, and the best monitors for every budget.",
        content: "Full article content here...",
        category: "hardware",
        author: {
            name: "Sarah Chen",
            title: "Hardware Specialist",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
        },
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
        publishDate: "2024-12-09",
        readTime: 9,
        views: 1890,
        likes: 134,
        featured: false,
        tags: ["monitor", "display", "guide", "hardware"]
    },
    {
        id: 8,
        title: "The Rise of Cloud Gaming: Is It the Future?",
        excerpt: "Exploring the current state and future potential of cloud gaming. We examine the technology, benefits, and challenges facing this emerging platform.",
        content: "Full article content here...",
        category: "news",
        author: {
            name: "Mike Rodriguez",
            title: "Game Reviewer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        },
        image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1",
        publishDate: "2024-12-08",
        readTime: 11,
        views: 2150,
        likes: 167,
        featured: false,
        tags: ["cloud", "gaming", "technology", "future"]
    }
];

// Blog page state
const BlogState = {
    articles: [...BLOG_ARTICLES],
    filteredArticles: [...BLOG_ARTICLES],
    currentCategory: 'all',
    currentSort: 'newest',
    currentView: 'grid',
    searchQuery: '',
    articlesPerPage: 6,
    currentPage: 1,
    isLoading: false
};

// Utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
};

// Blog controller
const Blog = {
    // DOM elements
    articlesGrid: null,
    filterTabs: null,
    sortSelect: null,
    searchInput: null,
    viewButtons: null,
    loadMoreBtn: null,

    // Initialize blog functionality
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadArticles();
        this.updateView();
    },

    // Bind DOM elements
    bindElements() {
        this.articlesGrid = document.getElementById('articles-grid');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.sortSelect = document.getElementById('sort-select');
        this.searchInput = document.getElementById('article-search');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.loadMoreBtn = document.getElementById('load-more-btn');
    },

    // Bind event listeners
    bindEvents() {
        // Filter tabs
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Sort select
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', (e) => {
                this.sortArticles(e.target.value);
            });
        }

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchArticles(e.target.value);
            }, 300));
        }

        // View toggle buttons
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.changeView(view);
            });
        });

        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Article card clicks
        document.addEventListener('click', (e) => {
            const articleCard = e.target.closest('.article-card');
            if (articleCard && !e.target.closest('button')) {
                const articleId = articleCard.dataset.id;
                window.location.href = `blog-detail.html?id=${articleId}`;
            }
        });
    },

    // Filter articles by category
    filterByCategory(category) {
        BlogState.currentCategory = category;
        BlogState.currentPage = 1;

        // Update active tab
        this.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        this.applyFilters();
    },

    // Sort articles
    sortArticles(sortType) {
        BlogState.currentSort = sortType;
        BlogState.currentPage = 1;
        this.applyFilters();
    },

    // Search articles
    searchArticles(query) {
        BlogState.searchQuery = query.toLowerCase();
        BlogState.currentPage = 1;
        this.applyFilters();
    },

    // Change view (grid/list)
    changeView(view) {
        BlogState.currentView = view;

        // Update active button
        this.viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        this.updateView();
    },

    // Apply all filters and sorting
    applyFilters() {
        let filtered = [...BlogState.articles];

        // Apply category filter
        if (BlogState.currentCategory !== 'all') {
            filtered = filtered.filter(article => 
                article.category === BlogState.currentCategory
            );
        }

        // Apply search filter
        if (BlogState.searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(BlogState.searchQuery) ||
                article.excerpt.toLowerCase().includes(BlogState.searchQuery) ||
                article.tags.some(tag => tag.toLowerCase().includes(BlogState.searchQuery))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (BlogState.currentSort) {
                case 'newest':
                    return new Date(b.publishDate) - new Date(a.publishDate);
                case 'oldest':
                    return new Date(a.publishDate) - new Date(b.publishDate);
                case 'popular':
                    return b.views - a.views;
                case 'trending':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });

        BlogState.filteredArticles = filtered;
        this.loadArticles();
    },

    // Load and display articles
    loadArticles() {
        if (!this.articlesGrid) return;

        const startIndex = 0;
        const endIndex = BlogState.currentPage * BlogState.articlesPerPage;
        const articlesToShow = BlogState.filteredArticles.slice(startIndex, endIndex);

        if (BlogState.currentPage === 1) {
            this.articlesGrid.innerHTML = '';
        }

        // Show loading skeleton if needed
        if (BlogState.isLoading) {
            this.showLoadingSkeleton();
            return;
        }

        // Render articles
        articlesToShow.forEach((article, index) => {
            const articleElement = this.createArticleCard(article);
            this.articlesGrid.appendChild(articleElement);

            // Animate article cards
            setTimeout(() => {
                articleElement.classList.add('fade-in');
            }, index * 100);
        });

        // Update load more button
        this.updateLoadMoreButton();

        // Show no results message if needed
        if (articlesToShow.length === 0 && BlogState.currentPage === 1) {
            this.showNoResults();
        }
    },

    // Create article card HTML
    createArticleCard(article) {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-card';
        articleElement.dataset.id = article.id;

        const formattedDate = this.formatDate(article.publishDate);
        const categoryName = this.getCategoryName(article.category);

        articleElement.innerHTML = `
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
                <div class="article-category">${categoryName}</div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="date">${formattedDate}</span>
                    <span class="read-time">${article.readTime} min read</span>
                    <span class="views">${this.formatNumber(article.views)} views</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-footer">
                    <div class="article-author">
                        <img src="${article.author.avatar}" alt="${article.author.name}">
                        <span class="author-name">${article.author.name}</span>
                    </div>
                    <a href="blog-detail.html?id=${article.id}" class="read-more">
                        <span>Read More</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        return articleElement;
    },

    // Update view (grid/list)
    updateView() {
        if (this.articlesGrid) {
            this.articlesGrid.classList.toggle('list-view', BlogState.currentView === 'list');
        }
    },

    // Load more articles
    loadMoreArticles() {
        BlogState.currentPage++;
        BlogState.isLoading = true;
        
        // Show loading state
        this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.loadMoreBtn.disabled = true;

        // Simulate loading delay
        setTimeout(() => {
            BlogState.isLoading = false;
            this.loadArticles();
        }, 1000);
    },

    // Update load more button visibility
    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;

        const totalArticles = BlogState.filteredArticles.length;
        const loadedArticles = BlogState.currentPage * BlogState.articlesPerPage;
        const hasMore = loadedArticles < totalArticles;

        this.loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
        this.loadMoreBtn.innerHTML = '<span>Load More Articles</span><i class="fas fa-chevron-down"></i>';
        this.loadMoreBtn.disabled = false;
    },

    // Show loading skeleton
    showLoadingSkeleton() {
        const skeletonCount = 3;
        
        for (let i = 0; i < skeletonCount; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'article-skeleton';
            skeleton.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line short"></div>
                </div>
            `;
            this.articlesGrid.appendChild(skeleton);
        }
    },

    // Show no results message
    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No Articles Found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="btn btn-primary" onclick="Blog.clearFilters()">
                    <span>Clear Filters</span>
                </button>
            </div>
        `;
        this.articlesGrid.appendChild(noResults);
    },

    // Clear all filters
    clearFilters() {
        BlogState.currentCategory = 'all';
        BlogState.searchQuery = '';
        BlogState.currentPage = 1;

        // Reset UI
        this.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === 'all');
        });

        if (this.searchInput) {
            this.searchInput.value = '';
        }

        if (this.sortSelect) {
            this.sortSelect.value = 'newest';
        }

        this.applyFilters();
    },

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    getCategoryName(category) {
        const categories = {
            'guides': 'Guides',
            'reviews': 'Reviews',
            'news': 'News',
            'hardware': 'Hardware',
            'esports': 'Esports'
        };
        return categories[category] || category;
    }
};

// Newsletter functionality for blog page
const BlogNewsletter = {
    form: null,

    init() {
        this.form = document.getElementById('newsletter-form');
        this.bindEvents();
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.form.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            this.showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
            this.form.reset();

            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showMessage('Something went wrong. Please try again.', 'error');
        }
    },

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `newsletter-message ${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Insert after form
        this.form.parentNode.insertBefore(messageElement, this.form.nextSibling);

        // Animate in
        setTimeout(() => messageElement.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Blog.init();
    BlogNewsletter.init();
});

// Export for global access
window.Blog = Blog;