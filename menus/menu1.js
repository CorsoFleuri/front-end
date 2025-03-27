let articles = [];

function validateCart() {

    const menuId = 1;

    const params = new URLSearchParams();
    params.append("menus", menuId);
    params.append("articles", articles);
    
    fetch("http://api-corso-fleuri.local/addCommand", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    })
    .then(response => response.json())
    .then(result => {
        console.log("Succès:", result);
        document.getElementById('selected-items-list').innerHTML= '';
        articles = [];
        artilesName = [];
    })
    .catch(error => console.error("Erreur:", error));
}

function initCategory(){
    fetch("http://api-corso-fleuri.local/menus/1", {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(response => response.json())
    .then(result => {
        console.log("Succès:", result);
        result = JSON.parse(result.body);
        result.articles.forEach(id => {
            console.log(id);
            fetch(`http://api-corso-fleuri.local/articles/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            })
            .then(response => response.json())
            .then(result => {
                console.log("Succès:", result);
                result = JSON.parse(result.body);
                console.log(result);
                document.getElementById("dessert").textContent();
            })
            .catch(error => console.error("Erreur:", error));
        });
    })
    .catch(error => console.error("Erreur:", error));
}

function init(){
    initCategory();
}

document.addEventListener('DOMContentLoaded', init);