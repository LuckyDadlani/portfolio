document.addEventListener('DOMContentLoaded', () => {
    const ALPHA_VANTAGE_API_KEY = 'PI3CT37V5KD1D5E2';
    const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

    async function getRealTimePrice(symbol) {
        try {
            const response = await fetch(`${ALPHA_VANTAGE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const data = await response.json();
            const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
            const currentPrice = parseFloat(data['Time Series (5min)'][lastRefreshed]['1. open']);
            return currentPrice;
        } catch (error) {
            console.error("Error fetching data for symbol:", symbol);
            return null;
        }
    }

    function calculateCAGR(initialValue, finalValue, years) {
        return Math.pow(finalValue / initialValue, 1 / years) - 1;
    }

    const portfolio = {
        stocks: {},

        addStock: function(symbol, quantity, purchasePrice, purchaseDate, sector) {
            this.stocks[symbol] = {
                quantity,
                purchasePrice,
                purchaseDate,
                sector
            };
        },

        removeStock: function(symbol) {
            if (symbol in this.stocks) {
                delete this.stocks[symbol];
                console.log(`Stock ${symbol} removed successfully.`);
            } else {
                console.log(`Stock ${symbol} not found in portfolio.`);
            }
        },

        editStock: function(symbol, quantity, purchasePrice, purchaseDate, sector) {
            if (symbol in this.stocks) {
                if (quantity !== undefined) {
                    this.stocks[symbol].quantity = quantity;
                }
                if (purchasePrice !== undefined) {
                    this.stocks[symbol].purchasePrice = purchasePrice;
                }
                if (purchaseDate !== undefined) {
                    this.stocks[symbol].purchaseDate = purchaseDate;
                }
                if (sector !== undefined) {
                    this.stocks[symbol].sector = sector;
                }
                console.log(`Stock ${symbol} edited successfully.`);
            } else {
                console.log(`Stock ${symbol} not found in portfolio.`);
            }
        },

        displayPortfolio: async function() {
            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Purchase Price</th>
                    <th>Purchase Date</th>
                    <th>Sector</th>
                    <th>Current Price</th>
                    <th>Current Value</th>
                    <th>CAGR</th>
                </tr>
            `;
            for (const symbol in this.stocks) {
                const details = this.stocks[symbol];
                const currentPrice = await getRealTimePrice(symbol);
                if (currentPrice !== null) {
                    const row = document.createElement('tr');
                    const quantity = details.quantity;
                    const purchasePrice = details.purchasePrice;
                    const purchaseDate = details.purchaseDate;
                    const sector = details.sector;
                    const currentValue = quantity * currentPrice;
                    const purchaseDateObj = new Date(purchaseDate);
                    const years = (new Date() - purchaseDateObj) / (365.25 * 24 * 60 * 60 * 1000);
                    const cagr = years > 0 ? calculateCAGR(purchasePrice, currentPrice, years) : 0;
                    row.innerHTML = `
                        <td>${symbol}</td>
                        <td>${quantity}</td>
                        <td>${purchasePrice}</td>
                        <td>${purchaseDate}</td>
                        <td>${sector}</td>
                        <td>${currentPrice}</td>
                        <td>${currentValue}</td>
                        <td>${(cagr * 100).toFixed(2)}%</td>
                    `;
                    table.appendChild(row);
                }
            }
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            outputDiv.appendChild(table);
        },

        futureProjection: async function(expectedRateOfReturn) {
            // Implement future projection functionality here
        },

        savePortfolio: function() {
            // Implement save portfolio functionality here
        },

        loadPortfolio: function() {
            // Implement load portfolio functionality here
        }
    };

    document.getElementById('addStockBtn').addEventListener('click', () => {
        // Implement add stock functionality here
    });

    document.getElementById('removeStockBtn').addEventListener('click', () => {
        // Implement remove stock functionality here
    });

    document.getElementById('editStockBtn').addEventListener('click', () => {
        // Implement edit stock functionality here
    });

    document.getElementById('displayPortfolioBtn').addEventListener('click', () => {
        portfolio.displayPortfolio();
    });

    document.getElementById('futureProjectionBtn').addEventListener('click', () => {
        const expectedRateOfReturn = parseFloat(prompt("Enter expected rate of return (as a decimal):"));
        portfolio.futureProjection(expectedRateOfReturn);
    });

    document.getElementById('savePortfolioBtn').addEventListener('click', () => {
        portfolio.savePortfolio();
    });

    document.getElementById('loadPortfolioBtn').addEventListener('click', () => {
        portfolio.loadPortfolio();
    });
});
