import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { purchaseTicket } from '../service/apiServices';
import toast from 'react-hot-toast';

const ProductDetails = ({ product, toggleFullViewModal }) => {
    console.log('product', product);
    const userId = JSON.parse(localStorage.getItem('lottery:user')).id;
    // const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let filteredNumbers
    if (product.isUniqueNumberSelection) {

        filteredNumbers = Array.isArray(product.userSelectedNumbers) && product.userSelectedNumbers.length > 0
            ? product.numbers.filter((num) => !product.userSelectedNumbers.includes(num))
            : product.numbers;
    } else {
        filteredNumbers = product.numbers;
    }

    const handleNumberSelect = (number) => {
        setSelectedNumber(number);
    };

    const handleBuyNow = async (productId) => {
        if (!selectedNumber) {
            toast.error('Please select a number');
            return;
        }

        setIsLoading(true);
        try {
            const response = await purchaseTicket({
                userId,
                raffleId: productId,
                selectedNumbers: selectedNumber,
                quantity: 1,
            });

            if (response.success) {
                toast.success(response.message || 'Ticket purchased successfully');
            } else {
                toast.error(response.message || 'Failed to purchase ticket');
            }
        } catch (error) {
            toast.error(error.response?.message || 'Failed to purchase ticket');
        } finally {
            setIsLoading(false);
            toggleFullViewModal(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  items-start">

            {/* Product Image */}
            <div className="flex justify-center lg:justify-start">
                <div className="md:h-full  w-full max-w-md lg:max-w-lg mx-auto">
                    <img
                        src={product.photo}
                        alt={product.name}
                        className="w-full h-56 md:h-auto object-cover rounded-lg shadow-md"
                    />
                </div>
            </div>

            {/* Product Data */}
            <div className="w-full flex items-center">
                <div className="w-full max-w-xl space-y-3">
                    {/* Product Type */}
                    <p className="text-lg font-medium text-indigo-400">
                        {product.type}
                    </p>

                    {/* Product Name */}
                    <h2 className="font-manrope font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight capitalize">
                        {product.name}
                    </h2>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <h6 className="font-manrope font-semibold text-xl sm:text-2xl">
                            Ticket Price: ${product.ticketPrice}
                        </h6>
                        <p className="text-gray-300 text-sm sm:text-base">
                            Entrants: {product.entrants} / {product.totalEntriesAllowed}
                        </p>
                        <p className="text-gray-300 text-sm sm:text-base">
                            Launch Date: {new Date(product.launchDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300 text-sm sm:text-base">
                            Draw Date: {new Date(product.drawDate).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Select Number */}
                    <p className="text-lg font-medium leading-8 text-indigo-400">Select Number</p>
                    <div className="overflow-x-auto whitespace-nowrap">
                        <div className="flex flex-wrap gap-3">
                            {filteredNumbers.length === 0
                                ? 'All Numbers Are Selected'
                                : filteredNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => handleNumberSelect(number)}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border 
                                                    ${selectedNumber === number
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-black border-gray-400'} 
                                                    hover:bg-indigo-500 hover:text-white transition`}
                                    >
                                        {number}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Buy Now Button */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleBuyNow(product._id)}
                            disabled={isLoading}
                            className="text-center w-full px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold text-lg shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-lg disabled:bg-gray-500"
                        >
                            {isLoading ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
