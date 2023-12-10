import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 5000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const AuthAPI = {
  async login(credentials) {
    return await api.post('/authentication/login', { username: credentials.username, password: credentials.password });
  },

  async register(credentials) {
    console.log(credentials);
    return await api.post('/authentication/register', { username: credentials.username, password: credentials.password });
  },
};

export default AuthAPI;