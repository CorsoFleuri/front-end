document.addEventListener('DOMContentLoaded', (e) => {
    const userRole = localStorage.getItem('role')
    const accessTable = {
        "/vue_admin/category.html": ["admin"],
        "/vue_admin/log.html": ["admin"],
        "/vue_admin/parametre.html": ["admin"],
        "/vue_admin/produit_detail.html": ["admin"],
        "/vue_admin/produit.html": ["admin"],
        "/vue_admin/user.html": ["admin"],
        "/vue_admin/create_menu.html": ["admin"],
        "/borne/borne_panier.html": ["admin", "user"],
        "/borne/borne_produit.html": ["admin", "user"],
        "/caisse/caisse.html": ["admin", "user"],
        "/menus/menu1.html": ["admin", "user"],
        "/menus/menu2.html": ["admin", "user"],
    };
    const currentPage = window.location.pathname;

    if (!userRole) {
        window.location = '/connexion/connexion.html'
    } else if (!accessTable[currentPage] || !accessTable[currentPage].includes(userRole)) {
        window.location = '/borne/borne_panier.html'
    }
})