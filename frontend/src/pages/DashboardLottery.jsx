import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddButton from '../components/AddButton';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import RafflesTable from '../components/RafflesTable';
import WidgetCard from '../partials/dashboard/WidgetCard';
import { createRaffle, deleteRaffle, getAllRaffles, updateRaffle } from '../service/apiServices';
import Loader from '../components/Loader';

function DashboardLottery() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, addRaffle: false, viewRaffle: false });
    const [modalData, setModalData] = useState({ raffleIdToDelete: null, viewRaffleData: null });
    const [raffles, setRaffles] = useState([]);
    const [formData, setFormData] = useState({ new: {}, update: {} });

    const fetchRaffles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllRaffles();
            if (response.success) {
                setRaffles(response.raffles);
            }
        } catch (error) {
            console.error('Error fetching raffles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        if (type === 'delete') {
            setModalData((prev) => ({ ...prev, raffleIdToDelete: data }));
        } else if (type === 'viewRaffle') {
            setModalData((prev) => ({ ...prev, viewRaffleData: data }));
            setFormData((prev) => ({ ...prev, update: data || {} }));
        }
    };

    const handleInputChange = (e, type) => {
        const { name, value, type: inputType, checked } = e.target;
        const newValue = inputType === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [type]: { ...prev[type], [name]: newValue },
        }));
    };

    const handleDeleteRaffle = async () => {
        const { raffleIdToDelete } = modalData;
        if (!raffleIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteRaffle(raffleIdToDelete);
            if (response.success) {
                toast.success('Raffle deleted successfully');
                fetchRaffles();
            }
        } catch {
            toast.error('Failed to delete raffle');
        } finally {
            toggleModal('delete', false);
            setLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                [type]: { ...prev[type], [name]: files[0] },
            }));
        }
    };


    const validateRaffle = (raffle, isEdit = false) => {
        const errors = [];
        const currentDate = new Date();
        const twentyDaysFromNow = new Date(currentDate);
        twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);

        // Name Validation
        if (!raffle.name || /[^a-zA-Z0-9\s]/.test(raffle.name)) {
            errors.push("Name is required and cannot contain special characters.");
            return errors;
        }

        // Launch Date Validation
        const launchDate = new Date(raffle.launchDate);
        if (!raffle.launchDate || launchDate < currentDate || launchDate > twentyDaysFromNow) {
            errors.push("Launch date must be within the next 20 days and cannot be in the past.");
            return errors;
        }

        // Draw Date Validation
        const drawDate = new Date(raffle.drawDate);
        if (!raffle.drawDate || drawDate <= launchDate || (drawDate - launchDate) / (1000 * 60 * 60 * 24) < 2) {
            errors.push("Draw date must be at least 2 days after the launch date.");
            return errors;
        }

        // Total Entries Validation
        if (!raffle.totalEntriesAllowed || isNaN(raffle.totalEntriesAllowed)) {
            errors.push("Total entries must be a valid number.");
            return errors;
        }

        // Ticket Price Validation
        if (!raffle.ticketPrice || isNaN(raffle.ticketPrice)) {
            errors.push("Ticket price must be a valid number.");
            return errors;
        }

        // Banner Validation
        if (!isEdit && raffle.photo) {
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(raffle.photo.type)) {
                errors.push("Banner must be a JPEG or PNG image.");
            }
            if (raffle.photo.size > 5 * 1024 * 1024) {
                errors.push("Banner size cannot exceed 5 MB.");
            }
        }

        return errors;
    };

    // Updated Handle Add Raffle
    const handleAddRaffle = async () => {
        const { new: raffle } = formData;

        // Validate Inputs
        const errors = validateRaffle(raffle);
        if (errors.length > 0) {
            toast.error(errors.join("\n"));
            return;
        }

        if (!raffle.photo) {
            toast.error("photo is required");
            return;
        }

        // Prepare Data
        const formDataObj = new FormData();
        const updatedNumbers = raffle.numbers.split(',').map(num => Number(num.trim()));
        formDataObj.append("numbers", JSON.stringify(updatedNumbers));
        formDataObj.append("name", raffle.name);
        formDataObj.append("type", raffle.type);
        formDataObj.append("launchDate", raffle.launchDate);
        formDataObj.append("drawDate", raffle.drawDate);
        formDataObj.append("totalEntriesAllowed", raffle.totalEntriesAllowed);
        formDataObj.append("isUniqueNumberSelection", raffle.isUniqueNumberSelection);
        formDataObj.append("isMultipleNumberSelection", raffle.isMultipleNumberSelection);
        formDataObj.append("ticketPrice", raffle.ticketPrice);
        if (raffle.photo) formDataObj.append("photo", raffle.photo);

        // API Call
        setLoading(true);
        try {
            const response = await createRaffle(formDataObj);
            if (response.success) {
                toast.success("Raffle added successfully");
                fetchRaffles();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to add raffle");
        } finally {
            setFormData((prev) => ({ ...prev, new: {} }));
            toggleModal("addRaffle", false);
            setLoading(false);
        }
    };

    // Updated Handle Update Raffle
    const handleUpdateRaffle = async () => {
        const { viewRaffleData } = modalData;
        const { update: raffle } = formData;

        // Validate Inputs
        const errors = validateRaffle(raffle, true);
        if (errors.length > 0) {
            toast.error(errors.join("\n"));
            return;
        }

        // Prepare Data
        const formDataObj = new FormData();
        const updatedNumbers = Array.isArray(raffle.numbers)
            ? raffle.numbers
            : raffle.numbers.split(',').map(num => Number(num.trim()));

        formDataObj.append("numbers", JSON.stringify(updatedNumbers));
        formDataObj.append("name", raffle.name);
        formDataObj.append("type", raffle.type);
        formDataObj.append("launchDate", raffle.launchDate);
        formDataObj.append("drawDate", raffle.drawDate);
        formDataObj.append("totalEntriesAllowed", raffle.totalEntriesAllowed);
        formDataObj.append("isUniqueNumberSelection", raffle.isUniqueNumberSelection);
        formDataObj.append("isMultipleNumberSelection", raffle.isMultipleNumberSelection);
        formDataObj.append("ticketPrice", raffle.ticketPrice);
        if (raffle.photo) formDataObj.append("photo", raffle.photo);

        // API Call
        setLoading(true);
        try {
            const response = await updateRaffle(viewRaffleData._id, formDataObj);
            if (response.success) {
                toast.success("Raffle updated successfully");
                fetchRaffles();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to update raffle");
        } finally {
            setFormData((prev) => ({ ...prev, update: {} }));
            toggleModal("viewRaffle", false);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRaffles();
    }, [fetchRaffles]);

    return (
        <AdminLayout>
            {loading ? (<Modal>
                <Loader />
            </Modal>) : (
                <>
                    <div className="absolute top-4 right-4">
                        <AddButton title="Add Raffle" onClick={() => toggleModal('addRaffle', true)} />
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <WidgetCard title="Total Raffles" totalusers={raffles.length} />
                        <RafflesTable
                            data={raffles}
                            onViewClick={(raffle) => toggleModal('viewRaffle', true, raffle)}
                            onDeleteClick={(id) => toggleModal('delete', true, id)}
                        />
                    </div>

                    {/* Delete Confirmation Modal */}
                    <ConfirmModal
                        isOpen={isModalOpen.delete}
                        message="Are you sure you want to delete this raffle?"
                        onConfirm={handleDeleteRaffle}
                        onCancel={() => toggleModal('delete', false)}
                    />

                    {/* View/Edit Raffle Modal */}
                    {isModalOpen.viewRaffle && modalData.viewRaffleData && (
                        <Modal
                            onClose={() => toggleModal('viewRaffle', false)}
                            title={`Raffle Details`}
                            width="max-w-4xl"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {['name', 'type', 'launchDate', 'drawDate', 'totalEntriesAllowed', 'ticketPrice', 'numbers', 'photo', 'isMultipleNumberSelection'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        {(field !== "isMultipleNumberSelection") && (
                                            <span className="font-semibold">
                                                {formatLabel(field)}
                                            </span>
                                        )}

                                        {field === 'photo' ? (
                                            <input
                                                type="file"
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                required
                                                onChange={(e) => handleFileChange(e, 'update')}
                                            />
                                        ) : field === 'launchDate' || field === 'drawDate' ? (
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                required
                                                name={field}
                                                value={formData.update[field] || ''}
                                                onChange={(e) => handleInputChange(e, 'update')}
                                            />
                                        ) : field === 'numbers' ? (
                                            <input
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                required
                                                value={
                                                    Array.isArray(formData.update[field])
                                                        ? formData.update[field].join(',')
                                                        : formData.update[field] || ''
                                                }
                                                onChange={(e) => handleInputChange(e, 'update')}
                                            />
                                        ) : field === 'isMultipleNumberSelection' ? (
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name={field}
                                                    required
                                                    value={formData.update[field] || ''}
                                                    onChange={(e) => handleInputChange(e, 'update')}
                                                    checked={formData.update[field] || false}
                                                    className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {formatLabel(field)}
                                                </span>

                                            </label>
                                        ) : (
                                            <input
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                required
                                                value={formData.update[field] || ''}
                                                onChange={(e) => handleInputChange(e, 'update')}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-5">
                                <AddButton title="Update Raffle" onClick={handleUpdateRaffle} />
                            </div>
                        </Modal>
                    )}

                    {/* Add New Raffle Modal */}
                    {isModalOpen.addRaffle && (
                        <Modal onClose={() => toggleModal('addRaffle', false)} title="Add New Raffle" width="max-w-4xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                                {['name', 'type', 'launchDate', 'drawDate', 'totalEntriesAllowed', 'ticketPrice', 'numbers', 'photo', 'isMultipleNumberSelection'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        {field !== "isMultipleNumberSelection" && (
                                            <span className="font-semibold">
                                                {formatLabel(field)}
                                            </span>

                                        )}

                                        {field === 'photo' ? (
                                            <input
                                                type="file"
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                onChange={(e) => handleFileChange(e, 'new')}
                                            />
                                        ) : field === 'launchDate' || field === 'drawDate' ? (
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                value={formData.new[field] || ''}
                                                onChange={(e) => handleInputChange(e, 'new')}
                                            />
                                        ) : field === 'isMultipleNumberSelection' ? (
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name={field}
                                                    value={formData.new[field] || ''}
                                                    onChange={(e) => handleInputChange(e, 'new')}
                                                    checked={formData.new[field]}
                                                    className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {formatLabel(field)}
                                                </span>

                                            </label>
                                        ) : (
                                            <input
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                value={formData.new[field] || ''}
                                                placeholder={field}
                                                onChange={(e) => handleInputChange(e, 'new')}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-5">
                                <AddButton title="Add Raffle" onClick={handleAddRaffle} />
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </AdminLayout>
    );
}

const formatLabel = (text) => {
    return text
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

export default DashboardLottery;
