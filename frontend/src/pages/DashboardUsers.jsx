import React, { useCallback, useEffect, useState } from 'react';
import AddButton from '../components/AddButton';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import UsersCard from '../partials/dashboard/UsersCard';
import UsersTable from '../partials/dashboard/UsersTable';
import { createUser, deleteUser, getAllUsers, updateUser } from '../service/apiServices';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

function DashboardUsers() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, addUser: false, viewUser: false });
    const [modalData, setModalData] = useState({ userIdToDelete: null, viewUserData: null });
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ new: {}, update: {} });

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUsers();
            if (response.success) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle modal state
    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        if (type === 'delete') {
            setModalData((prev) => ({ ...prev, userIdToDelete: data }));
        } else if (type === 'viewUser') {
            setModalData((prev) => ({ ...prev, viewUserData: data }));
            setFormData((prev) => ({ ...prev, update: data || {} }));
        }
    };

    // Handle input changes
    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [type]: { ...prev[type], [name]: value } }));
    };

    // Handle user deletion
    const handleDeleteUser = async () => {
        const { userIdToDelete } = modalData;
        if (!userIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteUser(userIdToDelete);
            if (response.success) {
                toast.success('User deleted successfully');
                fetchUsers();
            }
        } catch {
            toast.error('Failed to delete user');
        } finally {
            toggleModal('delete', false);
            setLoading(false);
        }
    };

    // Handle user update
    const handleUpdateUser = async () => {
        const { viewUserData } = modalData;
        const { update } = formData;
        if (!viewUserData) return;
        setLoading(true);
        try {
            const response = await updateUser(viewUserData._id, update);
            if (response.success) {
                toast.success('User updated successfully');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            toggleModal('viewUser', false);
            setLoading(false);
        }
    };

    // Handle new user creation
    const handleAddUser = async () => {
        const { new: newUser } = formData;
        setLoading(true);
        try {
            const response = await createUser(newUser);
            if (response.success) {
                toast.success('User added successfully');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            toggleModal('addUser', false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <AdminLayout>
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Users</h1>
                <AddButton title="Add User" onClick={() => toggleModal('addUser', true)} />
            </div>

            <div className="grid grid-cols-12 gap-6">
                <UsersCard title="Total Users" totalusers={users.length} />
                <UsersTable
                    data={users}
                    onViewClick={(user) => toggleModal('viewUser', true, user)}
                    onDeleteClick={(id) => toggleModal('delete', true, id)}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isModalOpen.delete}
                message="Are you sure you want to delete this user?"
                onConfirm={handleDeleteUser}
                onCancel={() => toggleModal('delete', false)}
            />

            {/* View/Edit User Modal */}
            {isModalOpen.viewUser && modalData.viewUserData && (
                <Modal
                    onClose={() => toggleModal('viewUser', false)}
                    title={`User Created On ${new Date(modalData.viewUserData.createdAt).toLocaleDateString('in-ID')}`}
                    width="max-w-3xl"
                >
                    <div className="grid grid-cols-2 gap-5">
                        {['username', 'role', 'balance'].map((field) => (
                            <div key={field} className="flex flex-col gap-2">
                                <span className="font-semibold">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </span>
                                <input
                                    readOnly={formData.update["role"] === "admin"}
                                    className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                    name={field}
                                    value={formData.update[field] || ''}
                                    onChange={(e) => handleInputChange(e, 'update')}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-5">
                        <AddButton title="Edit" onClick={handleUpdateUser} />
                    </div>
                </Modal>
            )}

            {/* Add New User Modal */}
            {isModalOpen.addUser && (
                <Modal onClose={() => toggleModal('addUser', false)} title="Add New User" width="max-w-3xl">
                    <div className="grid grid-cols-2 gap-5">
                        {['username', 'password', 'role', 'balance'].map((field) => (
                            <div key={field} className="flex flex-col gap-2">
                                <span className="font-semibold">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </span>
                                <input
                                    className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                    name={field}
                                    value={formData.new[field] || ''}
                                    onChange={(e) => handleInputChange(e, 'new')}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-5">
                        <AddButton title="Add User" onClick={handleAddUser} />
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}

export default DashboardUsers;
