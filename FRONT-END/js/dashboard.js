document.addEventListener('DOMContentLoaded', () => {


// ===============================
// 📅 DATA DINÂMICA
// ===============================

const dateElement = document.getElementById('current-date');

if (dateElement) {
    const today = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'long' };

    let formattedDate = today.toLocaleDateString('pt-BR', options);
    formattedDate = formattedDate.replace('.', '');
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    dateElement.innerText = formattedDate;
}


// ===============================
// 🧭 NAVEGAÇÃO ENTRE SEÇÕES
// ===============================

const menuLinks = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.view-section');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove estado ativo dos menus
        menuLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');

        // Esconde todas as seções
        sections.forEach(section => section.classList.remove('active'));

        // Mostra a seção correspondente
        const targetId = link.dataset.target;
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        closeMobileMenu();
    });
});


// ===============================
// 📱 MENU MOBILE
// ===============================

const menuBtn = document.getElementById('mobile-menu');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.getElementById('close-modal-btn');

function closeMobileMenu() {
    sidebar?.classList.remove('mobile-active');
    menuBtn?.classList.remove('open');
}

menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('open');
    sidebar.classList.toggle('mobile-active');
});

closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileMenu();
});

document.addEventListener('click', (e) => {
    if (sidebar && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

});