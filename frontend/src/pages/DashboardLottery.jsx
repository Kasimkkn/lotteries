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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [type]: { ...prev[type], [name]: value } }));
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


    const handleUpdateRaffle = async () => {
        const { viewRaffleData } = modalData;
        const { update } = formData;
        if (!viewRaffleData) return;
        const formDataObj = new FormData();

        const updatedNumbers = update.numbers.split(',').map(num => Number(num.trim()));
        console.log('updatedNumbers', updatedNumbers);

        formDataObj.append("numbers", JSON.stringify(updatedNumbers));
        // Append fields to FormData
        formDataObj.append("name", update.name);
        formDataObj.append("type", update.type);
        formDataObj.append("launchDate", update.launchDate);
        formDataObj.append("drawDate", update.drawDate);
        formDataObj.append("totalEntriesAllowed", update.totalEntriesAllowed);
        formDataObj.append("ticketPrice", update.ticketPrice);
        formDataObj.append("photo", update.photo); // Ensure this is a File object
        setLoading(true);
        try {
            const response = await updateRaffle(viewRaffleData._id, formDataObj);
            if (response.success) {
                toast.success('Raffle updated successfully');
                fetchRaffles();
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error updating raffle:', error);
        } finally {
            setFormData((prev) => ({ ...prev, update: {} }));
            toggleModal('viewRaffle', false);
            setLoading(false);
        }
    };

    // Handle new raffle creation
    const handleAddRaffle = async () => {
        const { new: raffle } = formData;
        const formDataObj = new FormData();

        // Append fields to FormData        
        const updatedNumbers = raffle.numbers.split(',').map(num => Number(num.trim()));
        console.log('updatedNumbers', updatedNumbers);

        formDataObj.append("numbers", JSON.stringify(updatedNumbers)); // Serialize the array as JSON

        formDataObj.append("name", raffle.name);
        formDataObj.append("type", raffle.type);
        formDataObj.append("launchDate", raffle.launchDate);
        formDataObj.append("drawDate", raffle.drawDate);
        formDataObj.append("totalEntriesAllowed", raffle.totalEntriesAllowed);
        formDataObj.append("ticketPrice", raffle.ticketPrice);
        formDataObj.append("photo", raffle.photo); // Ensure this is a File object

        setLoading(true);

        try {
            const response = await createRaffle(formDataObj);
            if (response.success) {
                toast.success("Raffle added successfully");
                fetchRaffles();
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to add raffle");
            console.error("Error adding raffle:", error);
        } finally {
            // emtpy the form
            setFormData((prev) => ({ ...prev, new: {} }));
            toggleModal("addRaffle", false);
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
                            width="max-w-3xl"
                        >
                            <div className="grid grid-cols-2 gap-5">
                                {['name', 'type', 'launchDate', 'drawDate', 'totalEntriesAllowed', 'ticketPrice', 'numbers', 'photo'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                        {field === 'photo' ? (
                                            <input
                                                type="file"
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                onChange={(e) => handleFileChange(e, 'update')}
                                            />
                                        ) : field === 'launchDate' || field === 'drawDate' ? (
                                            <input
                                                type="date"
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                value={formData.update[field] || ''}
                                                onChange={(e) => handleInputChange(e, 'update')}
                                            />
                                        ) : field === 'numbers' ? (
                                            <>
                                                <input
                                                    className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                    name={field}
                                                    value={
                                                        Array.isArray(formData.update[field])
                                                            ? formData.update[field].join(',')
                                                            : formData.update[field] || ''
                                                    }
                                                    onChange={(e) => handleInputChange(e, 'update')}
                                                />
                                            </>
                                        ) : (
                                            <input
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
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
                        <Modal onClose={() => toggleModal('addRaffle', false)} title="Add New Raffle" width="max-w-3xl">
                            <div className="grid grid-cols-2 gap-5">
                                {['name', 'type', 'launchDate', 'drawDate', 'totalEntriesAllowed', 'ticketPrice', 'numbers', 'photo'].map((field) => (
                                    <div key={field} className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
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
                                                className="w-full dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                                name={field}
                                                value={formData.new[field] || ''}
                                                onChange={(e) => handleInputChange(e, 'new')}
                                            />
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

export default DashboardLottery;
