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
// 🖱️ EVENTOS
// ===============================

tabLogin?.addEventListener('click', () => switchMode('login'));
tabRegister?.addEventListener('click', () => switchMode('register'));

linkToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    switchMode('login');
});

});