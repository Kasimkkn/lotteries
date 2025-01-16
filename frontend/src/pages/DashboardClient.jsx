import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddButton from '../components/AddButton';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ClientsTable from '../partials/dashboard/ClientsTable';
import WidgetCard from '../partials/dashboard/WidgetCard';
import { createClient, deleteClient, getAllClients, updateClient } from '../service/apiServices';

function DashboardClient() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, addClient: false, viewClient: false });
    const [modalData, setModalData] = useState({ clientIdToDelete: null, viewClientData: null });
    const [clients, setClient] = useState([]);
    const [formData, setFormData] = useState({ new: {}, update: {} });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        website: ''
    });

    // Validation function
    const validateClient = (client) => {
        const errors = {};

        // Name Validation
        if (!client.name || client.name.trim() === '') {
            errors.name = "Name is required";
        } else if (client.name.length < 2) {
            errors.name = "Name must be at least 2 characters long";
        } else if (!/^[a-zA-Z0-9\s'-]*$/.test(client.name)) {
            errors.name = "Name can only contain letters, numbers, spaces, hyphens and apostrophes";
        }

        // Email Validation
        if (!client.email || client.email.trim() === '') {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
            errors.email = "Please enter a valid email address";
        }

        // Website Validation
        if (!client.website || client.website.trim() === '') {
            errors.website = "Website is required";
        } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(client.website)) {
            errors.website = "Please enter a valid website URL";
        }

        return errors;
    };

    // Fetch clients from API
    const fetchClient = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllClients();
            if (response.success) {
                setClient(response.clients);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle modal state
    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        setErrors({}); // Clear errors when modal is toggled
        if (type === 'delete') {
            setModalData((prev) => ({ ...prev, clientIdToDelete: data }));
        } else if (type === 'viewClient') {
            setModalData((prev) => ({ ...prev, viewClientData: data }));
            setFormData((prev) => ({ ...prev, update: data || {} }));
        }
    };

    // Handle input changes
    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [type]: { ...prev[type], [name]: value } }));
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Handle client deletion
    const handleDeleteClient = async () => {
        const { clientIdToDelete } = modalData;
        if (!clientIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteClient(clientIdToDelete);
            if (response.success) {
                toast.success('Client deleted successfully');
                fetchClient();
            } else {
                toast.error(response.message);
            }
        } catch {
            toast.error('Failed to delete client');
        } finally {
            toggleModal('delete', false);
            setLoading(false);
        }
    };

    // Handle Client update
    const handleUpdateClient = async () => {
        const { viewClientData } = modalData;
        const { update } = formData;

        // Validate form
        const validationErrors = validateClient(update);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!viewClientData) return;
        setLoading(true);
        try {
            const response = await updateClient(viewClientData._id, update);
            if (response.success) {
                toast.success('Client updated successfully');
                fetchClient();
                toggleModal('viewClient', false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update client');
            console.error('Error updating Client:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async () => {
        const { new: newClient } = formData;

        // Validate form
        const validationErrors = validateClient(newClient);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await createClient(newClient);
            if (response.success) {
                toast.success('Client added successfully');
                fetchClient();
                toggleModal('addClient', false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to add client');
            console.error('Error adding client:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [fetchClient]);

    return (
        <AdminLayout>
            {loading ? (<Modal>
                <Loader />
            </Modal>) : (
                <>
                    <div className="absolute top-4 right-4">
                        <AddButton title="Add Client" onClick={() => toggleModal('addClient', true)} />
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <WidgetCard title="Total Clients" totalusers={clients.length} />
                        <ClientsTable
                            data={clients}
                            onViewClick={(client) => toggleModal('viewClient', true, client)}
                            onDeleteClick={(id) => toggleModal('delete', true, id)}
                        />
                    </div>

                    {/* Delete Confirmation Modal */}
                    <ConfirmModal
                        isOpen={isModalOpen.delete}
                        message="Are you sure you want to delete this client?"
                        onConfirm={handleDeleteClient}
                        onCancel={() => toggleModal('delete', false)}
                    />

                    {/* View/Edit Client Modal */}
                    {isModalOpen.viewClient && modalData.viewClientData && (
                        <Modal
                            onClose={() => toggleModal('viewClient', false)}
                            title={`Client Created On ${new Date(modalData.viewClientData.createdAt).toLocaleDateString('in-ID')}`}
                            width="max-w-3xl"
                        >
                            <div className="grid grid-cols-2 gap-5">
                                {['name', 'email', 'website'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                        <input
                                            className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                            name={field}
                                            type={field === 'email' ? 'email' : 'text'}
                                            value={formData.update[field] || ''}
                                            onChange={(e) => handleInputChange(e, 'update')}
                                        />
                                        {errors[field] && (
                                            <span className="text-red-500 text-sm">{errors[field]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-5">
                                <AddButton title="Edit" onClick={handleUpdateClient} />
                            </div>
                        </Modal>
                    )}

                    {/* Add New Client Modal */}
                    {isModalOpen.addClient && (
                        <Modal onClose={() => toggleModal('addClient', false)} title="Add New Client" width="max-w-3xl">
                            <div className="grid grid-cols-2 gap-5">
                                {['name', 'email', 'website'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                        <input
                                            className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                            name={field}
                                            type={field === 'email' ? 'email' : 'text'}
                                            value={formData.new[field] || ''}
                                            placeholder={field}
                                            onChange={(e) => handleInputChange(e, 'new')}
                                        />
                                        {errors[field] && (
                                            <span className="text-red-500 text-sm">{errors[field]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-5">
                                <AddButton title="Add Client" onClick={handleAddClient} />
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </AdminLayout>
    );
}

export default DashboardClient;