import React, { useState } from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import styles from '../../styles/CalendarEvent.module.scss';

interface CalendarEventProps {
    id: number;
    title: string;
    top: number;
    height: number;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ id, title, top, height }) => {
    const [eventStyle, setEventStyle] = useState({
        top: `${top}px`,
        height: `${height}px`,
    });

    // Тип для данных о перемещении
    interface DragData {
        startX: number;
        startY: number;
    }

    const handleResizeStop = (e: any, data: ResizeCallbackData) => {
        const { size } = data;
        setEventStyle((prevStyle) => ({
            ...prevStyle,
            height: `${size.height}px`,
        }));
    };

    return (
        <ResizableBox
            width={200} // Фиксированная ширина
            height={parseInt(eventStyle.height, 10)}
            minConstraints={[200, 100]} // Минимальные размеры
            maxConstraints={[200, Infinity]} // Максимальные размеры
            className={styles.resizeContainer}
            handle={<span className={styles.resizeHandle} />}
            onResizeStop={handleResizeStop}
            resizeHandles={['se']}
        >
            <div
                style={{ ...eventStyle }}
                className={styles.event}
            >
                {title}
            </div>
        </ResizableBox>
    );
};

export default CalendarEvent;
