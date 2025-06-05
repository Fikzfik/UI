/**
 * Blog Detail Page JavaScript
 * Handles article interactions, comments, related content, and reading progress
 */

// Sample comments data
const SAMPLE_COMMENTS = [
    {
        id: 1,
        author: "Gaming Pro",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        date: "2024-12-16",
        content: "Great article! This really helped me understand what components to prioritize for my new gaming setup. The budget breakdown is especially useful.",
        likes: 12,
        replies: []
    },
    {
        id: 2,
        author: "TechEnthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
        date: "2024-12-16",
        content: "I've been gaming for years and this guide covers everything perfectly. The ergonomics section is often overlooked but so important for long gaming sessions.",
        likes: 8,
        replies: [
            {
                id: 3,
                author: "Alex Johnson",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                date: "2024-12-16",
                content: "Thanks for the feedback! Ergonomics is definitely crucial for maintaining performance and health during extended gaming.",
                likes: 3
            }
        ]
    },
    {
        id: 4,
        author: "BudgetGamer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        date: "2024-12-15",
        content: "The budget setup section is exactly what I needed. Starting with $800 and this guide gives me a clear path forward.",
        likes: 15,
        replies: []
    }
];

// Sample related products
const RELATED_PRODUCTS = [
    {
        id: 1,
        name: "Gaming Mouse Pro X",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"
    },
    {
        id: 2,
        name: "Mechanical Keyboard RGB",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a"
    },
    {
        id: 3,
        name: "Gaming Headset Wireless",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944"
    }
];

// Sample related articles
const RELATED_ARTICLES = [
    {
        id: 2,
        title: "RTX 4090 vs RTX 4080: Which GPU Should You Buy?",
        excerpt: "A comprehensive comparison of NVIDIA's flagship graphics cards.",
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
        category: "reviews",
        date: "2024-12-14",
        readTime: 12
    },
    {
        id: 6,
        title: "Building Your First Gaming PC: Step-by-Step Guide",
        excerpt: "A complete beginner's guide to building a gaming PC.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        category: "guides",
        date: "2024-12-10",
        readTime: 15
    },
    {
        id: 7,
        title: "Gaming Monitor Buying Guide 2024",
        excerpt: "Find the perfect gaming monitor for your setup.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
        category: "hardware",
        date: "2024-12-09",
        readTime: 9
    }
];

// Blog Detail State
const BlogDetailState = {
    currentArticleId: null,
    isLiked: false,
    isBookmarked: false,
    readingProgress: 0,
    comments: [...SAMPLE_COMMENTS],
    tocItems: []
};

