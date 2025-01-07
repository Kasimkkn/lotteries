import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import TicketsUi from '../components/TicketsUi';
import WidgetCard from '../partials/dashboard/WidgetCard';
import { deleteTicket, getAllTickets } from '../service/apiServices';
import Loader from '../components/Loader';

function DashboardTickets() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, viewTickets: false });
    const [modalData, setModalData] = useState({ ticketIdToDelete: null, viewTicketsData: null });
    const [tickets, setTickets] = useState([]);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllTickets();
            if (response.success) {
                setTickets(response.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        if (type === 'delete') {
            setModalData((prev) => ({ ...prev, ticketIdToDelete: data }));
        } else if (type === 'viewTickets') {
            setModalData((prev) => ({ ...prev, viewTicketsData: data }));
        }
    };

    const handleDeleteTickets = async () => {
        const { ticketIdToDelete } = modalData;
        if (!ticketIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteTicket(ticketIdToDelete);
            if (response.success) {
                toast.success('Ticket deleted successfully');
                fetchTickets();
            }
        } catch {
            toast.error('Failed to delete Ticket');
        } finally {
            toggleModal('delete', false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return (
        <AdminLayout>
            {loading ? (<Modal>
                <Loader />
            </Modal>) : (
                <>
                    <div className="grid grid-cols-12 gap-6">
                        <WidgetCard title="Total Tickets" totalusers={tickets.length} />
                        <TicketsUi data={tickets} toggleModal={toggleModal} />
                    </div>

                    {/* Delete Confirmation Modal */}
                    <ConfirmModal
                        isOpen={isModalOpen.delete}
                        message="Are you sure you want to delete this ticket?"
                        onConfirm={handleDeleteTickets}
                        onCancel={() => toggleModal('delete', false)}
                    />

                    {/* View Ticket Modal */}
                    {isModalOpen.viewTickets && modalData.viewTicketsData && (
                        <Modal
                            onClose={() => toggleModal('viewTickets', false)}
                            title={`Ticket Details`}
                            width="max-w-3xl"
                        >
                            <div
                                key={modalData.viewTicketsData._id}
                                className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-md flex flex-col justify-between"
                            >
                                <img
                                    src={modalData.viewTicketsData.raffle.photo}
                                    alt={modalData.viewTicketsData.raffle.name}
                                    className="rounded-lg mb-4 w-full object-cover h-32"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        {modalData.viewTicketsData.raffle.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Type: {modalData.viewTicketsData.raffle.type}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Draw Date: {new Date(modalData.viewTicketsData.raffle.drawDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Price: ₹{modalData.viewTicketsData.raffle.ticketPrice}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Selected Numbers: {modalData.viewTicketsData.selectedNumbers}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Price Paid: ₹{modalData.viewTicketsData.price}
                                    </p>
                                </div>
                            </div>

                        </Modal>
                    )}
                </>
            )
            }
        </AdminLayout >
    );
}


export default DashboardTickets;
