
    const BadgeCross = () => {
    return (
        <>
            <div className="inline-flex items-center bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                <span className="mr-2">Badge</span>
                <button
                    type="button"
                    aria-label="remove badge"
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </>
    )
    }

    export default BadgeCross