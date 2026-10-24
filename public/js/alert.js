//the type is success or error
const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class ="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
export default { showAlert, hideAlert };
