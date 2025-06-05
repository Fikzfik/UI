// data.js
const Data = {
    generateProducts() {
        const categories = ["gaming-peripherals", "pc-components", "gaming-furniture", "accessories", "monitors", "audio"];
        const statuses = ["active", "inactive", "discontinued"];
        const products = [
            { id: 1, name: "Gaming Mouse RGB Pro", brand: "Logitech", price: 89.99, priceIDR: 1350000 },
            { id: 2, name: "Mechanical Keyboard Cherry MX", brand: "Corsair", price: 149.99, priceIDR: 2250000 },
            { id: 3, name: "Gaming Headset 7.1 Surround", brand: "SteelSeries", price: 199.99, priceIDR: 3000000 },
            { id: 4, name: "Graphics Card RTX 4080", brand: "ASUS", price: 1199.99, priceIDR: 18000000 },
            { id: 5, name: 'Gaming Monitor 27" 144Hz', brand: "ASUS", price: 329.99, priceIDR: 4950000 },
            { id: 6, name: "Gaming Chair Ergonomic", brand: "Corsair", price: 299.99, priceIDR: 4500000 },
            { id: 7, name: "SSD 1TB NVMe", brand: "SpeedDrive", price: 99.99, priceIDR: 1500000 },
            { id: 8, name: "RAM 32GB DDR5", brand: "MemoryMax", price: 199.99, priceIDR: 3000000 },
            { id: 9, name: "CPU Cooler RGB", brand: "CoolTech", price: 49.99, priceIDR: 750000 },
            { id: 10, name: "Power Supply 850W", brand: "PowerCore", price: 129.99, priceIDR: 1950000 },
            { id: 11, name: "Wireless Gaming Controller", brand: "Razer", price: 79.99, priceIDR: 1200000 },
            { id: 12, name: "RGB LED Strip Kit", brand: "LightTech", price: 29.99, priceIDR: 450000 },
        ];

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            category: categories[Math.floor(Math.random() * categories.length)],
            brand: product.brand,
            price: product.price, // USD
            priceIDR: product.priceIDR, // IDR
            originalPrice: Math.random() > 0.5 ? product.price * 1.2 : null,
            description: `High-quality ${product.name.toLowerCase()} designed for professional gaming and productivity.`,
            stock: Math.floor(Math.random() * 100) + 10,
            sku: `SKU-${String(product.id).padStart(3, "0")}`,
            weight: (Math.random() * 5 + 0.5).toFixed(1),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            images: [`/placeholder.svg?height=200&width=320&text=${encodeURIComponent(product.name)}`],
            specifications: `Technical specifications for ${product.name} include high-performance features tailored for gaming.`,
            createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            sales: Math.floor(Math.random() * 200) + 20,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviewCount: Math.floor(Math.random() * 300) + 50,
            inStock: Math.random() > 0.2,
            stockCount: Math.random() > 0.2 ? Math.floor(Math.random() * 50) + 5 : 0,
            isNew: Math.random() > 0.7,
            isFeatured: Math.random() > 0.6,
            onSale: Math.random() > 0.5,
        }));
    },

    generateArticles() {
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
            excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            content: "Full article content would be here...",
            image: `/placeholder.svg?height=200&width=320&text=Article+${index + 1}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            author: "Admin User",
            publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            views: Math.floor(Math.random() * 5000) + 100,
            tags: ["gaming", "tech", "review"].slice(0, Math.floor(Math.random() * 3) + 1),
        }));
    },

    generateTransactions() {
        const statuses = ["pending", "processing", "completed", "cancelled", "refunded"];
        const payments = ["credit-card", "bank-transfer", "e-wallet", "cod"];
        const customers = [
            "John Doe",
            "Jane Smith",
            "Mike Johnson",
            "Sarah Wilson",
            "David Brown",
        ];
        const products = this.generateProducts().map(p => p.name);

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
};

// Export for use in other scripts
export default Data;