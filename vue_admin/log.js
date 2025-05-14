class Log {
  constructor() {
    this.data = this.getMockData();
    console.log("Mock data:", this.data);
    this.renderCharts(this.data);
  }

  getMockData() {
    return {
      mostSoldProducts: [
        { name: "Produit A", sales: 150 },
        { name: "Produit B", sales: 120 },
        { name: "Produit C", sales: 100 },
        { name: "Produit D", sales: 80 },
        { name: "Produit E", sales: 60 }
      ],
      fastestCashiers: [
        { name: "Caisse 1", transactions: 50 },
        { name: "Caisse 2", transactions: 45 },
        { name: "Caisse 3", transactions: 40 },
        { name: "Caisse 4", transactions: 35 },
        { name: "Caisse 5", transactions: 30 }
      ],
      salesRecords: [
        {
          vente: "2024-05-1-3",
          numeroVente: "1301",
          dateCreation: "18/05/2024 16:46",
          dateValidation: "18/05/2024 16:47",
          modePaiement: "ESP",
          utilisateur: ". Caisse 1",
          idProduit: "16",
          libelle: "MENU GOURMAND",
          quantite: "1",
          prixVente: "0.00",
          categorie: "N/A",
          prixAchatHT: "0",
          remise: "0",
          invitations: "",
          categorie2: ""
        },
        {
          vente: "2024-05-1-3",
          numeroVente: "1301",
          dateCreation: "18/05/2024 16:46",
          dateValidation: "18/05/2024 16:47",
          modePaiement: "ESP",
          utilisateur: ". Caisse 1",
          idProduit: "18",
          libelle: "MENU PETITE FAIM",
          quantite: "1",
          prixVente: "0.00",
          categorie: "N/A",
          prixAchatHT: "0",
          remise: "0",
          invitations: "",
          categorie2: ""
        },
        {
          vente: "2024-05-1-3",
          numeroVente: "1301",
          dateCreation: "18/05/2024 16:46",
          dateValidation: "18/05/2024 16:47",
          modePaiement: "ESP",
          utilisateur: ". Caisse 1",
          idProduit: "37",
          libelle: "Carottes",
          quantite: "1",
          prixVente: "2.00",
          categorie: "",
          prixAchatHT: "0.32",
          remise: "0.00",
          invitations: "",
          categorie2: ""
        }
      ]
    };
  }

  renderCharts(data) {
    console.log("Rendering charts with data:", data);

    const mostSoldProductsCtx = document
      .getElementById("mostSoldProductsChart")
      .getContext("2d");
    new Chart(mostSoldProductsCtx, {
      type: "bar",
      data: {
        labels: data.mostSoldProducts.map(product => product.name),
        datasets: [
          {
            label: "Ventes",
            data: data.mostSoldProducts.map(product => product.sales),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
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
    console.log("Graphique des produits les plus vendus rendu.");

    const fastestCashiersCtx = document
      .getElementById("fastestCashiersChart")
      .getContext("2d");
    new Chart(fastestCashiersCtx, {
      type: "bar",
      data: {
        labels: data.fastestCashiers.map(cashier => cashier.name),
        datasets: [
          {
            label: "Transactions",
            data: data.fastestCashiers.map(cashier => cashier.transactions),
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
    console.log("Graphique de la vitesse des caisses rendu.");
  }

  generateCSV(data) {
    console.log("Génération du CSV sous le format demandé...");

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Vente;N° de Vente;Date de création;Date de validation;Mode de paiement;Utilisateur;ID-Produit;Libellé;Quantité;Prix de vente;Catégorie;Prix d'achat HT;Remise;Invitations;Catégorie\n";

    if (data.salesRecords && data.salesRecords.length > 0) {
      data.salesRecords.forEach(record => {
        csvContent += `${record.vente};${record.numeroVente};${record.dateCreation};${record.dateValidation};${record.modePaiement};${record.utilisateur};${record.idProduit};${record.libelle};${record.quantite};${record.prixVente};${record.categorie};${record.prixAchatHT};${record.remise};${record.invitations};${record.categorie2}\n`;
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
  }
}

let logInstance;
document.addEventListener("DOMContentLoaded", () => {
  logInstance = new Log();

  const exportBtn = document.getElementById("exportCsvBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      console.log("Bouton d'export CSV cliqué");
      logInstance.generateCSV(logInstance.data);
    });
  } else {
    console.error("Le bouton d'export (exportCsvBtn) n'a pas été trouvé !");
  }
});
