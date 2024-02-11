import React, {useEffect, useRef} from "react";
import styles from "../../styles/Main.module.scss";
import Header from "./Header/Header";
import Sections from "./Sections/Sections";
import Grid from "./Grid/Grid";
import TimeLine from "./Header/TimeLine/TimeLine";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import dayjs from "dayjs";

const Main = () => {

    // Создаем ссылки для двух контейнеров
    const timeLineContainerRef = useRef<HTMLDivElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);

    const [scrollPositionX, setScrollPositionX] = React.useState(3600 / 24 * (dayjs().hour() - 2));
    const [intervalId, setIntervalId] = React.useState<NodeJS.Timer | null>(null);

    React.useEffect(() => {

        if (timeLineContainerRef.current && gridContainerRef.current) {
            timeLineContainerRef.current.addEventListener('scroll', () => {
                if (timeLineContainerRef.current) {
                    setScrollPositionX(timeLineContainerRef.current.scrollLeft);
                }
            });
            gridContainerRef.current.addEventListener('scroll', () => {
                if (gridContainerRef.current) {
                    setScrollPositionX(gridContainerRef.current.scrollLeft);
                }
            });
        }
    }, []);

    React.useEffect(() => {
        if (timeLineContainerRef.current && gridContainerRef.current) {
            timeLineContainerRef.current.scrollLeft = scrollPositionX;
            gridContainerRef.current.scrollLeft = scrollPositionX;
        }
        // console.log("scrollPositionX");
        // console.log(scrollPositionX);
    }, [scrollPositionX]);


    return <div className={styles.root}>
        <div className={styles.header}>
            <Header/>
        </div>

        <div className={styles.body}>
            <div className={styles.timeLine}>
                <TimeLine ref={timeLineContainerRef}/>
            </div>
            <div className={styles.grid} >
                <CalendarGrid ref={gridContainerRef}/>
            </div>
        </div>
    </div>
};

export default Main;