function renderCharts() {
    fetch("http://api-corso-fleuri.local/stats/user", {
        method: "GET",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then(response => response.json())
    .then(results => {
        const data = JSON.parse(results.body);

        const fastestCashiersCtx = document
            .getElementById("fastestCashiersChart")
            .getContext("2d");

        new Chart(fastestCashiersCtx, {
            type: "bar",
            data: {
                labels: data.map(cashier => cashier.user_id),
                datasets: [
                    {
                        label: "Transactions",
                        data: data.map(cashier => cashier.occurrence_count),
                        backgroundColor: "rgba(153, 102, 255, 0.2)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error("Erreur lors du fetch :", error);
    });

    fetch("http://api-corso-fleuri.local/stats/menu", {
        method: "GET",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then(response => response.json())
    .then(results => {
        const data = JSON.parse(results.body);

        const labelPromises = data.map(product => 
            fetch(`http://api-corso-fleuri.local/menus/${product.menu_id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            .then(response => response.json())
            .then(result => {
                const menu = JSON.parse(result.body);
                return menu.menu_name;
            })
            .catch(error => {
                console.error("Erreur lors de la récupération d’un menu :", error);
                return "Inconnu";
            })
        );

        Promise.all(labelPromises).then(labels => {
            const mostSoldProductsCtx = document
                .getElementById("mostSoldProductsChart")
                .getContext("2d");

            new Chart(mostSoldProductsCtx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Ventes",
                        data: data.map(product => product.occurrence_count),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
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
        });

    })
    .catch(error => {
        console.error("Erreur lors du fetch :", error);
    });

}

function generateCSV() {

    fetch("http://api-corso-fleuri.local/getAllCommand", {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(response => response.json())
    .then(results => {
        const data = JSON.parse(results.body);
        console.log(data);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent +=
            "N° de Vente;Date de validation;Mode de paiement;Utilisateur;ID-Produit;Nom;Quantité;Prix de vente;Prix d'achat HT;Remise;Invitations\n";

        if (data && data.length > 0) {
            data.forEach(command => {
                console.log(command.date);
                csvContent += `${command.command_id};${command.date};${command.modePaiement};${command.user_id};${command.menu_id};${command.menu_name};${command.quantite};${command.menu_price};${command.prixAchatHT};${command.remise};${command.invitations}\n`;
            });
        } else {
            console.error("Aucun enregistrement de vente à exporter.");
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ventes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("CSV généré et téléchargement déclenché.");
    })
    .catch(error => console.error("Erreur:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    renderCharts();

    const exportBtn = document.getElementById("exportCsvBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            generateCSV();
        });
    }
});
