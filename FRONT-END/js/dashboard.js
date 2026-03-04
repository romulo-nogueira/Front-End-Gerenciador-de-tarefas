import { logout, renderizarTasks, criarTask, atualizarStatusTask, atualizarTask, deletarTask } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    let taskEmEdicao = null;

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
// 👤 USUÁRIO
// ===============================

const email = localStorage.getItem("user_email");
const user = document.getElementById('profile-name');
const avatar = document.getElementById('profile-avatar');

if (user && email) {
    user.textContent = email;

    if (avatar) {
        const nome = email.trim();

        // Pega primeira letra
        const inicial = nome.charAt(0).toUpperCase();

        avatar.textContent = inicial;
    }
}

    // ===============================
    // 🧭 NAVEGAÇÃO SPA
    // ===============================

    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.view-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            menuLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => section.classList.remove('active'));

            const targetSection = document.getElementById(link.dataset.target);
            targetSection?.classList.add('active');

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
        sidebar.classList.toggle('mobile-active');
        menuBtn.classList.toggle('open');
    });

    closeBtn?.addEventListener('click', closeMobileMenu);

    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // ===============================
    // 🚪 MODAL LOGOUT
    // ===============================

    const outBtn = document.getElementById('out');
    const overlay = document.getElementById('divout');
    const confirmLogout = document.getElementById('ctzout');
    const cancelLogout = document.getElementById('backout');

    outBtn?.addEventListener('click', () => {
        overlay.style.display = "flex";
    });

    confirmLogout?.addEventListener('click', () => {
        logout();
    });

    cancelLogout?.addEventListener('click', () => {
        overlay.style.display = "none";
    });

    window.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = "none";
        }
    });

    // ===============================
    // 🔄 LISTA / QUADRO
    // ===============================

    const tasksCard = document.querySelector('.tasks-card');
    const tbody = document.querySelector('#tasks-body');
    const cardContainer = document.getElementById('card-container');
    const btnList = document.getElementById('btn-list-view');
    const btnCard = document.getElementById('btn-card-view');
    const filter = document.getElementById('task-filter');

    function setView(mode) {
        localStorage.setItem("taskView", mode);

        btnList?.classList.toggle("active", mode === "list");
        btnCard?.classList.toggle("active", mode === "card");

        tasksCard?.classList.toggle("list-mode", mode === "list");
        tasksCard?.classList.toggle("card-mode", mode === "card");
    }

    btnList?.addEventListener("click", () => setView("list"));
    btnCard?.addEventListener("click", () => setView("card"));

    setView(localStorage.getItem("taskView") || "list");

    // ===============================
    // 📋 RENDERIZAR TASKS
    // ===============================

    async function carregarTasks() {

        const response = await renderizarTasks();
        const tasks = response?.results || [];

        tbody.innerHTML = '';
        cardContainer.innerHTML = '';

        const filtroAtual = filter?.value || "all";

        // ===============================
        // 📊 CONTADORES
        // ===============================

        let total = 0;
        let pendentes = 0;
        let concluidas = 0;

        tasks.forEach(task => {
            total++;

            if (task.categoria === "pendente") pendentes++;
            if (task.categoria === "concluido") concluidas++;
        });

        document.getElementById("stat-total").textContent = total;
        document.getElementById("stat-pending").textContent = pendentes;
        document.getElementById("stat-completed").textContent = concluidas;

        const headerCount = document.getElementById("header-pending-count");
        if (headerCount) headerCount.textContent = pendentes;

        // ===============================
        // 🎯 FILTRO + RENDERIZAÇÃO
        // ===============================

        tasks
            .filter(task => filtroAtual === "all" || task.categoria === filtroAtual)
            .forEach(task => {

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <input data-id="${task.id}" style="width: 20px; height: 20px;" 
                        type="checkbox" ${task.categoria === 'concluido' ? 'checked' : ''}>
                    </td>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${email}</td>
                    <td>${task.data_inicio ? new Date(task.data_inicio).toLocaleDateString() : ''}</td>
                    <td>${task.data_entrega ? new Date(task.data_entrega).toLocaleDateString() : ''}</td>
                    <td class="${task.categoria === 'pendente' ? 'status-pendente' : 'status-concluido'}">
                        ${task.categoria}
                    </td>
                    <td>
                        <button class="edit-btn" data-id="${task.id}">Editar</button> 
                        <button class="delete-btn" data-id="${task.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);

                const card = document.createElement('div');
                card.classList.add('task-card');

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${task.title}</h3>
                        <input data-id="${task.id}" style="width: 20px; height: 20px;" 
                        type="checkbox" ${task.categoria === 'concluido' ? 'checked' : ''}>
                    </div>
                    <p>${task.description}</p>
                    <p><strong>Responsável:</strong> ${email}</p>
                    <p><strong>Início:</strong> ${task.data_inicio ? new Date(task.data_inicio).toLocaleDateString() : ''}</p>
                    <p><strong>Entrega:</strong> ${task.data_entrega ? new Date(task.data_entrega).toLocaleDateString() : ''}</p>
                    <div class="card-actions" style="margin-top:10px;">
                        <button class="edit-btn" data-id="${task.id}">Editar</button>
                        <button class="delete-btn" data-id="${task.id}">Excluir</button>
                    </div>
                    <div class="card-footer ${task.categoria === 'pendente' ? 'status-pendente' : 'status-concluido'}">
                        ${task.categoria.toUpperCase()}
                    </div>
                `;

                cardContainer.appendChild(card);
            });

        // ===============================
        // 🔥 EVENTO CHECKBOX (ADICIONADO)
        // ===============================

        document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
            checkbox.addEventListener("change", async function () {

                const taskId = this.dataset.id;
                const novaCategoria = this.checked ? "concluido" : "pendente";

                try {
                    await atualizarStatusTask(taskId, novaCategoria);
                    carregarTasks();
                } catch (error) {
                    alert("Erro ao atualizar status");
                    this.checked = !this.checked;
                }

            });
        });

        // ===============================
        // 🗑️ EVENTO EXCLUIR
        // ===============================

        document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async function () {

        const taskId = this.dataset.id;

        const confirmar = confirm("Tem certeza que deseja excluir essa tarefa?");
        if (!confirmar) return;

        const resultado = await deletarTask(taskId);

        if (resultado) {
            carregarTasks();
        } else {
            alert("Erro ao excluir tarefa");
        }

            });
        });

        // ===============================
        // ✏️ EVENTO EDITAR
        // ===============================

        document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {

        const taskId = this.dataset.id;
        const task = tasks.find(t => t.id == taskId);

        if (!task) return;

        taskEmEdicao = taskId;

        document.getElementById('task-title-input').value = task.title;
        document.getElementById('task-desc-input').value = task.description;
        document.getElementById('task-date-start').value = task.data_inicio || "";
        document.getElementById('task-date-end').value = task.data_entrega || "";
        document.getElementById('task-category').value = task.categoria;

        document.querySelector('[data-target="view-new-task"]').click();
    });
});
    }

    filter?.addEventListener("change", carregarTasks);

    carregarTasks();

    // ===============================
    // ➕ CADASTRO DE TASK
    // ===============================

    const form = document.getElementById('form-new-task');

    form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title-input').value;
    const description = document.getElementById('task-desc-input').value;
    const data_inicio = document.getElementById('task-date-start').value;
    const data_entrega = document.getElementById('task-date-end').value;
    const categoria = document.getElementById('task-category').value;

    if (taskEmEdicao) {
        // 🔥 ATUALIZAR
        const atualizado = await atualizarTask(
            taskEmEdicao,
            title,
            description,
            categoria,
            data_inicio,
            data_entrega
        );

        if (atualizado) {
            alert('Tarefa atualizada com sucesso!');
            taskEmEdicao = null;
            document.querySelector('[data-target="view-tasks"]').click();

        }

    } else {
        // ➕ CRIAR
        const task = await criarTask(
            title,
            description,
            categoria,
            data_inicio,
            data_entrega
        );

        if (task) {
            alert('Tarefa criada com sucesso!');
        }
    }

    form.reset();
    carregarTasks();
});

});