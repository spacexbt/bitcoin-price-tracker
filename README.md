# Bitcoin Price Tracker

A real-time Bitcoin price tracking application that updates every 2 minutes using the CoinGecko API.

## Features

- Real-time Bitcoin price updates (2-minute intervals)
- Clean and responsive user interface
- Price change indicators
- Historical price tracking
- 24-hour statistics (high, low, change)
- Price alerts system
- Interactive price chart

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for price visualization
- CoinGecko API for price data

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/spacexbt/bitcoin-price-tracker.git
```

2. Open `index.html` in your web browser

## How It Works

The application fetches Bitcoin price data from the CoinGecko API every 2 minutes and updates the display accordingly. Price changes are indicated with color coding (green for increases, red for decreases).

## API Used

This project uses the CoinGecko API for fetching Bitcoin price data:
- Endpoint: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
- No API key required
- Free tier with rate limiting

## Contributing

Feel free to fork this repository and submit pull requests. You can also open issues for bugs or feature requests.

## License

This project is open source and available under the MIT License.
