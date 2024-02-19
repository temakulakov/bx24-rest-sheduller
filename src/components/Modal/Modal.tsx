import React from 'react';
import styles from "../../styles/Modal.module.scss";
import {useRecoilState} from "recoil";
import {modaAtom, sectionsGroupsAtom} from "../../store/atoms";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiModal from "@mui/material/Modal";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendar, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers"; // Импортировать Modal как MuiModal
import 'dayjs/locale/ru';
import {addCalendarEvent} from "../../services/bx24-rest-webhooks/addEvent";
import {Button, Chip} from "@mui/material";
import {Month, WeekDay} from "../../store/consts";
import Report from "./Report/Report";
import {getEvents} from "../../services/bx24-rest-webhooks/fetchEvents";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 'fit-content',
    bgcolor: 'white',
    borderRadius: '13px',
    boxShadow: 24,
    p: 4,
};

const CustomModal = () => { // Переименовать компонент, чтобы избежать конфликта имен
    const [modal, setModal] = useRecoilState(modaAtom);
    const [loading, setLoading] = React.useState(false);
    const [groups, setGroups] = useRecoilState(sectionsGroupsAtom);

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const steps = [
        {
            label: 'Выберите филиалы, которые хотите добавить в отчет',
            description: "",
            // description: <Autocomplete
            //     multiple
            //     options={groups}
            //     value={}
            //     onChange={(event, newValue) => {
            //         setSelectedUsers(newValue);
            //         setSelectedEvent((prevState) => {
            //             if (prevState) {
            //                 return {
            //                     ...prevState,
            //                     ATTENDEE_LIST: newValue.map((user) => ({
            //                         id: parseInt(user.ID), // Преобразование строки в число
            //                         entryId: prevState.ID,
            //                         status: "H"
            //                     }))
            //                 };
            //             }
            //             return prevState;
            //         })
            //     }}
            //     getOptionLabel={(option) => `${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
            //     renderTags={(tagValue, getTagProps) =>
            //         tagValue.map((option, index) => (
            //             <Chip
            //                 label={`${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
            //                 {...getTagProps({index})}
            //                 onDelete={() => {
            //                     // setSelectedUsers(currentSelectedUsers =>
            //                     //     currentSelectedUsers.filter(user => user.ID !== option.ID)
            //                     // );
            //                     setSelectedEvent((prevState) => {
            //                         if (prevState) {
            //                             return {
            //                                 ...prevState,
            //                                 ATTENDEE_LIST: prevState.ATTENDEE_LIST.filter((attendee) => attendee.id.toString() !== option.ID)
            //                             }
            //                         } else return null;
            //                     })
            //                 }}
            //                 avatar={
            //                     <img
            //                         loading="lazy"
            //                         width="20"
            //                         height="20"
            //                         style={{borderRadius: '50%', marginRight: "0"}}
            //                         src={option.PERSONAL_PHOTO || 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'} // Укажите путь к изображению по умолчанию, если PERSONAL_PHOTO отсутствует
            //                         alt=""
            //                     />
            //                 }
            //             />
            //         ))
            //     }
            //     renderOption={(props, option) => (
            //         <Box component="li" {...props}>
            //             <img
            //                 loading="lazy"
            //                 width="20"
            //                 height="20"
            //                 style={{borderRadius: '50%', marginRight: "5px"}}
            //                 src={option.PERSONAL_PHOTO || 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'} // Укажите путь к изображению по умолчанию, если PERSONAL_PHOTO отсутствует
            //                 alt=""
            //             />
            //             {`${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
            //         </Box>
            //     )}
            //     renderInput={(params) => (
            //         <TextField
            //             placeholder={"Добавить сотрудника"}
            //             {...params}
            //             label="Выберите участников"
            //             inputProps={{
            //                 ...params.inputProps,
            //                 autoComplete: 'new-password', // disable autocomplete and autofill
            //             }}
            //         />
            //     )}
            // />,
        },
        {
            label: 'Выберите промежуток для отчета',
            description:
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
                    <div className={styles.dateTimeRangeRoot}>
                        {/*<h3>{`${modal.from.date()} ${Month[modal.from.month()]} ${modal.from.year()} ${WeekDay[modal.from.day()]}`}</h3>*/}
                        <DateCalendar value={modal.from} onChange={(newValue) => setModal({...modal, from: newValue})} maxDate={modal.to} views={['month', 'day']}/>
                        {/*<h3>{`${modal.to.date()} ${Month[modal.to.month()]} ${modal.to.year()} ${WeekDay[modal.to.day()]}`}</h3>*/}
                        <DateCalendar value={modal.to} onChange={(newValue) => setModal({...modal, to: newValue})} minDate={modal.from} views={['month', 'day']}/>
                    </div>
                </LocalizationProvider>
            ,
        },
        {
            label: 'Выберите тип графика',
            description: ``,
        },
    ];

    return (
        <MuiModal // Использовать MuiModal здесь
            open={modal.status}
            onClose={() => {
                setModal(prev => ({
                    ...prev,
                    status: false,
                    from: dayjs().subtract(1, 'month'),
                    to: dayjs(),
                    events: []
                }));
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={styles.root}
        >
            <Box sx={style} className={styles.container}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                optional={
                                    index === 2 ? (
                                        <Typography variant="caption">Последний шаг</Typography>
                                    ) : null
                                }
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                {step.description}
                                <Box sx={{mb: 2}}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{mt: 1, mr: 1}}
                                        >
                                            {index === steps.length - 1 ? 'Сформировать отчет' : 'Далее'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{mt: 1, mr: 1}}
                                        >
                                            Назад
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{p: 3}}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset} sx={{mt: 1, mr: 1}}>
                            Reset
                        </Button>
                    </Paper>
                )}
            </Box>
            {/*<Box sx={style} className={styles.container}>*/}
            {/*    <Typography id="modal-modal-title" variant="h6" component="h2">*/}
            {/*        Формирование отчета*/}
            {/*    </Typography>*/}
            {/*    <Typography id="modal-modal-description" sx={{mt: 2}}>*/}
            {/*        Выберите промежуток*/}
            {/*    </Typography>*/}
            {/*    <div className={styles.dateTime}>*/}

            {/*    </div>*/}
            {/*    <Button variant="contained" color="success" className={styles.btnGenerate} onClick={() => {*/}
            {/*        setLoading(true);*/}
            {/*        getEvents(modal.from, modal.to).then((events) => {*/}
            {/*            setModal(prev => ({...prev, events: events}));*/}
            {/*        });*/}
            {/*    }}>*/}
            {/*        {!loading ? "Сформировать отчет" : "Формирование отчета"}*/}
            {/*    </Button>*/}
            {/*    {*/}
            {/*        Boolean(modal.events.length) && <Report/>*/}
            {/*    }*/}
            {/*</Box>*/}
        </MuiModal>
    );
};

export default CustomModal;