// Utility functions
const Utils = {
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Blog Detail Controller
const BlogDetail = {
    // DOM elements
    likeBtn: null,
    bookmarkBtn: null,
    shareBtn: null,
    tocList: null,
    commentsContainer: null,
    commentForm: null,
    relatedProductsContainer: null,
    relatedArticlesContainer: null,

    // Initialize blog detail functionality
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadContent();
        this.initReadingProgress();
        this.generateTableOfContents();
        this.loadComments();
        this.loadRelatedProducts();
        this.loadRelatedArticles();
    },

    // Bind DOM elements
    bindElements() {
        this.likeBtn = document.getElementById('like-btn');
        this.bookmarkBtn = document.getElementById('bookmark-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.tocList = document.getElementById('toc-list');
        this.commentsContainer = document.getElementById('comments-list');
        this.commentForm = document.getElementById('comment-form');
        this.relatedProductsContainer = document.getElementById('related-products');
        this.relatedArticlesContainer = document.getElementById('related-articles');
    },

    // Bind event listeners
    bindEvents() {
        // Article actions
        if (this.likeBtn) {
            this.likeBtn.addEventListener('click', () => this.toggleLike());
        }

        if (this.bookmarkBtn) {
            this.bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        }

        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', () => this.showShareModal());
        }

        // Comment form
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }

        // Social share buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                e.preventDefault();
                const platform = e.target.closest('.share-btn').classList[1];
                this.shareOnPlatform(platform);
            }
        });

        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateReadingProgress();
            this.updateActiveToC();
        }, 100));

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    },

    // Load article content
    loadContent() {
        // Get article ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        BlogDetailState.currentArticleId = urlParams.get('id') || 1;

        // In a real application, you would fetch the article data from an API
        console.log('Loading article:', BlogDetailState.currentArticleId);
    },

    // Initialize reading progress indicator
    initReadingProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        // Add CSS for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--bg-tertiary);
                z-index: 1000;
                opacity: 0;
                transition: opacity var(--transition-normal);
            }
            
            .reading-progress.visible {
                opacity: 1;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--gradient-primary);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(progressBar);

        this.progressBar = progressBar;
        this.progressFill = progressBar.querySelector('.progress-fill');
    },

    // Update reading progress
    updateReadingProgress() {
        const article = document.querySelector('.article-body');
        if (!article || !this.progressBar) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const articleStart = articleTop - windowHeight / 2;
        const articleEnd = articleTop + articleHeight - windowHeight / 2;

        if (scrollTop < articleStart) {
            BlogDetailState.readingProgress = 0;
            this.progressBar.classList.remove('visible');
        } else if (scrollTop > articleEnd) {
            BlogDetailState.readingProgress = 100;
            this.progressBar.classList.add('visible');
        } else {
            BlogDetailState.readingProgress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
            this.progressBar.classList.add('visible');
        }

        if (this.progressFill) {
            this.progressFill.style.width = `${BlogDetailState.readingProgress}%`;
        }
    },

    // Generate table of contents
    generateTableOfContents() {
        if (!this.tocList) return;

        const headings = document.querySelectorAll('.article-body h2, .article-body h3');
        BlogDetailState.tocItems = [];

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const tocItem = {
                id: id,
                text: heading.textContent,
                level: heading.tagName.toLowerCase()
            };
            
            BlogDetailState.tocItems.push(tocItem);
        });

        // Render ToC
        this.renderTableOfContents();
    },

    // Render table of contents
    renderTableOfContents() {
        if (!this.tocList) return;

        this.tocList.innerHTML = BlogDetailState.tocItems.map(item => `
            <li class="toc-item toc-${item.level}">
                <a href="#${item.id}" class="toc-link">${item.text}</a>
            </li>
        `).join('');

        // Bind ToC click events
        this.tocList.addEventListener('click', (e) => {
            if (e.target.classList.contains('toc-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    },

    // Update active ToC item
    updateActiveToC() {
        if (!this.tocList) return;

        const headings = document.querySelectorAll('.article-body h2, .article-body h3');
        let activeHeading = null;

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                activeHeading = heading;
            }
        });

        // Update active state
        this.tocList.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
        });

        if (activeHeading) {
            const activeLink = this.tocList.querySelector(`a[href="#${activeHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    },

    // Toggle like
    toggleLike() {
        BlogDetailState.isLiked = !BlogDetailState.isLiked;
        
        if (this.likeBtn) {
            const icon = this.likeBtn.querySelector('i');
            const count = this.likeBtn.querySelector('span');
            
            if (BlogDetailState.isLiked) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.likeBtn.classList.add('active');
                count.textContent = parseInt(count.textContent) + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.likeBtn.classList.remove('active');
                count.textContent = parseInt(count.textContent) - 1;
            }
        }

        // Show notification
        this.showNotification(
            BlogDetailState.isLiked ? 'Article liked!' : 'Like removed',
            'success'
        );
    },

    // Toggle bookmark
    toggleBookmark() {
        BlogDetailState.isBookmarked = !BlogDetailState.isBookmarked;
        
        if (this.bookmarkBtn) {
            const icon = this.bookmarkBtn.querySelector('i');
            const text = this.bookmarkBtn.querySelector('span');
            
            if (BlogDetailState.isBookmarked) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.bookmarkBtn.classList.add('active');
                text.textContent = 'Saved';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.bookmarkBtn.classList.remove('active');
                text.textContent = 'Save';
            }
        }

        // Show notification
        this.showNotification(
            BlogDetailState.isBookmarked ? 'Article bookmarked!' : 'Bookmark removed',
            'success'
        );
    },

    // Show share modal
    showShareModal() {
        const shareUrl = window.location.href;
        const shareTitle = document.querySelector('.article-title').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                url: shareUrl
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy link', 'error');
            });
        }
    },

    // Share on specific platform
    shareOnPlatform(platform) {
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(document.querySelector('.article-title').textContent);
        const shareText = encodeURIComponent(document.querySelector('.article-excerpt').textContent);
        
        let url = '';
        
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                break;
            case 'reddit':
                url = `https://reddit.com/submit?url=${shareUrl}&title=${shareTitle}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    },

    // Load comments
    loadComments() {
        if (!this.commentsContainer) return;

        this.commentsContainer.innerHTML = BlogDetailState.comments.map(comment => 
            this.createCommentHTML(comment)
        ).join('');

        // Bind comment action events
        this.bindCommentEvents();
    },

    // Create comment HTML
    createCommentHTML(comment, isReply = false) {
        const formattedDate = Utils.formatDate(comment.date);
        const replyClass = isReply ? 'comment-reply' : '';
        
        let repliesHTML = '';
        if (comment.replies && comment.replies.length > 0) {
            repliesHTML = `
                <div class="comment-replies">
                    ${comment.replies.map(reply => this.createCommentHTML(reply, true)).join('')}
                </div>
            `;
        }

        return `
            <div class="comment ${replyClass}" data-id="${comment.id}">
                <div class="comment-header">
                    <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
                    <div class="comment-meta">
                        <h4>${comment.author}</h4>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
                <div class="comment-actions">
                    <button class="comment-action like-comment" data-id="${comment.id}">
                        <i class="far fa-heart"></i>
                        <span>${comment.likes}</span>
                    </button>
                    <button class="comment-action reply-comment" data-id="${comment.id}">
                        <i class="fas fa-reply"></i>
                        <span>Reply</span>
                    </button>
                </div>
                ${repliesHTML}
            </div>
        `;
    },

    // Bind comment events
    bindCommentEvents() {
        // Like comment
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-comment')) {
                const commentId = parseInt(e.target.closest('.like-comment').dataset.id);
                this.likeComment(commentId);
            }
        });

        // Reply to comment
        document.addEventListener('click', (e) => {
            if (e.target.closest('.reply-comment')) {
                const commentId = parseInt(e.target.closest('.reply-comment').dataset.id);
                this.showReplyForm(commentId);
            }
        });
    },

    // Like comment
    likeComment(commentId) {
        const comment = this.findComment(commentId);
        if (comment) {
            comment.likes++;
            this.loadComments(); // Refresh comments display
            this.showNotification('Comment liked!', 'success');
        }
    },

    // Find comment by ID
    findComment(commentId) {
        for (const comment of BlogDetailState.comments) {
            if (comment.id === commentId) {
                return comment;
            }
            if (comment.replies) {
                for (const reply of comment.replies) {
                    if (reply.id === commentId) {
                        return reply;
                    }
                }
            }
        }
        return null;
    },

    // Show reply form
    showReplyForm(commentId) {
        // Remove existing reply forms
        document.querySelectorAll('.reply-form').forEach(form => form.remove());

        const commentElement = document.querySelector(`[data-id="${commentId}"]`);
        if (!commentElement) return;

        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form';
        replyForm.innerHTML = `
            <form class="comment-form">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Your Email" required>
                    </div>
                </div>
                <div class="form-group">
                    <textarea placeholder="Your Reply" rows="3" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-small">Post Reply</button>
                    <button type="button" class="btn btn-outline btn-small cancel-reply">Cancel</button>
                </div>
            </form>
        `;

        commentElement.appendChild(replyForm);

        // Bind reply form events
        replyForm.querySelector('.cancel-reply').addEventListener('click', () => {
            replyForm.remove();
        });

        replyForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReplySubmit(e, commentId);
        });
    },

    // Handle comment form submission
    handleCommentSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const content = formData.get('comment') || e.target.querySelector('textarea').value;

        if (!name || !email || !content) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Create new comment
        const newComment = {
            id: Date.now(),
            author: name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4ff&color=fff`,
            date: new Date().toISOString().split('T')[0],
            content: content,
            likes: 0,
            replies: []
        };

        // Add to comments
        BlogDetailState.comments.unshift(newComment);
        
        // Reload comments
        this.loadComments();
        
        // Reset form
        e.target.reset();
        
        // Show success message
        this.showNotification('Comment posted successfully!', 'success');
    },

    // Handle reply submission
    handleReplySubmit(e, parentCommentId) {
        e.preventDefault();
        
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const content = e.target.querySelector('textarea').value;

        if (!name || !email || !content) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Create new reply
        const newReply = {
            id: Date.now(),
            author: name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d4ff&color=fff`,
            date: new Date().toISOString().split('T')[0],
            content: content,
            likes: 0
        };

        // Find parent comment and add reply
        const parentComment = this.findComment(parentCommentId);
        if (parentComment) {
            if (!parentComment.replies) {
                parentComment.replies = [];
            }
            parentComment.replies.push(newReply);
        }

        // Reload comments
        this.loadComments();
        
        // Remove reply form
        document.querySelector('.reply-form').remove();
        
        // Show success message
        this.showNotification('Reply posted successfully!', 'success');
    },

    // Load related products
    loadRelatedProducts() {
        if (!this.relatedProductsContainer) return;

        this.relatedProductsContainer.innerHTML = RELATED_PRODUCTS.map(product => `
            <div class="product-item" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-price">${Utils.formatPrice(product.price)}</div>
                </div>
            </div>
        `).join('');

        // Bind product click events
        this.relatedProductsContainer.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productId = productItem.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    },

    // Load related articles
    loadRelatedArticles() {
        if (!this.relatedArticlesContainer) return;

        this.relatedArticlesContainer.innerHTML = RELATED_ARTICLES.map(article => `
            <div class="related-article" data-id="${article.id}">
                <div class="related-article-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="related-article-content">
                    <div class="related-article-meta">
                        <span class="category">${this.getCategoryName(article.category)}</span>
                        <span class="date">${Utils.formatDate(article.date)}</span>
                        <span class="read-time">${article.readTime} min read</span>
                    </div>
                    <h3 class="related-article-title">${article.title}</h3>
                    <p class="related-article-excerpt">${article.excerpt}</p>
                </div>
            </div>
        `).join('');

        // Bind article click events
        this.relatedArticlesContainer.addEventListener('click', (e) => {
            const articleElement = e.target.closest('.related-article');
            if (articleElement) {
                const articleId = articleElement.dataset.id;
                window.location.href = `blog-detail.html?id=${articleId}`;
            }
        });
    },

    // Handle newsletter submission
    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            e.target.reset();

            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNotification('Failed to subscribe. Please try again.', 'error');
        }
    },

    // Validate email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Get category name
    getCategoryName(category) {
        const categories = {
            'guides': 'Guides',
            'reviews': 'Reviews',
            'news': 'News',
            'hardware': 'Hardware',
            'esports': 'Esports'
        };
        return categories[category] || category;
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
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
            
            .notification.success {
                border-color: var(--success-color);
            }
            
            .notification.error {
                border-color: var(--error-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .notification-content i:first-child {
                color: var(--primary-color);
            }
            
            .notification.success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .notification.error .notification-content i:first-child {
                color: var(--error-color);
            }
            
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
        
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Bind close event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    BlogDetail.init();
});

// Export for global access
window.BlogDetail = BlogDetail;