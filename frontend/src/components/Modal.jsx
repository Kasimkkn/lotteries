import React from 'react';

const Modal = ({ title, children, onClose, width }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40 p-2 sm:p-8">
            <div
                className={`z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full relative 
                ${width || 'max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl'} p-4`}
            >
                {/* Header Section */}
                <div className="flex justify-between items-center pb-4">
                    {title && (
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black dark:text-gray-100">
                            {title}
                        </h2>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-black hover:text-gray-800 dark:text-gray-100 text-3xl font-bold"
                        >
                            &times;
                        </button>
                    )}
                </div>

                {/* Content Section */}
                <div className="max-h-[75vh] overflow-y-auto scroll text-sm sm:text-base md:text-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
