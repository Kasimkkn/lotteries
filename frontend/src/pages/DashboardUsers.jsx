import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddButton from '../components/AddButton';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import UsersTable from '../partials/dashboard/UsersTable';
import WidgetCard from '../partials/dashboard/WidgetCard';
import { createUser, deleteUser, getAllUsers, updateUser } from '../service/apiServices';
import Loader from '../components/Loader';

function DashboardUsers() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, addUser: false, viewUser: false });
    const [modalData, setModalData] = useState({ userIdToDelete: null, viewUserData: null });
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ new: {}, update: {} });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        role: '',
        balance: ''
    });

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

    // Validation function
    const validateUser = (user, isEdit = false) => {
        const errors = {};

        // Username Validation
        if (!user.username || user.username.trim() === '') {
            errors.username = "Username is required";
        } else if (user.username.length < 3) {
            errors.username = "Username must be at least 3 characters long";
        }

        // Password Validation (only for new users)
        if (!isEdit) {
            if (!user.password || user.password.trim() === '') {
                errors.password = "Password is required";
            } else if (user.password.length < 4) {
                errors.password = "Password must be at least 4 characters long";
            }
        }

        // Role Validation
        if (!user.role || user.role.trim() === '') {
            errors.role = "Role is required";
        }

        // Balance Validation
        if (!user.balance) {
            errors.balance = "Balance is required";
        } else if (isNaN(user.balance) || parseFloat(user.balance) < 0) {
            errors.balance = "Balance must be a valid positive number";
        }

        return errors;
    };

    // Handle modal state
    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        setErrors({}); // Clear errors when modal is toggled
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
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: '' }));
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

        // Validate form
        const validationErrors = validateUser(update, true);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!viewUserData) return;
        setLoading(true);
        try {
            const response = await updateUser(viewUserData._id, update);
            if (response.success) {
                toast.success('User updated successfully');
                fetchUsers();
                toggleModal('viewUser', false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update user');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle new user creation
    const handleAddUser = async () => {
        const { new: newUser } = formData;

        // Validate form
        const validationErrors = validateUser(newUser);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await createUser(newUser);
            if (response.success) {
                toast.success('User added successfully');
                fetchUsers();
                toggleModal('addUser', false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to add user');
            console.error('Error adding user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <AdminLayout>
            {loading ? (<Modal>
                <Loader />
            </Modal>) : (
                <>
                    <div className="absolute top-4 right-4">
                        <AddButton title="Add User" onClick={() => toggleModal('addUser', true)} />
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <WidgetCard title="Total Users" totalusers={users.length} />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {['username', 'password', 'role', 'balance'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                        <input
                                            className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                            name={field}
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
                                <AddButton title="Edit" onClick={handleUpdateUser} />
                            </div>
                        </Modal>
                    )}

                    {/* Add New User Modal */}
                    {isModalOpen.addUser && (
                        <Modal onClose={() => toggleModal('addUser', false)} title="Add New User" width="max-w-3xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                        {errors[field] && (
                                            <span className="text-red-500 text-sm">{errors[field]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-5">
                                <AddButton title="Add User" onClick={handleAddUser} />
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </AdminLayout>
    );
}

export default DashboardUsers;