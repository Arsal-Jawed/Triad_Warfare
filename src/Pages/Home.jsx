import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDragon, FaBolt, FaShieldHalved, FaSkull } from "react-icons/fa6";

function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleStart = () => setShowPopup(true);

    const handleBattle = () => {
        if (username.trim() !== "") {
            navigate(`/battle?username=${username}`);
        }
    };

    return (
        <div className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
             style={{ backgroundImage: "url('/images/background.jpg')" }}>
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-80"></div>

            {/* 🔥 Flickering Red Light */}
            <div className="absolute inset-0 mix-blend-overlay bg-red-600 opacity-10 animate-pulse"></div>

            {/* ⚔️ Floating War Effects */}
            <div className="absolute inset-0 flex justify-between items-center px-20 text-yellow-400 text-8xl opacity-30">
                <FaDragon className="animate-float" />
                <FaShieldHalved className="animate-spin-slow" />
            </div>

            {/* ✨ Fire Particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute bottom-10 left-10 w-2 h-2 bg-orange-500 animate-particle"></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-red-500 animate-particle"></div>
                <div className="absolute top-20 left-1/2 w-1.5 h-1.5 bg-yellow-400 animate-particle"></div>
            </div>

            {/* 🔥 Main Container */}
            <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-6">
                
                {/* ⚡ Title */}
                <h1 className="text-7xl ml-[6vw] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-2xl flex items-center gap-4 relative">
                    <FaSkull className="text-8xl absolute -left-20 top-1 animate-pulse" /> Triad Warfare 
                    <FaShieldHalved className="text-8xl animate-wiggle" />
                </h1>

                {/* 🛡️ Subtitle */}
                <p className="text-lg text-white bg-white bg-opacity-10 px-6 py-3 rounded-full backdrop-blur-lg shadow-2xl">
                    Only the bravest warriors will survive this battle!
                </p>

                {/* ⚔️ Start Button */}
                <button onClick={handleStart} 
                    className="text-white text-2xl font-bold px-14 py-5 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-red-500 hover:to-yellow-400 rounded-full shadow-2xl transform hover:scale-125 transition-all flex items-center gap-3 border-2 border-yellow-400 animate-glow">
                    <FaBolt className="text-4xl animate-bounce" /> Start War
                </button>
            </div>

            {/* 🏹 Pop-up */}
            {showPopup && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="bg-white bg-opacity-10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center animate-popup">
                        <h2 className="text-yellow-300 text-4xl font-extrabold mb-4">Enter Your Name, Warrior!</h2>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-72 p-4 rounded-lg bg-black bg-opacity-50 text-white border-2 border-yellow-400 text-center focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg" 
                            placeholder="Your Name..." />
                        <button onClick={handleBattle} 
                            className="mt-6 px-12 py-4 bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold text-xl rounded-full shadow-xl hover:from-red-500 hover:to-yellow-400 transform hover:scale-110 transition-all animate-glow">
                            Enter Battle ⚔️
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;