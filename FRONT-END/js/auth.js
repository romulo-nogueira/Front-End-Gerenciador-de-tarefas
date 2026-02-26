// Selecionando os elementos do DOM
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');
const headerTitle = document.getElementById('header-title');
const headerDesc = document.getElementById('header-desc');
const linkToLogin = document.getElementById('link-to-login');

// Função responsável por alternar entre as telas de Login e Registro
function switchMode(mode) {
    if (mode === 'login') {
        loginFormContainer.classList.add('active');
        registerFormContainer.classList.remove('active');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        headerTitle.innerText = "Bem-vindo de volta!";
        headerDesc.innerText = "Por favor, insira seus dados para entrar.";
    } else if (mode === 'register') {
        registerFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active');
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        headerTitle.innerText = "Comece Agora";
        headerDesc.innerText = "Crie sua conta agora.";
    }
}

// Ouvintes de eventos (Event Listeners)
tabLogin.addEventListener('click', () => switchMode('login'));
tabRegister.addEventListener('click', () => switchMode('register'));

if (linkToLogin) {
    linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchMode('login');
    });
}

// ==========================================
// INTEGRAÇÃO COM BACK-END (Simulação)
// ==========================================

const formLoginAPI = document.getElementById('form-login-api');
const formRegisterAPI = document.getElementById('form-register-api');
const loginErrorMsg = document.getElementById('login-error-msg');

// 1. Envio do Formulário de Login
if (formLoginAPI) {
    formLoginAPI.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede a página de recarregar

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btnSubmit = document.getElementById('btn-sign-in');
        
        btnSubmit.innerText = "Carregando...";

        // TODO BACK-END: Fazer fetch (POST) para /api/login aqui
        console.log("Tentando logar com:", email);

        // Simulação de resposta de sucesso do servidor (1 segundo de delay)
        setTimeout(() => {
            // Simulando armazenamento do Token do usuário e redirecionamento
            localStorage.setItem('userId', '12345'); 
            window.location.href = 'dashboard.html';
        }, 1000);
    });
}

// 2. Envio do Formulário de Registro
if (formRegisterAPI) {
    formRegisterAPI.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        // TODO BACK-END: Fazer fetch (POST) para /api/register aqui
        console.log("Enviando dados para criar conta:", { name, email, password });
        
        alert("Conta criada com sucesso! (Simulação da API)");
        switchMode('login'); // Volta para a tela de login
    });
}