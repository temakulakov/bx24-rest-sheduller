import React from "react";
import styles from "../../../styles/Header.module.scss";
import {useRecoilState} from "recoil";
import {dateAtom, modaAtom} from "../../../store/atoms";
import {Month, WeekDay} from "../../../store/consts";
import dayjs from "dayjs";
import {Button, ButtonGroup} from "@mui/material";
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import TimeLine from './TimeLine/TimeLine';

const Header = () => {
    const [date, setDate] = useRecoilState(dateAtom);

    const actionDate = (action: "back" | "today" | "next"): void => {
        switch (action) {
            case "back":
                setDate((currentDate) => currentDate.subtract(1, 'day'));
                break;
            case "today":
                setDate(() => dayjs());
                break;
            case "next":
                setDate((currentDate) => currentDate.add(1, 'day'));
                break;
        }
    };

    const Buttons: Array<JSX.Element> = [
        <Button key="one" onClick={() => actionDate("back")}><KeyboardArrowLeftRoundedIcon/></Button>,
        <Button key="two" onClick={() => actionDate("today")}>{"Сегодня"}</Button>,
        <Button key="three" onClick={() => actionDate("next")}><KeyboardArrowLeftRoundedIcon style={{rotate: '180deg'}}/></Button>,
    ];

    const [modal, setModal] = useRecoilState(modaAtom);

    return <>
        <div className={styles.root}>
            <h3>{date.date()} {Month[date.month()]} {date.year()} {WeekDay[date.day()]}</h3>
            <div className={styles.buttons}>
                <Button
                    color="secondary"
                    variant="outlined"
                    endIcon={<AssessmentOutlinedIcon/>}
                    className={styles.report}
                    onClick={() => setModal(prev => ({...prev, status: !prev.status}))}
                >{"Отчет"}</Button>
                <ButtonGroup
                    color="secondary"
                    orientation="horizontal"
                    variant="outlined"
                >
                    {Buttons}
                </ButtonGroup>
            </div>
        </div>

    </>
};

export default Header;