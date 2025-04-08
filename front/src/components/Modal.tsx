import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-md">
        <button
          onClick={onClose}
          className="text-gray-medium absolute top-2 right-2"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
