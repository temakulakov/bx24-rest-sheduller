import React from 'react';
import styles from '../../styles/ProgressBar.module.scss'; // Предполагается, что стили определены в этом файле

interface ProgressBarProps {
    value: number; // Значение прогресса от 0 до 100
    color: string;
    height: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, height }) => {
    // Ограничение значения прогресса между 0 и 100
    const progressValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className={styles.root} style={{height: `${height}px`}}>
            <div className={styles.filler} style={{ width: `${progressValue}%`, backgroundColor: color, height: `${height}px` }}></div>
        </div>
    );
};

export default ProgressBar;
