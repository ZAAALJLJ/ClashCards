import React from 'react';
import '../css/ProgressBarStatistics.css';

function ProgressBarStatistics({ progressPercentage }) {
    return (
      <div className="total-statistics-container">
        <div className="total-progress-track">
          <div 
            className="statistics-progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }
  
  export default ProgressBarStatistics;