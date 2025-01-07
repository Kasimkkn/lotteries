const baseURL = 'http://localhost:5000/api';

const requestHandler = async (method, url, data = null) => {
    try {
        const token = localStorage.getItem('lottery:token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method: method.toUpperCase(),
            headers: headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${baseURL}${url}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
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
