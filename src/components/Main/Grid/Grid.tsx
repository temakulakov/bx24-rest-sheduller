import React from 'react';
import styles from '../../../styles/Grid.module.scss';
const Grid: React.FC = () => {
    const hours = Array.from({ length: 24 }, (_, index) => `${index}:00`);

    return (
        <div className={styles.container}>

        </div>
    );
};

export default Grid;