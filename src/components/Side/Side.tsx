import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {dateAtom} from "../../store/atoms";
import {useRecoilState} from "recoil";
import styles from "../../styles/Side.module.scss";
import 'dayjs/locale/ru';


export default function Side() {
    const [date, setDate] = useRecoilState(dateAtom);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
            <DateCalendar
                value={date}
                onChange={(newValue) => setDate(newValue)}
                className={styles.root}
            />
        </LocalizationProvider>
    );
}