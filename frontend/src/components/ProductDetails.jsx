import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios'; // Assuming you're using Axios for API calls
import { purchaseTicket } from '../service/apiServices';
import toast from 'react-hot-toast';

const ProductDetails = ({ product, toggleFullViewModal }) => {
    const userId = JSON.parse(localStorage.getItem('lottery:user')).id;
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleBuyNow = async (productId) => {
        setIsLoading(true);

        try {
            const response = await purchaseTicket({
                userId,
                raffleId: productId,
                selectedNumbers: selectedNumber,
                quantity: selectedQuantity,
            });

            if (response.success) {
                toast.success(response.message || 'Ticket purchased successfully');
                console.log('response', response);
            } else {
                toast.error(response.message || 'Failed to purchase ticket');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.message);
            } else {
                toast.error('Failed to purchase ticket');
            }
            console.log('Error purchasing ticket:', error);
        } finally {
            setIsLoading(false);
            toggleFullViewModal(null);
        }
    };


    return (
        <section className="relative z-40 max-w-8xl p-6 md:p-10 bg-black text-white">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Image Section */}
                    <div className="img">
                        <div className="img-box h-full max-lg:mx-auto">
                            <img
                                src={product.photo}
                                alt={product.name}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="data w-full flex items-center">
                        <div className="data w-full max-w-xl">
                            <p className="text-lg font-medium leading-8 text-indigo-400 mb-4">
                                {product.type}
                            </p>
                            <h2 className="font-manrope font-bold text-3xl leading-10 mb-4 capitalize">
                                {product.name}
                            </h2>
                            <div className="mb-4">
                                <h6 className="font-manrope font-semibold text-2xl mb-2">
                                    Ticket Price: ₹{product.ticketPrice}
                                </h6>
                                <p className="text-gray-300">
                                    Entrants: {product.entrants} / {product.totalEntriesAllowed}
                                </p>
                                <p className="text-gray-300">
                                    Launch Date: {new Date(product.launchDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300">
                                    Draw Date: {new Date(product.drawDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="my-4 flex items-center gap-2">
                                <select
                                    value={selectedQuantity}
                                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                    className="dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                >
                                    {[1, 2, 3, 4, 5].map((q) => (
                                        <option key={q} value={q}>
                                            {q}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedNumber}
                                    onChange={(e) => setSelectedNumber(Number(e.target.value))}
                                    className="dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 border dark:border-gray-400 rounded-lg"
                                >
                                    {Array.from({ length: 49 }, (_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleBuyNow(product._id)}
                                    disabled={isLoading}
                                    className="text-center w-full px-5 py-4 rounded-full bg-indigo-600 flex items-center justify-center font-semibold text-lg shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-lg disabled:bg-gray-500"
                                >
                                    {isLoading ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <button
                className="absolute top-2 right-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                onClick={() => toggleFullViewModal(null)}
            >
                <IoMdClose className="text-2xl text-white" />
            </button>
        </section>
    );
};

export default ProductDetails;
