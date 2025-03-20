class Log {
    constructor() {
        this.fetchStats();
    }

    fetchStats() {
        fetch('http://api-corso-fleuri.local/log')
            .then(response => response.json())
            .then(data => {
                this.populateStats(data);
            })
            .catch(error => console.error('Error fetching stats data:', error));
    }

    populateStats(data) {
        const mostSoldProducts = document.querySelector('.stat ul');
        const fastestCashiers = document.querySelectorAll('.stat ul')[1];

        data.mostSoldProducts.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - ${product.sales} ventes`;
            mostSoldProducts.appendChild(listItem);
        });

        data.fastestCashiers.forEach(cashier => {
            const listItem = document.createElement('li');
            listItem.textContent = `${cashier.name} - ${cashier.transactionsPerHour} transactions/hr`;
            fastestCashiers.appendChild(listItem);
        });
    }

    static initialize() {
        new Log();
    }
}

document.addEventListener('DOMContentLoaded', () => Log.initialize());