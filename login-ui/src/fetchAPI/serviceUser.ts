import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

const apiService = {
  setAuthToken(token: string) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getUsers() {
    return apiClient.get('/users');
  },

  createUser(data: any) {
    return apiClient.post('/users', data);
  },

  login(data: any) {
    return apiClient.post('/users/login', data);
  },

  resetPassword(email: string) {
    return apiClient.get(`/users/reset/${email}`);
  },
  
  getProfile(token: string) {
    return apiClient.get('/users/profile/' + token);
  },

  updatePassword(data:any) {
    const model = {
      password: data.password,
      confirmPassword: data.confirmPassword,
    }
    return apiClient.put('/users/' + data.username, model);
  }
};

export default apiService;
