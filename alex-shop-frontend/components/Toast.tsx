"use client";

import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-20 right-6 px-6 py-4 rounded-2xl text-sm tracking-wide shadow-xl backdrop-blur-md border
            ${type === "success"
                ? "bg-green-500/20 border-green-400/30 text-green-800"
                : "bg-red-500/20 border-red-400/30 text-red-800"}`}>
            {message}
        </div>
    );
}
