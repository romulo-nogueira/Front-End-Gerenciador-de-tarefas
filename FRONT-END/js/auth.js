import { login, cadastrarUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {


// ===============================
// 🎯 ELEMENTOS
// ===============================

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

const loginSection = document.getElementById('login-form');
const registerSection = document.getElementById('register-form');

const headerTitle = document.getElementById('header-title');
const headerDesc = document.getElementById('header-desc');

const linkToLogin = document.getElementById('link-to-login');

const formLogin = document.getElementById('login-form');
const errorMsg = document.getElementById('login-error');


// ===============================
// 🔄 TROCA DE MODO
// ===============================

function switchMode(mode) {

    const isLogin = mode === 'login';

    loginSection?.classList.toggle('active', isLogin);
    registerSection?.classList.toggle('active', !isLogin);

    tabLogin?.classList.toggle('active', isLogin);
    tabRegister?.classList.toggle('active', !isLogin);

    if (headerTitle && headerDesc) {
        headerTitle.innerText = isLogin
            ? "Bem-vindo de volta!"
            : "Comece Agora";

        headerDesc.innerText = isLogin
            ? "Por favor, insira seus dados para entrar."
            : "Crie sua conta agora.";
    }
}


// ===============================
// 🖱️ EVENTOS UI
// ===============================

tabLogin?.addEventListener('click', () => switchMode('login'));
tabRegister?.addEventListener('click', () => switchMode('register'));

linkToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    switchMode('login');
});


// ===============================
// 🔐 LOGIN
// ===============================

console.log("Form encontrado:", formLogin);

formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (errorMsg) errorMsg.innerText = "";

    try {
        await login(email, password);

        localStorage.setItem("user_email", email);
        // ✅ Redirecionamento correto
        window.location.href = "./dashboard.html";

    } catch (error) {
        if (errorMsg) {
            errorMsg.innerText = "Email ou senha inválidos.";
        }
    }
});

function cadastroUsers(){
const form = document.getElementById('form-register-api');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        const usuario = await cadastrarUser(username, email, password);

        if (usuario) {
            alert('Usuário cadastrado com sucesso!');
            form.reset();
            window.location.reload();
        } else {
            alert('Erro ao cadastrar usuário.');
            console.log(`Usuário: ${usuario}`)
        }
    });
}

cadastroUsers();

});