import React, { useEffect, useState, useRef } from 'react';
import '../css/BattleTimer.css';


const BattleTimer = ({ totalTime, onTimeUp }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeElapsed > totalTime) {
      clearInterval(timerRef.current);

      // SAFELY call onTimeUp after render
      onTimeUp?.();
    }
  }, [timeElapsed, totalTime, onTimeUp]);

  const timeRemaining = totalTime - timeElapsed;
  const progressPercentage = (timeElapsed / totalTime) * 100;

  // const formatTime = (seconds) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  // };

  return (
    <div className="battle-timer-container">
      <div className={`battle-timer-track ${timeRemaining <= 10 ? 'urgent' : ''}`}>
      <div 
        className={`battle-timer-progress ${timeRemaining <= 10 ? 'urgent' : ''}`}
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