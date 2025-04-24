import React, { useEffect, useState } from 'react';
import '../css/BattleTimer.css';

const BattleTimer = ({ totalTime , onTimeUp }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= totalTime) {
          clearInterval(timer);
          onTimeUp?.(); 
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, onTimeUp]);

//   const timeRemaining = totalTime - timeElapsed;
  const progressPercentage = (timeElapsed / totalTime) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="battle-timer-container">
      <div className="battle-timer-track">
        <div 
          className="battle-timer-progress"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {/* <div className="battle-timer-text">
        {formatTime(timeRemaining)}
      </div> */}
    </div>
  );
};

export default BattleTimer;