import React, { useEffect, useState } from 'react';
import HomeHeader from '../components/HomeHeader';
import { getTicketsByUser } from '../service/apiServices';

const MyTickets = () => {
    const [usersTickets, setUsersTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = JSON.parse(localStorage.getItem('lottery:user')).id;

    const fetchUsersTickets = async () => {
        setLoading(true);
        try {
            const response = await getTicketsByUser(userId);
            console.log('response', response);
            if (response.success) {
                setUsersTickets(response.tickets);
            }
        } catch (error) {
            console.error('Error fetching user tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersTickets();
    }, []);

    return (
        <>
            <HomeHeader />
            <div className="text-white bg-slate-950 min-h-screen pt-10">
                <section className="py-12 relative">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                        <h2 className="font-manrope font-extrabold text-3xl md:text-4xl leading-10 text-white mb-9">History</h2>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p className='text-white'>Loading....</p>
                            </div>
                        ) : usersTickets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {usersTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="flex flex-col bg-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
                                        <img
                                            src={ticket.raffle.photo}
                                            alt={ticket.raffle.name}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                        <h6 className="font-manrope font-semibold text-lg leading-7 text-white mb-2">
                                            {ticket.raffle.name}
                                        </h6>
                                        <p className="font-normal text-sm leading-6 text-gray-400 mb-2">
                                            Type: {ticket.raffle.type}
                                        </p>
                                        <div className="flex justify-between items-center text-sm text-gray-400">
                                            <span>Qty: {ticket.quantity}</span>
                                            <span className="font-semibold text-white">Price: ${ticket.raffle.ticketPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-lg">No tickets found.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default MyTickets;
