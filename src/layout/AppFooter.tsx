import React from "react";

const AppFooter: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t dark:bg-gray-900 dark:border-gray-800 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
                <div className="flex text-center items-center justify-center text-sm text-gray-600 dark:text-gray-300 leading-none">
                    © {year} — NICE, Conceptualized by Zeeshan Khan (Dir Comms), Developed by Muhammad Baseer Khan (AD IT)
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
