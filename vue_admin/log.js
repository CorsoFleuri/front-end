class Log {
    constructor() {
        this.run();
    }

    async run() {
        const data = this.getMockData();
        console.log('Mock data:', data);
        this.renderCharts(data);
    }

    getMockData() {
        return {
            mostSoldProducts: [
                { name: 'Produit A', sales: 150 },
                { name: 'Produit B', sales: 120 },
                { name: 'Produit C', sales: 100 },
                { name: 'Produit D', sales: 80 },
                { name: 'Produit E', sales: 60 }
            ],
            fastestCashiers: [
                { name: 'Caisse 1', transactions: 50 },
                { name: 'Caisse 2', transactions: 45 },
                { name: 'Caisse 3', transactions: 40 },
                { name: 'Caisse 4', transactions: 35 },
                { name: 'Caisse 5', transactions: 30 }
            ]
        };
    }

    renderCharts(data) {
        console.log('Rendering charts with data:', data);

        const mostSoldProductsCtx = document.getElementById('mostSoldProductsChart').getContext('2d');
        new Chart(mostSoldProductsCtx, {
            type: 'bar',
            data: {
                labels: data.mostSoldProducts.map(product => product.name),
                datasets: [{
                    label: 'Ventes',
                    data: data.mostSoldProducts.map(product => product.sales),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        console.log('Most sold products chart rendered.');

        const fastestCashiersCtx = document.getElementById('fastestCashiersChart').getContext('2d');
        new Chart(fastestCashiersCtx, {
            type: 'bar',
            data: {
                labels: data.fastestCashiers.map(cashier => cashier.name),
                datasets: [{
                    label: 'Transactions',
                    data: data.fastestCashiers.map(cashier => cashier.transactions),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        console.log('Fastest cashiers chart rendered.');
    }

    static initialize() {
        new Log();
    }
}

document.addEventListener('DOMContentLoaded', () => Log.initialize());