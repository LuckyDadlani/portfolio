document.addEventListener('DOMContentLoaded', () => {
    const POLYGON_API_KEY = 'uuoE4dQrhrrV9Ytcs6Jm5x9szbsFBuop';
    const POLYGON_URL = 'https://api.polygon.io/v1/open-close/crypto/';

    async function getClosingPrice(symbol, date) {
        try {
            const response = await fetch(`${POLYGON_URL}${symbol}/${date}?apiKey=${POLYGON_API_KEY}`);
            const data = await response.json();
            const closingPrice = parseFloat(data.close);
            return closingPrice;
        } catch (error) {
            console.error("Error fetching closing price for symbol:", symbol, "on date:", date);
            return null;
        }
    }

    function calculateCAGR(initialValue, finalValue, years) {
        return Math.pow(finalValue / initialValue, 1 / years) - 1;
    }

    const portfolio = {
        stocks: {},

        addStock: function(symbol, quantity, purchaseDate, sector) {
            this.stocks[symbol] = {
                quantity,
                purchaseDate,
                sector
            };
            console.log(`Stock ${symbol} added successfully.`);
        },

        removeStock: function(symbol) {
            if (symbol in this.stocks) {
                delete this.stocks[symbol];
                console.log(`Stock ${symbol} removed successfully.`);
            } else {
                console.log(`Stock ${symbol} not found in portfolio.`);
            }
        },

        editStock: function(symbol, quantity, purchaseDate, sector) {
            if (symbol in this.stocks) {
                if (quantity !== undefined) {
                    this.stocks[symbol].quantity = quantity;
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
                    <th>Purchase Date</th>
                    <th>Sector</th>
                    <th>Current Price</th>
                    <th>Current Value</th>
                    <th>CAGR</th>
                </tr>
            `;
            for (const symbol in this.stocks) {
                const details = this.stocks[symbol];
                const currentPrice = await getClosingPrice(symbol, details.purchaseDate);
                if (currentPrice !== null) {
                    const row = document.createElement('tr');
                    const quantity = details.quantity;
                    const purchaseDate = details.purchaseDate;
                    const sector = details.sector;
                    const currentValue = quantity * currentPrice;
                    const purchaseDateObj = new Date(purchaseDate);
                    const years = (new Date() - purchaseDateObj) / (365.25 * 24 * 60 * 60 * 1000);
                    const cagr = years > 0 ? calculateCAGR(currentPrice, currentValue, years) : 0;
                    row.innerHTML = `
                        <td>${symbol}</td>
                        <td>${quantity}</td>
                        <td>${purchaseDate}</td>
                        <td>${sector}</td>
                        <td>${currentPrice.toFixed(2)}</td>
                        <td>${currentValue.toFixed(2)}</td>
                        <td>${(cagr * 100).toFixed(2)}%</td>
                    `;
                    table.appendChild(row);
                }
            }
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(table);
        },

        futureProjection: async function(expectedRateOfReturn) {
            const projectionTable = document.createElement('table');
            projectionTable.innerHTML = `
                <tr>
                    <th>Symbol</th>
                    <th>Current Value</th>
                    <th>Projected Value</th>
                </tr>
            `;
            for (const symbol in this.stocks) {
                const details = this.stocks[symbol];
                const currentPrice = await getClosingPrice(symbol, details.purchaseDate);
                if (currentPrice !== null) {
                    const quantity = details.quantity;
                    const currentValue = quantity * currentPrice;
                    const projectedValue = currentValue * (1 + expectedRateOfReturn);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${symbol}</td>
                        <td>${currentValue.toFixed(2)}</td>
                        <td>${projectedValue.toFixed(2)}</td>
                    `;
                    projectionTable.appendChild(row);
                }
            }
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(projectionTable);
        },

        savePortfolio: function() {
            const jsonPortfolio = JSON.stringify(this.stocks);
            localStorage.setItem('portfolio', jsonPortfolio);
            console.log("Portfolio saved successfully.");
        },

        loadPortfolio: function() {
            const jsonPortfolio = localStorage.getItem('portfolio');
            if (jsonPortfolio !== null) {
                this.stocks = JSON.parse(jsonPortfolio);
                console.log("Portfolio loaded successfully.");
            } else {
                console.log("No portfolio found.");
            }
        }
    };

    // Button event listeners
    document.getElementById('addStockBtn').addEventListener('click', () => {
        const symbol = prompt("Enter symbol:");
        const quantity = parseInt(prompt("Enter quantity:") || 0);
        const purchaseDate = prompt("Enter purchase date (YYYY-MM-DD):") || "";
        const sector = prompt("Enter sector:") || "";
        portfolio.addStock(symbol, quantity, purchaseDate, sector);
    });

    document.getElementById('removeStockBtn').addEventListener('click', () => {
        const symbol = prompt("Enter symbol to remove:");
        portfolio.removeStock(symbol);
    });

    document.getElementById('editStockBtn').addEventListener('click', () => {
        const symbol = prompt("Enter symbol to edit:");
        const quantity = parseInt(prompt("Enter new quantity (leave blank to keep current):") || undefined);
        const purchaseDate = prompt("Enter new purchase date (YYYY-MM-DD) (leave blank to keep current):") || undefined;
        const sector = prompt("Enter new sector (leave blank to keep current):") || undefined;
        portfolio.editStock(symbol, quantity, purchaseDate, sector);
    });

    document.getElementById('displayPortfolioBtn').addEventListener('click', () => {
        portfolio.displayPortfolio();
    });
});
