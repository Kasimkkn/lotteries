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
    };

    // Handle user deletion
    const handleDeleteClient = async () => {
        const { clientIdToDelete } = modalData;
        if (!clientIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteClient(clientIdToDelete);
            if (response.success) {
                toast.success('Client deleted successfully');
                fetchClient();
            }
            else {
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
        if (!viewClientData) return;
        setLoading(true);
        try {
            const response = await updateClient(viewClientData._id, update);
            if (response.success) {
                toast.success('Client updated successfully');
                fetchClient();
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error updating Client:', error);
        } finally {
            toggleModal('viewClient', false);
            setLoading(false);
        }
    };

    // Handle new Client creation
    const handleAddClient = async () => {
        const { new: newClient } = formData;
        setLoading(true);
        try {
            const response = await createClient(newClient);
            if (response.success) {
                toast.success('Client added successfully');
                fetchClient();
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to add client', error);
            console.error('Error adding client:', error);
        } finally {
            toggleModal('addClient', false);
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
                                            // readOnly={formData.update["role"] === "admin"}
                                            className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                            name={field}
                                            value={formData.update[field] || ''}
                                            onChange={(e) => handleInputChange(e, 'update')}
                                        />
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
                        <Modal onClose={() => toggleModal('addClient', false)} title="Add New client" width="max-w-3xl">
                            <div className="grid grid-cols-2 gap-5">
                                {['name', 'email', 'website'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <input
                                            className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                            name={field}
                                            value={formData.new[field] || ''}
                                            placeholder={field}
                                            onChange={(e) => handleInputChange(e, 'new')}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-5">
                                <AddButton title="Add CLient" onClick={handleAddClient} />
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </AdminLayout>
    );
}

export default DashboardClient;
