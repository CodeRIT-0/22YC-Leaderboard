import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaStar, FaArrowUp, FaArrowDown, FaSyncAlt, FaBolt, FaFire } from "react-icons/fa";
import {useWindowSize} from 'react-use';
import Confetti from 'react-confetti';

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const {width,height}=useWindowSize();

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://coderit-leaderboard-apis.onrender.com/user/get-all-teams');
      if (!response.ok) throw new Error('Failed to fetch leaderboard data');

      const data = await response.json();
      let teamsArray = Array.isArray(data.teams) ? data.teams : [];

      const sortedTeams = teamsArray
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({
          ...team,
          position: index + 1,
          positionChange: team.previousPosition
            ? team.previousPosition - (index + 1)
            : 0
        }));

      setTeams(sortedTeams);
      setLastUpdated(new Date());

      if (sortedTeams.length > 0 && sortedTeams[0].points > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
   
  }, []);

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2: return "bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 text-white";
      case 3: return "bg-gradient-to-r from-amber-500 to-amber-700 text-white";
      case 4: return "bg-gradient-to-r from-blue-800 to-blue-900 text-white";
      case 5: return "bg-gradient-to-r from-indigo-700 to-indigo-900 text-white";
      default: return "bg-gradient-to-r from-slate-700 to-slate-900 text-white";
    }
  };

  const renderPositionIcon = (position) => {
    switch (position) {
      case 1: return <FaTrophy className="text-yellow-300 text-3xl" />;
      case 2: return <FaMedal className="text-slate-100 text-3xl" />;
      case 3: return <FaMedal className="text-amber-600 text-3xl" />;
      default: return <span className="font-bold text-xl">{position}</span>;
    }
  };

  const renderPositionChange = (change) => {
    if (change > 0) {
      return <div className="flex items-center text-green-600 text-sm"><FaArrowUp className="mr-1" />{change}</div>;
    } else if (change < 0) {
      return <div className="flex items-center text-red-600 text-sm"><FaArrowDown className="mr-1" />{Math.abs(change)}</div>;
    }
    return null;
  };

  // Mock data for display purposes
  const mockTeams = [
    { _id: '1', team_name: 'ref', points: 9469, position: 1, positionChange: 0 },
    { _id: '2', team_name: 'yegrfy', points: 8436, position: 2, positionChange: 0 },
    { _id: '3', team_name: 'aed', points: 5970, position: 3, positionChange: 1 },
    { _id: '4', team_name: 'wed', points: 5960, position: 4, positionChange: -1 },
    { _id: '5', team_name: 'rf', points: 2495, position: 5, positionChange: 0 },
  ];

  
  const displayTeams = teams.length > 0 ? teams : mockTeams;

 
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const confettiElements = [];
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 5;
      const size = Math.random() * 10 + 5;
      const color = ['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)];
      
      confettiElements.push(
        <div 
          key={i}
          className={`absolute top-0 ${color} rounded-sm animate-confetti-fall`} 
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size * 0.4}px`,
            animationDelay: `${animationDelay}s`
          }}
        />
      );
    }
    return confettiElements;
  };

  return (
    <>
     {showConfetti && <Confetti width={width} height={height} numberOfPieces={100} recycle={false} />}
     <div className="min-h-screen w-full relative font-sans text-white overflow-hidden">
     
     <style jsx>{`
       @keyframes confetti-fall {
         0% { transform: translateY(-10vh) rotate(0deg); }
         100% { transform: translateY(100vh) rotate(360deg); }
       }
       .animate-confetti-fall {
         animation: confetti-fall 5s linear forwards;
       }
       .animate-float {
         animation: float 8s ease-in-out infinite;
       }
       @keyframes float {
         0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-20px); }
       }
       .animate-spin-slow {
         animation: spin 4s linear infinite;
       }
       @keyframes spin {
         from { transform: rotate(0deg); }
         to { transform: rotate(360deg); }
       }
     `}</style>

     
     <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-green-800 overflow-hidden">
       
       <div className="absolute left-1/2 top-0 bottom-0 w-40 -translate-x-1/2 bg-green-700"></div>
       
      
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-96 bg-gradient-to-b from-yellow-100 to-yellow-200 opacity-80"></div>
       
      
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 w-60 h-4 bg-white opacity-60"></div>
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/4 w-60 h-4 bg-white opacity-60"></div>
       
     
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-white border-opacity-20"></div>
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-white border-opacity-20"></div>
       
      
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl max-h-5xl rounded-full border-8 border-white border-opacity-10"></div>
     </div>
     
   
     <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-red-600 opacity-30 animate-bounce"></div>
     <div className="absolute top-1/4 right-20 w-6 h-6 rounded-full bg-red-600 opacity-20 animate-bounce delay-200"></div>
     <div className="absolute bottom-1/3 left-1/4 w-10 h-10 rounded-full bg-red-600 opacity-25 animate-bounce delay-300"></div>
     <div className="absolute bottom-20 right-1/3 w-7 h-7 rounded-full bg-red-600 opacity-15 animate-bounce delay-1000"></div>
     
     
     <div className="absolute top-1/2 left-1/2 -translate-x-20 -translate-y-1/2 flex space-x-2">
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
     </div>
     
     <div className="absolute top-1/2 left-1/2 translate-x-16 -translate-y-1/2 flex space-x-2">
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
       <div className="w-2 h-20 bg-white opacity-70 rounded-full"></div>
     </div>
     
   
     {renderConfetti()}
     
     
     <div className="relative z-10 min-h-screen w-full backdrop-blur-sm bg-green-900/60 p-6 md:p-10">
      
       <div className="absolute top-20 right-20 opacity-20 hidden md:block">
         <div className="w-16 h-48 bg-gradient-to-b from-yellow-700 to-yellow-900 rounded-t-full transform -rotate-45"></div>
         <FaBolt className="absolute top-40 right-8 text-yellow-500 text-4xl" />
       </div>
       <div className="absolute bottom-20 left-20 w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 opacity-30 hidden md:block">
         <div className="absolute top-1 left-3 w-2 h-2 rounded-full bg-white opacity-70"></div>
         <div className="absolute bottom-2 right-3 w-2 h-2 rounded-full bg-white opacity-70"></div>
       </div>

       <div className="text-center mb-10">
         <div className="relative inline-block">
           <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-red-400 drop-shadow-lg">
             🏏 22 Yards of Code
           </h1>
           <div className="absolute -top-8 -right-8 text-yellow-400 opacity-40 text-4xl animate-pulse">
             ✨
           </div>
           <div className="absolute -bottom-6 -left-8 text-yellow-400 opacity-40 text-4xl animate-pulse delay-1000">
             ✨
           </div>
         </div>
         <p className="text-sm md:text-lg text-green-100 mt-2 italic">
           Track your squad's run to the top!
         </p>
       </div>

       <div className="flex justify-between items-center text-green-100 mb-6 text-xs md:text-base">
         <span className="bg-green-950/50 px-4 py-2 rounded-full backdrop-blur-md">
           {lastUpdated ? `Updated at: ${lastUpdated.toLocaleTimeString()}` : "Fetching scores..."}
         </span>
         <button 
           onClick={fetchLeaderboardData}
           className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
         >
           <FaSyncAlt className="animate-spin-slow" /> Refresh
         </button>
       </div>

       <div className="space-y-4 max-w-4xl mx-auto">
         {loading && teams.length === 0 ? (
           <div className="text-center text-xl font-semibold animate-pulse text-green-100 bg-green-950/50 rounded-xl p-8 backdrop-blur-md">
             <div className="flex justify-center mb-3">
               <div className="animate-spin h-8 w-8 border-4 border-yellow-400 rounded-full border-t-transparent"></div>
             </div>
             Loading leaderboard...
           </div>
         ) : error ? (
           <div className="bg-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg">Error: {error}</div>
         ) : (
           displayTeams.map((team) => (
             <div
               key={team._id}
               className={`p-5 rounded-xl shadow-xl backdrop-blur-sm transition transform hover:scale-105 hover:shadow-2xl ${getPositionColor(team.position)} overflow-hidden relative`}
             >
               {team.position === 2 && (
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
               )}
               {team.position === 2 && (
                 <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
               )}
               {team.position === 2 && (
                 <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400/10 rounded-full blur-lg"></div>
               )}
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className={`${team.position === 2 ? 'bg-gradient-to-br from-slate-200 to-slate-400' : 'bg-green-900'} text-3xl shadow-lg rounded-full p-2 bg-opacity-60 relative`}>
                     {renderPositionIcon(team.position)}
                     {team.position <= 3 && (
                       <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 animate-ping opacity-70"></div>
                     )}
                   </div>
                   <div>
                     <h2 className="text-xl md:text-2xl font-bold">{team.team_name}</h2>
                     {renderPositionChange(team.positionChange)}
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-3xl font-extrabold">{team.points}</div>
                   <div className="text-sm text-green-100">Points</div>
                 </div>
               </div>
             </div>
           ))
         )}

         {teams.length === 0 && !loading && displayTeams.length === 0 && (
           <div className="bg-white/90 text-gray-700 rounded-lg p-6 text-center shadow-xl">
             No teams on the field yet. Check back after the next innings!
           </div>
         )}
       </div>

      
       <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-950 to-transparent opacity-50"></div>
       
      
       <div className="absolute -top-10 left-10 text-yellow-400 opacity-10 text-8xl hidden md:block">
         <FaStar />
       </div>
       <div className="absolute -bottom-20 right-10 text-yellow-400 opacity-10 text-8xl hidden md:block">
         <FaTrophy />
       </div>
       <div className="absolute bottom-40 left-1/4 text-red-500 opacity-10 text-6xl hidden md:block">
         <FaFire />
       </div>
       
      
       <div className="text-center text-green-200/60 text-xs mt-8 relative z-20">
         © 2025  CodeRIT • All rights reserved
       </div>
     </div>
   </div>

    </>
   
  );
}