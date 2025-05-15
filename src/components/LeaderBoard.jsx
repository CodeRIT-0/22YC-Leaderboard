import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Confetti from "react-confetti";

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(refreshInterval);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/user/get-all-teams');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const responseData = await response.json();
      console.log("API Response:", responseData.teams[0]);
      // console.log("Type:", typeof responseData);
      // Parse the data properly - it appears to be a string that needs parsing
      let teamsArray = [];
      
      // Check if the response is already an array
      if (Array.isArray(responseData.teams)) {
        teamsArray = responseData.teams;
      } 
      // If it's a string that looks like JSON objects
      // else if (typeof responseData === 'string') {
      //   try {
      //     // Try to convert the string to a proper JSON array
      //     const cleanedString = responseData.replace(/},\s*{/g, '},{');
      //     if (!cleanedString.startsWith('[')) {
      //       teamsArray = JSON.parse('[' + cleanedString + ']');
      //     } else {
      //       teamsArray = JSON.parse(cleanedString);
      //     }
      //   } catch (parseErr) {
      //     console.error("Error parsing teams data:", parseErr);
      //     // Fallback: try to extract objects using regex
      //     const matches = responseData.match(/{[^}]*}/g);
      //     if (matches) {
      //       teamsArray = matches.map(match => {
      //         try {
      //           return JSON.parse(match);
      //         } catch (e) {
      //           return null;
      //         }
      //       }).filter(Boolean);
      //     }
      //   }
      // }
      
      // Sort teams by points in descending order
      const sortedTeams = teamsArray
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({
          ...team,
          position: index + 1,
          // Calculate position change if previous position exists
          positionChange: team.previousPosition ? team.previousPosition - (index + 1) : 0
        }));
      
      setTeams(sortedTeams);
      setLastUpdated(new Date());
      setCountdown(refreshInterval);
      
      // Show confetti when there's a leader with points > 0
      if (sortedTeams.length > 0 && sortedTeams[0].points > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up interval for refreshing
  useEffect(() => {
    fetchLeaderboardData();
    
    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchLeaderboardData();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [refreshInterval]);

  // Function to determine the background color based on position
  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-300 to-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-800";
      default:
        return "bg-white";
    }
  };

  // Function to render position icon
  const renderPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-xl md:text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl md:text-2xl" />;
      case 3:
        return <FaMedal className="text-amber-700 text-xl md:text-2xl" />;
      default:
        return <span className="font-bold text-lg md:text-xl">{position}</span>;
    }
  };

  // Function to render position change indicator
  const renderPositionChange = (change) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600">
          <FaArrowUp className="mr-1" />
          <span className="text-xs">{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600">
          <FaArrowDown className="mr-1" />
          <span className="text-xs">{Math.abs(change)}</span>
        </div>
      );
    }
    return null;
  };

  // Function to display team members
  const displayTeamMembers = (team) => {
    const members = [team.team_member1, team.team_member2, team.team_member3]
      .filter(member => member && member.trim() !== '');
    
    if (members.length === 0) return 'Team';
    return members.join(', ');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 py-4 px-4 md:px-6 lg:px-12 flex flex-col">
      {showConfetti && 
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      }
      
      {/* Header */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 tracking-tight mb-2">
          Treasure Hunt Leaderboard
        </h1>
        <p className="text-blue-200 text-sm md:text-base">
          See who's leading the challenge!
        </p>
      </div>
      
      {/* Auto-refresh indicator */}
      <div className="flex justify-between items-center mb-4 text-blue-200 px-2 md:px-4">
        <div className="text-xs md:text-sm">
          {lastUpdated ? (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          ) : (
            <span>Loading latest data...</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs md:text-sm">Refreshing in: {countdown}s</span>
          <button 
            onClick={fetchLeaderboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs md:text-sm transition-colors duration-200"
          >
            Refresh Now
          </button>
        </div>
      </div>
      
      {/* Leaderboard */}
      <div className="flex-grow w-full max-w-6xl mx-auto">
        {loading && teams.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white font-bold animate-pulse">Loading leaderboard...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {teams.map((team) => (
              <div 
                key={team._id} 
                className={`
                  ${getPositionColor(team.position)} 
                  rounded-lg shadow-lg overflow-hidden
                  transform transition-all duration-300
                  hover:shadow-xl hover:scale-[1.01]
                  ${team.position <= 3 ? 'border-2 border-yellow-400' : ''}
                `}
              >
                <div className="flex items-center p-4">
                  {/* Position and Icon */}
                  <div className="flex flex-col items-center mr-4 w-12">
                    {renderPositionIcon(team.position)}
                    {renderPositionChange(team.positionChange)}
                  </div>
                  
                  {/* Team Details */}
                  <div className="flex-grow">
                    <h3 className={`font-bold ${team.position <= 3 ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
                      {team.team_name}
                    </h3>
                    <p className="text-gray-600 text-sm">{displayTeamMembers(team)}</p>
                  </div>
                  
                  {/* Points */}
                  <div className="text-right">
                    <div className={`font-bold ${team.position <= 3 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
                      {team.points}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
                
                {/* Decoration for top positions */}
                {team.position === 1 && (
                  <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
                )}
                {team.position === 2 && (
                  <div className="h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
                )}
                {team.position === 3 && (
                  <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600"></div>
                )}
              </div>
            ))}
            
            {teams.length === 0 && !loading && (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-600">No teams found. Check back later!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="fixed top-10 left-10 text-yellow-400 opacity-10 text-7xl hidden md:block">
        <FaStar />
      </div>
      <div className="fixed bottom-10 right-10 text-yellow-400 opacity-10 text-7xl hidden md:block">
        <FaTrophy />
      </div>
    </div>
  );
}