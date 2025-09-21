"use client"

import React from 'react';
import { Palette } from "lucide-react";

const loadingMessages = [
    "Analyzing color theory...",
    "Consulting the color wheel...",
    "Mixing digital paints...",
    "Generating harmonic combinations...",
    "Checking for accessibility...",
    "Perfecting the pigments...",
    "Crafting beautiful palettes...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="flex flex-col items-center justify-center p-16 glass rounded-2xl border border-border/50 shadow-2xl">
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
                <svg className="absolute inset-0 w-16 h-16 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-2 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 animate-ping"></div>
            </div>
            <p className="text-xl font-semibold text-foreground transition-all duration-500 text-center animate-fade-in">{message}</p>
            <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                </div>
    );
};
