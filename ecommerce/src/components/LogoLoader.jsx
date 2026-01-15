const LogoLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] space-y-6">
            <div className="relative">
                {/* Logo with fade in/out animation - Extra large size */}
                <img
                    src="/logo.png"
                    alt="Blooming Logo"
                    className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain logo-fade"
                    onError={(e) => {
                        // Fallback to a simple text logo if image fails
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                    }}
                />
                
                {/* Fallback text logo */}
                <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 hidden items-center justify-center bg-purple-100 rounded-full text-purple-600 font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl logo-fade">
                    B
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-purple-400 rounded-full opacity-20 blur-lg logo-glow" />
            </div>
            
           
            
            {/* Internal styles */}
            <style>
                {`
                    .logo-fade {
                        animation: logoFade 1.5s ease-in-out infinite;
                    }
                    
                    .logo-glow {
                        animation: logoGlow 1.5s ease-in-out infinite;
                    }
                    
                    .logo-text {
                        animation: textFade 2s ease-in-out infinite;
                    }
                    
                    .dot-1 {
                        animation: dotBounce 1.4s infinite ease-in-out;
                    }
                    
                    .dot-2 {
                        animation: dotBounce 1.4s infinite ease-in-out 0.2s;
                    }
                    
                    .dot-3 {
                        animation: dotBounce 1.4s infinite ease-in-out 0.4s;
                    }
                    
                    @keyframes logoFade {
                        0%, 100% { 
                            opacity: 0.4; 
                            transform: scale(0.95); 
                        }
                        50% { 
                            opacity: 1; 
                            transform: scale(1); 
                        }
                    }
                    
                    @keyframes logoGlow {
                        0%, 100% { 
                            opacity: 0.1; 
                            transform: scale(0.9); 
                        }
                        50% { 
                            opacity: 0.3; 
                            transform: scale(1.1); 
                        }
                    }
                    
                    @keyframes textFade {
                        0%, 100% { 
                            opacity: 0.6; 
                        }
                        50% { 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes dotBounce {
                        0%, 80%, 100% { 
                            transform: scale(0.8); 
                            opacity: 0.5; 
                        }
                        40% { 
                            transform: scale(1.2); 
                            opacity: 1; 
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LogoLoader;
