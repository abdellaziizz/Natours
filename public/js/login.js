import axios from 'axios';
import Alert from './alert.js';
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://127.0.0.1:3000/api/v1/users/login',
      data: { email, password }, //the data that we send with the request in the body
    });
    if (res.data.status === 'success') {
      Alert.showAlert('success', 'Logged in successfully !');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    Alert.hideAlert('error', 'error !');

    console.log(err.response.data);
  }
};
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://127.0.0.1:3000/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'error');
  }
};
export default { login, logout };
