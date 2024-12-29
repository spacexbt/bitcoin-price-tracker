// Bitcoin Price Tracker

const fetchBitcoinPrice = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd;
        
        // Update the UI
        document.getElementById('price').textContent = `$${price.toLocaleString()}`;
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        document.getElementById('price').textContent = 'Error fetching price';
    }
};

// Fetch initial price
fetchBitcoinPrice();

// Update price every 2 minutes
setInterval(fetchBitcoinPrice, 120000);