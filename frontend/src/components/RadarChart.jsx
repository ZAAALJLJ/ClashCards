import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend} from 'chart.js';

ChartJS.register( RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend );

const RadarChart = ({ userData, labels, fullLabels }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Performance',
        data: userData,
        backgroundColor: 'rgba(108, 229, 232, 0.6)', 
        borderColor: '#6ce5e8', 
        borderWidth: 2,
        pointBackgroundColor: '#6ce5e8',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
        tooltip: {
            enabled: true,
            callbacks: {
                title: (tooltipItems) => {
                    const index = tooltipItems[0].dataIndex; 
                    return fullLabels[index];
                },
                label: (tooltipItem) => {
                    return `${tooltipItem.raw}%`;
                },
          },
        },
        legend: {
            display: false,
        },
      },
    scales: {
      r: {
        angleLines: { 
            display: true, 
            lineWidth: 2, 
            color: 'rgba(255, 255, 255, 0.2)',  
            borderDash: [5, 5], 
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            color: '#ffffff'
        },
        grid: {
            color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
            color: '#ffffff',
            font: {
                size: 14
          }
        }
      }
    }
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;
