// components/ToastNotification.js
'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

// Renamed from Notification to ToastNotification to avoid conflict with the browser's native Notification API.
export default function ToastNotification({ show, message, type }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            // Delay hiding for the exit animation
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible && !show) return null;

    const baseStyle = "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300";
    const transformStyle = show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";

    const typeStyles = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        loading: "bg-blue-500 text-white",
    };

    const icons = {
        success: <CheckCircle />,
        error: <XCircle />,
        loading: <Loader className="animate-spin" />,
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type]} ${transformStyle}`}>
            {icons[type]}
            <span>{message}</span>
        </div>
    );
}
