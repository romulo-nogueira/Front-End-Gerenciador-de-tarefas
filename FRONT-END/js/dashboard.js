document.addEventListener('DOMContentLoaded', () => {
// --- 1. DATA DINÂMICA (Ajustada) ---
const dateElement = document.getElementById('current-date');
const today = new Date();

// Usamos um formato mais curto para não quebrar o layout no celular
const options = { weekday: 'short', day: 'numeric', month: 'long' }; 
let formattedDate = today.toLocaleDateString('pt-BR', options);

// Remove o ponto que o JS coloca no dia abreviado (ex: "sex.") e capitaliza
formattedDate = formattedDate.replace('.', '');
formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

if (dateElement) {
    // Removemos o "Hoje:" para ganhar espaço e ficar mais moderno
    dateElement.innerText = formattedDate; 
}
    // Simulação de usuário logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: "Clayver", id_user: 101 };

    function loadUserData() {
        const nameDisplay = document.getElementById('profile-name');
        const avatarDisplay = document.getElementById('profile-avatar');
        if (nameDisplay && avatarDisplay) {
            nameDisplay.innerText = currentUser.name;
            avatarDisplay.innerText = currentUser.name.charAt(0).toUpperCase();
        }
    }

    // --- 2. BANCO DE DADOS MOCK ---
    let mockDatabase = {
        tasks: []
    };

// --- 3. RENDERIZAÇÃO COM AÇÕES NO RODAPÉ ---
function renderTasks(tasksArray) {
    const taskListContainer = document.getElementById('task-list');
    if (!taskListContainer) return;
    
    taskListContainer.innerHTML = '';

    tasksArray.forEach(task => {
        const categoryText = task.status === 'work' ? 'EM ANDAMENTO' : 'CONCLUIDO';
        const isCompleted = task.status === 'fun';
        
        const taskHTML = `
            <div class="task-row ${isCompleted ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                    <div class="task-main-info">
                        <span class="task-title"><strong>${task.tarefa}</strong></span>
                        <p class="task-desc-text">${task.descricao}</p>
                        <span class="task-time">📅 ${task.inicio} até ${task.fim}</span>
                    </div>
                    <div class="task-tags-area">
                        <span class="tag tag-${task.status}">${categoryText}</span>
                    </div>
                </div>

                <div class="checkbox-area">
                    <div class="custom-check ${isCompleted ? 'check-green-filled' : ''}">${isCompleted ? '✓' : ''}</div>
                    <button class="btn-delete" title="Deletar Tarefa">🗑️</button>
                </div>
            </div>
        `;
        taskListContainer.insertAdjacentHTML('beforeend', taskHTML);
    });
    updateDashboardStats(); //
}

    function updateDashboardStats() {
        const total = mockDatabase.tasks.length;
        const completed = mockDatabase.tasks.filter(t => t.status === 'fun').length;
        
        const elements = {
            total: document.getElementById('stat-total'),
            completed: document.getElementById('stat-completed'),
            pending: document.getElementById('stat-pending'),
            header: document.getElementById('header-pending-count')
        };

        if (elements.total) elements.total.innerText = total;
        if (elements.completed) elements.completed.innerText = completed;
        if (elements.pending) elements.pending.innerText = total - completed;
        if (elements.header) elements.header.innerText = total - completed;
    }

    // --- 4. FUNÇÕES DE AÇÃO (CRIAR E DELETAR) ---
    const formNewTask = document.getElementById('form-new-task');
    if (formNewTask) {
        formNewTask.addEventListener('submit', function(e) {
            e.preventDefault();
            const newTask = {
                "id": Date.now(),
                "id_user": currentUser.id_user,
                "tarefa": document.getElementById('task-title-input').value,
                "descricao": document.getElementById('task-desc-input').value,
                "inicio": document.getElementById('task-date-start').value,
                "fim": document.getElementById('task-date-end').value,
                "status": document.getElementById('task-category').value
            };
            mockDatabase.tasks.unshift(newTask);
            renderTasks(mockDatabase.tasks);
            this.reset();
            const tasksViewBtn = document.querySelector('[data-target="view-tasks"]');
            if (tasksViewBtn) tasksViewBtn.click();
        });
    }

    const taskList = document.getElementById('task-list');
    if (taskList) {
        taskList.addEventListener('click', function(e) {
            const taskRow = e.target.closest('.task-row');
            if (!taskRow) return;
            const taskId = parseInt(taskRow.dataset.id);

            if (e.target.classList.contains('btn-delete')) {
                mockDatabase.tasks = mockDatabase.tasks.filter(t => t.id !== taskId);
                renderTasks(mockDatabase.tasks);
            } else if (e.target.classList.contains('custom-check')) {
                const task = mockDatabase.tasks.find(t => t.id === taskId);
                task.status = task.status === 'work' ? 'fun' : 'work';
                renderTasks(mockDatabase.tasks);
            }
        });
    }

    // --- 5. NAVEGAÇÃO SPA E FILTROS ---
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
            const target = document.getElementById(this.dataset.target);
            if (target) target.classList.add('active');
            
            closeMobileMenu(); // Fecha o modal ao navegar
        });
    });

    const taskFilter = document.getElementById('task-filter');
    if (taskFilter) {
        taskFilter.addEventListener('change', function() {
            const filter = this.value;
            const filtered = filter === 'all' ? mockDatabase.tasks : mockDatabase.tasks.filter(t => t.status === filter);
            renderTasks(filtered);
        });
    }

    // --- 6. LÓGICA DO MENU MOBILE (MODAL) ---
    const menuBtn = document.getElementById('mobile-menu');
    const navSidebar = document.querySelector('.sidebar');
    const closeModalBtn = document.getElementById('close-modal-btn');

    function closeMobileMenu() {
        if (navSidebar) navSidebar.classList.remove('mobile-active');
        if (menuBtn) menuBtn.classList.remove('open');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBtn.classList.toggle('open');
            navSidebar.classList.toggle('mobile-active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', (e) => {
        if (navSidebar && !navSidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // --- 7. INICIALIZAÇÃO ---
    loadUserData();
    renderTasks(mockDatabase.tasks);
});