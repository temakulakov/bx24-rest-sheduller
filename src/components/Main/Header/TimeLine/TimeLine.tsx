import React from 'react';
import styles from '../../../../styles/TimeLine.module.scss';

const TimeLine = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    const hours = Array.from({ length: 24 }, (_, index) => `${index}:00`);
    return <div className={styles.root}  ref={ref}>
        <div className={styles.timeLine}>
            {hours.map((hour, index) => (
                <div key={index} className={styles.element}>
                    {hour}
                </div>
            ))}
        </div>
    </div>
});

export default TimeLine;