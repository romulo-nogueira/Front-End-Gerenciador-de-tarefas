// --- 1. DATA DINÂMICA ---
const dateElement = document.getElementById('current-date');
const today = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long' };
let formattedDate = today.toLocaleDateString('pt-BR', options);
formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
if(dateElement) dateElement.innerText = `Hoje: ${formattedDate}`;

// --- 2. NAVEGAÇÃO DO MENU LATERAL (SPA) ---
const menuLinks = document.querySelectorAll('.menu-link');
const views = document.querySelectorAll('.view-section');

menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); 
        menuLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        const targetId = this.getAttribute('data-target');
        views.forEach(view => {
            view.classList.remove('active');
            if(view.id === targetId) {
                view.classList.add('active');
            }
        });
    });
});

// ==========================================
// PREPARAÇÃO PARA INTEGRAÇÃO COM BACK-END
// ==========================================

// Simulação de resposta do Banco de Dados / API
const mockDatabase = {
    userProfile: {
        name: "Augusto",
        avatarInitial: "A"
    },
    tasks: [
        { id: 1, title: "Consulta de orientação profissional", time: "⏰ 11:00 - 11:30", category: "work", isCompleted: false },
        { id: 2, title: "Devolver livros da biblioteca", time: "📅 Qualquer horário", category: "fun", isCompleted: false },
        { id: 3, title: "Limpar a sala", time: "📅 Qualquer horário", category: "home", isCompleted: true }
    ]
};

// --- 3. CARREGAR DADOS DO USUÁRIO ---
function loadUserData() {
    // TODO BACK-END: Fazer fetch GET para pegar os dados do usuário logado usando o ID salvo no localStorage
    const userData = mockDatabase.userProfile; 
    
    document.querySelector('.user-name').innerText = userData.name;
    document.querySelector('.avatar').innerText = userData.avatarInitial;
}

// --- 4. RENDERIZAR TAREFAS NA TELA ---
function renderTasks(tasksArray) {
    const taskListContainer = document.getElementById('task-list');
    taskListContainer.innerHTML = ''; // Limpa a lista antes de desenhar

    tasksArray.forEach(task => {
        let categoryText = '';
        if(task.category === 'work') categoryText = 'Trabalho';
        if(task.category === 'home') categoryText = 'Casa';
        if(task.category === 'fun') categoryText = 'Lazer';
        if(task.category === 'important') categoryText = 'Importante';

        const completedClass = task.isCompleted ? 'completed' : '';
        const checkIcon = task.isCompleted ? '✓' : '';
        const checkClass = task.isCompleted ? 'check-green-filled' : '';

        // Adicionamos o data-id="${task.id}" para identificar a tarefa unicamente
        const taskHTML = `
            <div class="task-row ${completedClass}" data-id="${task.id}">
                <div class="checkbox-area">
                    <div class="custom-check ${checkClass}">${checkIcon}</div>
                </div>
                <div class="task-content">
                    <div class="task-main-info">
                        <span class="task-title">${task.title}</span>
                        <span class="task-time">${task.time}</span>
                    </div>
                    <div class="task-tags">
                        <span class="tag tag-${task.category}">${categoryText}</span>
                    </div>
                </div>
            </div>
        `;
        taskListContainer.insertAdjacentHTML('beforeend', taskHTML);
    });

    // Atualiza os painéis numéricos após desenhar as tarefas
    updateDashboardStats(); 
}

// --- 5. ATUALIZAR NÚMEROS DO PAINEL ---
function updateDashboardStats() {
    const allTasks = document.querySelectorAll('.task-row');
    const completedTasks = document.querySelectorAll('.task-row.completed');
    
    const totalCount = allTasks.length;
    const completedCount = completedTasks.length;
    const pendingCount = totalCount - completedCount;

    if(document.getElementById('stat-total')) document.getElementById('stat-total').innerText = totalCount;
    if(document.getElementById('stat-completed')) document.getElementById('stat-completed').innerText = completedCount;
    if(document.getElementById('stat-pending')) document.getElementById('stat-pending').innerText = pendingCount;
    if(document.getElementById('header-pending-count')) document.getElementById('header-pending-count').innerText = pendingCount;
}

// --- 6. FUNCIONALIDADE DOS CHECKBOXES DE TAREFA (API Ready) ---
const taskListContainer = document.getElementById('task-list');
if (taskListContainer) {
    taskListContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('custom-check')) {
            const taskRow = e.target.closest('.task-row');
            const taskId = taskRow.getAttribute('data-id'); // Pega o ID único da tarefa
            
            taskRow.classList.toggle('completed');
            const isNowCompleted = taskRow.classList.contains('completed');

            if (isNowCompleted) {
                e.target.classList.add('check-green-filled');
                e.target.innerText = '✓';
            } else {
                e.target.classList.remove('check-green-filled');
                e.target.innerText = '';
            }

            updateDashboardStats();

            // TODO BACK-END: Fazer fetch PATCH para atualizar o status da tarefa no banco de dados
            console.log(`Tarefa ID ${taskId} atualizada. Concluída: ${isNowCompleted}`);
        }
    });
}

// --- 7. SISTEMA DE FILTRO DE TAREFAS ---
const taskFilter = document.getElementById('task-filter');
if (taskFilter) {
    taskFilter.addEventListener('change', function() {
        const selectedFilter = this.value; 
        const taskRows = document.querySelectorAll('.task-row');

        taskRows.forEach(row => {
            if (selectedFilter === 'all') {
                row.style.display = 'flex';
                return; 
            }
            const expectedTagClass = 'tag-' + selectedFilter;
            const hasTag = row.querySelector('.' + expectedTagClass);
            row.style.display = hasTag ? 'flex' : 'none';
        });
    });
}

// --- 8. CRIAR NOVA TAREFA (API Ready) ---
const formNewTask = document.getElementById('form-new-task');
if (formNewTask) {
    formNewTask.addEventListener('submit', function(e) {
        e.preventDefault(); 

        // Cria o objeto da nova tarefa
        const newTask = {
            id: Date.now(), // Gera um ID único temporário
            title: document.getElementById('task-title-input').value,
            time: document.getElementById('task-time-input').value,
            category: document.getElementById('task-category').value,
            isCompleted: false
        };

        // TODO BACK-END: Fazer fetch POST para enviar 'newTask' para o banco de dados
        console.log("Enviando nova tarefa para API:", newTask);

        // Atualiza a lista local (mock) e re-renderiza a tela
        mockDatabase.tasks.unshift(newTask); // Coloca a tarefa no início do array
        renderTasks(mockDatabase.tasks);

        formNewTask.reset();
        document.querySelector('[data-target="view-tasks"]').click();
    });
}

// --- INICIALIZAÇÃO ---
// Roda assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    renderTasks(mockDatabase.tasks);
});