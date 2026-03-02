import { logout, renderizarTasks, criarTask } from './api.js';

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
const outBtn = document.getElementById('out')
const ctzOutBtn = document.getElementById('ctzout');
const divOut = document.getElementById('divout');
const backOut = document.getElementById('backout');
const aside = document.getElementById('aside')

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

outBtn.addEventListener('click', ()=>{
    divOut.style.display = "flex";
    aside.style.zIndex = "0"
    ctzOutBtn.addEventListener('click', ()=>{
        logout()
    });
    backOut.addEventListener('click', ()=>{
        divOut.style.display = "none";
    })
})

const email = localStorage.getItem("user_email");
const user = document.getElementById('profile-name');
if (user && email) {
    user.innerHTML = email;
}
user.innerHTML = `${email}`;


function renderizarTask() {
    renderizarTasks().then(response => {
        const tasks = response.results;
        console.log(tasks);

        const tbody = document.querySelector("table tbody"); // seleciona o <tbody>
        tbody.innerHTML = ''; // limpa antes de preencher

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.user}</td>
                <td>${task.data_inicio ? new Date(task.data_inicio).toLocaleString() : ''}</td>
                <td>${task.data_entrega ? new Date(task.data_entrega).toLocaleString() : ''}</td>
                <td>${task.categoria}</td>
            `;
            tbody.appendChild(tr);
        });
    });
}

renderizarTask();

function cadastroTasks() {
    const form = document.getElementById('form-new-task');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega valores do formulário
        const title = document.getElementById('task-title-input').value;
        const description = document.getElementById('task-desc-input').value;
        const data_inicio = document.getElementById('task-date-start').value;
        const data_entrega = document.getElementById('task-date-end').value;
        const categoria = document.getElementById('task-category').value;

       /*  // Chama função que faz POST no backend
        const task = await criarTask(title, description, categoria, data_inicio, data_entrega);

        const msg = document.getElementById('task-msg') || document.createElement('div');
        msg.id = 'task-msg';
        msg.style.marginTop = '10px';
        if (!document.getElementById('task-msg')) form.appendChild(msg);

        if (task) {
            msg.style.color = 'green';
            msg.textContent = 'Task criada com sucesso!';
            form.reset();

            // Atualiza lista de tasks no console ou tabela
            const tasksResponse = await renderizarTasks();
            console.log("Tasks atualizadas:", tasksResponse.results);
        } else {
            msg.style.color = 'red';
            msg.textContent = 'Erro ao criar task.';
        } */
    });
}

// Inicializa
cadastroTasks();
renderizarTask()

});