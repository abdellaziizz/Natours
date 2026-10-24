import Log from './login.js';
import '@babel/polyfill';
const loginForm = document.querySelector('.form');
const logout = document.querySelector('.nav__el--logout');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    Log.login(email, password);
  });
}
if (logout) {
  logout.addEventListener('click', Log.logout);
}
