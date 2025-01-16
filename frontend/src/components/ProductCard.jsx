import React from "react";

const ProductCard = ({ product, toggleFullViewModal }) => (
    <div
        onClick={() => toggleFullViewModal(product)}
        className="dark:bg-gray-700 bg-gray-300 rounded-lg group overflow-hidden cursor-pointer relative z-30 hover:before:bg-black before:absolute before:inset-0 before:opacity-20 before:transition-all
    flex flex-col
    ">
        <div className="w-full h-48 overflow-hidden">
            <img
                src={product.photo}
                alt={product.name}
                className="h-full w-full object-cover md:rounded-lg"
            />
        </div>
        <div className="md:absolute md:mx-auto left-0 right-0 bottom-2 lg:-bottom-80 lg:group-hover:bottom-2 bg-black/60 lg:bg-white md:w-11/12 p-2 lg:p-3 md:rounded-lg transition-all duration-300">
            <div className="flex justify-between items-center">
                <h3 className="text-xl lg:text-base font-bold text-white lg:text-gray-800">
                    {product.name}
                </h3>
                <h4 className="text-lg lg:text-base text-white font-bold lg:text-gray-800">
                    ${product.ticketPrice}
                </h4>
            </div>
        </div>
    </div>
);

export default ProductCard;
