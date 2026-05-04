import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    if (token) {
        config.headers.set('X-CSRF-TOKEN', token);
    }
    return config;
});

export default axios;
