import React from "react";

const HorizontalMobileView = () => {
    return ( 
        <div className="px-6 md:px-20 py-12 md:py-28 flex flex-col md:flex-row items-center justify-center gap-20 bg-gray-900 text-white">
            {/* Left Side - Text Content */}
            <div className="max-w-lg text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-indigo-400">
                    Get Product at the speed of thought
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-300">
                    Get the best product recommendations tailored to your needs. Find nearby dealers and make informed decisions effortlessly.
                </p>
            </div>

            {/* Right Side - Mobile Video */}
            <div className="relative w-[22rem] md:w-[35rem] h-48 md:h-80 bg-black rounded-[40px] shadow-2xl overflow-hidden border-gray-700 border-[8px] transform transition-all duration-200 hover:shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-lg flex justify-center items-center">
                    <div className="w-8 h-2 bg-gray-800 rounded-full"></div>
                </div>
                {/* Video */}
                <video
                    className="absolute top-6 w-full h-[calc(100%-4rem)] object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source 
                        src="https://www.shutterstock.com/shutterstock/videos/3655060293/preview/stock-footage-artificial-intelligence-suggesting-products-to-ecommerce-customers-ai-driven-ecommerce-website-ai.webm" 
                        type="video/mp4" 
                    />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default HorizontalMobileView;
