import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity">
      <div className="bg-gray-800 text-white w-full max-w-md p-8 rounded-xl shadow-2xl transform transition-all duration-300 ease-out">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none transition duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none transition duration-200"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
