import React from 'react';
import { IoMdClose } from 'react-icons/io';

const ProductDetails = ({ product, toggleFullViewModal }) => {
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

                            <ul className="grid gap-y-2 mb-8">
                                <li className="text-gray-300">Branded Raffle Event</li>
                                <li className="text-gray-300">Exciting Prizes</li>
                                <li className="text-gray-300">Limited Entries</li>
                                <li className="text-gray-300">Don’t miss your chance to win!</li>
                            </ul>

                            <div className="flex items-center gap-3">
                                <button
                                    className="text-center w-full px-5 py-4 rounded-full bg-indigo-600 flex items-center justify-center font-semibold text-lg shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-lg"
                                >
                                    Buy Now
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
