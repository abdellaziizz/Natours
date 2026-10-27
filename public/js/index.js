import Log from './login.js';
import '@babel/polyfill';
const loginForm = document.querySelector('.form');
const logout = document.querySelector('.nav__el--logout');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    Log.login(form);
  });
}
if (logout) {
  logout.addEventListener('click', Log.logout);
}
