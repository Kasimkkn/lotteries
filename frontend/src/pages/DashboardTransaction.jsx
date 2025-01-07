import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import TicketsUi from '../components/TicketsUi';
import WidgetCard from '../partials/dashboard/WidgetCard';
import { deleteTicket, getAllTransactions } from '../service/apiServices';
import TransactionUi from '../components/TransactionUi';
import Loader from '../components/Loader';

function DashboardTransaction() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({ delete: false, viewTransaction: false });
    const [modalData, setModalData] = useState({ ticketIdToDelete: null, viewTransactionData: null });
    const [transactions, setTransactions] = useState([]);

    const fetchTransaction = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllTransactions();
            if (response.success) {
                console.log('response', response);
                setTransactions(response.transactions);
            }
        } catch (error) {
            console.error('Error fetching Transactions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleModal = (type, isOpen, data = null) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: isOpen }));
        if (type === 'delete') {
            setModalData((prev) => ({ ...prev, ticketIdToDelete: data }));
        } else if (type === 'viewTransaction') {
            setModalData((prev) => ({ ...prev, viewTransactionData: data }));
        }
    };

    const handleDeleteTransaction = async () => {
        const { ticketIdToDelete } = modalData;
        if (!ticketIdToDelete) return;
        setLoading(true);
        try {
            const response = await deleteTicket(ticketIdToDelete);
            if (response.success) {
                toast.success('Ticket deleted successfully');
                fetchTransaction();
            }
        } catch {
            toast.error('Failed to delete Ticket');
        } finally {
            toggleModal('delete', false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [fetchTransaction]);

    return (
        <AdminLayout>
            {loading ? (<Modal>
                <Loader />
            </Modal>) : (
                <>
                    <div className="grid grid-cols-12 gap-6">
                        <WidgetCard title="Total Transactions" totalusers={transactions.length} />
                        <TransactionUi data={transactions} toggleModal={toggleModal} />
                    </div>

                    {/* Delete Confirmation Modal */}
                    <ConfirmModal
                        isOpen={isModalOpen.delete}
                        message="Are you sure you want to delete this transactions?"
                        onConfirm={handleDeleteTransaction}
                        onCancel={() => toggleModal('delete', false)}
                    />
                </>
            )}
        </AdminLayout>
    );
}


export default DashboardTransaction;
