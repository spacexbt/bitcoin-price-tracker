class BitcoinPriceTracker {
    constructor() {
        this.priceHistory = [];
        this.maxHistoryPoints = 24;
        this.chart = null;
        this.alertPrice = null;
        this.initializeChart();
        this.loadStoredData();
        this.startTracking();
    }

    loadStoredData() {
        const stored = localStorage.getItem('btcPriceHistory');
        if (stored) {
            this.priceHistory = JSON.parse(stored);
            this.updateChart();
            this.updateStats();
        }
    }

    saveData() {
        localStorage.setItem('btcPriceHistory', JSON.stringify(this.priceHistory));
    }

    initializeChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Bitcoin Price (USD)',
                    data: [],
                    borderColor: '#f7931a',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    async fetchPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await response.json();
            return data.bitcoin.usd;
        } catch (error) {
            console.error('Error fetching Bitcoin price:', error);
            throw error;
        }
    }

    updateChart() {
        const labels = this.priceHistory.map(item => 
            new Date(item.timestamp).toLocaleTimeString()
        );
        const prices = this.priceHistory.map(item => item.price);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = prices;
        this.chart.update();
    }

    updateStats() {
        if (this.priceHistory.length > 0) {
            const prices = this.priceHistory.map(item => item.price);
            const lastPrice = prices[prices.length - 1];
            const prevPrice = prices.length > 1 ? prices[prices.length - 2] : lastPrice;

            // Update price and change
            document.getElementById('price').textContent = `$${lastPrice.toLocaleString()}`;
            
            // Calculate 24h stats
            const highPrice = Math.max(...prices);
            const lowPrice = Math.min(...prices);
            const dayChange = ((lastPrice - prices[0]) / prices[0] * 100).toFixed(2);

            // Update UI
            document.getElementById('high-price').textContent = `$${highPrice.toLocaleString()}`;
            document.getElementById('low-price').textContent = `$${lowPrice.toLocaleString()}`;
            document.getElementById('day-change').textContent = `${dayChange}%`;
            
            // Add color coding
            document.getElementById('day-change').className = dayChange >= 0 ? 'price-up' : 'price-down';
        }
    }

    setAlert() {
        const input = document.getElementById('alertPrice');
        const price = parseFloat(input.value);
        if (!isNaN(price) && price > 0) {
            this.alertPrice = price;
            alert(`Alert set for $${price.toLocaleString()}`);
            input.value = '';
        }
    }

    checkAlert(price) {
        if (this.alertPrice !== null) {
            if ((this.alertPrice > price && this.priceHistory[this.priceHistory.length - 2]?.price < this.alertPrice) ||
                (this.alertPrice < price && this.priceHistory[this.priceHistory.length - 2]?.price > this.alertPrice)) {
                alert(`Bitcoin price has crossed $${this.alertPrice.toLocaleString()}!\nCurrent price: $${price.toLocaleString()}`);
                this.alertPrice = null;
            }
        }
    }

    async startTracking() {
        try {
            const price = await this.fetchPrice();
            
            this.priceHistory.push({
                price,
                timestamp: new Date().toISOString()
            });

            // Keep only last maxHistoryPoints
            if (this.priceHistory.length > this.maxHistoryPoints) {
                this.priceHistory.shift();
            }

            this.updateChart();
            this.updateStats();
            this.saveData();
            this.checkAlert(price);

        } catch (error) {
            document.getElementById('price').textContent = 'Error fetching price';
        }

        // Update every 2 minutes
        setTimeout(() => this.startTracking(), 120000);
    }
}

// Initialize tracker
const tracker = new BitcoinPriceTracker();