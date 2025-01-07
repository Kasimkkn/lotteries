import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('lottery:token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const requestHandler = async (method, url, data = null) => {
    try {
        let response
        if (data) {
            response = await apiClient({ method, url, data });
        } else {
            response = await apiClient({ method, url });
        }
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// User services
export const login = (data) => requestHandler('POST', '/users/login', data);
export const createUser = (data) => requestHandler('POST', '/users', data);
export const getAllUsers = () => requestHandler('GET', '/users');
export const getUserById = (id) => requestHandler('GET', `/users/${id}`);
export const updateUser = (id, data) => requestHandler('PUT', `/users/${id}`, data);
export const deleteUser = (id) => requestHandler('DELETE', `/users/${id}`);

// Raffle services
export const getAllRaffles = () => requestHandler('GET', '/raffles');
export const getRaffleById = (id) => requestHandler('GET', `/raffles/${id}`);
export const createRaffle = (data) => requestHandler('POST', '/raffles', data);
export const updateRaffle = (id, data) => requestHandler('PUT', `/raffles/${id}`, data);
export const deleteRaffle = (id) => requestHandler('DELETE', `/raffles/${id}`);

// Transaction services
export const createTransaction = (data) => requestHandler('POST', '/transactions', data);
export const getAllTransactions = () => requestHandler('GET', '/transactions');
export const getTransactionById = (id) => requestHandler('GET', `/transactions/${id}`);
export const getUserTransactions = () => requestHandler('GET', '/transactions/user');
export const deleteTransaction = (id) => requestHandler('DELETE', `/transactions/${id}`);

// Ticket services
export const purchaseTicket = (data) => requestHandler('POST', '/tickets', data);
export const getTicketsByUser = (userId) => requestHandler('GET', `/tickets/${userId}`);
export const getAllTickets = () => requestHandler('GET', '/tickets');
export const getTicketById = (id) => requestHandler('GET', `/tickets/${id}`);
export const deleteTicket = (id) => requestHandler('DELETE', `/tickets/${id}`);