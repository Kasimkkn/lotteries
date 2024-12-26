import React from 'react';

const Modal = ({ title, children, onClose, width }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-5 relative ${width || 'max-w-lg'}`}>
                <div className="flex justify-between items-center pb-2">
                    <h2 className="text-xl text-black dark:text-gray-100 font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-800 dark:text-gray-100 text-3xl font-bold"
                    >
                        &times;
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
