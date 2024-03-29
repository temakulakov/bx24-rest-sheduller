    import React, {useEffect, useRef, useState} from 'react';
    import '../../styles/SlidePanel.scss';
    import {IEvent, ISection, IUsers} from "../../types/Api"; // Импортируем стили
    import Box from '@mui/material/Box';
    import TextField from '@mui/material/TextField';
    import Autocomplete from '@mui/material/Autocomplete';
    import {useRecoilState, useRecoilValue} from "recoil";
    import {eventsAtom, sectionsGroupsAtom, selectedEventAtom, usersAtom} from "../../store/atoms";
    import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
    import dayjs from "dayjs";
    import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
    import 'dayjs/locale/ru';
    import {Button, Chip} from "@mui/material";
    import styles from "../../styles/SideBar.module.scss";
    import DescriptionEditor from "../../features/DescriptionEditor/DescriptionEditor";
    import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
    import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
    import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
    import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
    import FileUploader from "../../features/FileUploader/FileUploader";
    import {updateCalendarEvent} from "../../services/bx24-rest-webhooks/updateEvent";
    import {deleteCalendarEvent} from "../../services/bx24-rest-webhooks/deleteEvent";
    import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
    import {addCalendarEvent} from "../../services/bx24-rest-webhooks/addEvent";
    import {Month, WeekDay} from "../../store/consts";

    interface SlidePanelProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        newEvent: boolean;
    }

    const SlidePanel: React.FC<SlidePanelProps> = ({ isOpen, setIsOpen , newEvent}) => {
        const panelRef = useRef<HTMLDivElement>(null);
        const [events, setEvents] = useRecoilState(eventsAtom);
        const sectionsGroups = useRecoilValue(sectionsGroupsAtom);
        // const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(selectedEventt);
        const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventAtom);
        const users = useRecoilValue(usersAtom);
        const [selectedUsers, setSelectedUsers] = useState<IUsers[]>(selectedEvent?.ATTENDEE_LIST
            ?.map(el => users.find(user => user.ID === el.id.toString())) // Преобразование id из number в string для сравнения
            .filter((user): user is IUsers => Boolean(user)) || []); // Типизированный guard фильтр для удаления undefined из типа


        function getMatchingUsers(events: IEvent, users: IUsers[]): IUsers[] {
            // Проверяем, существует ли ATTENDEE_LIST и он не пустой
            if (!events.ATTENDEE_LIST || events.ATTENDEE_LIST.length === 0) {
                return [];
            }

            // Фильтруем массив пользователей, чтобы найти совпадения
            const matchingUsers = users.filter(user =>
                events.ATTENDEE_LIST.some(attendee => attendee.id.toString() === user.ID)
            );

            return matchingUsers;
        }



        // Обработчик для клавиши Esc
        useEffect(() => {
            const handleEscClose = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setIsOpen(false);
                }
                // if (event.key === 'Enter') {
                //     setIsOpen(false);
                // }
            };

            window.addEventListener('keydown', handleEscClose);
            return () => {
                window.removeEventListener('keydown', handleEscClose);
            };

        }, [setIsOpen]);

        return (
            <div style={{zIndex: 1200}} className={`panel ${isOpen ? 'open' : ''}`} ref={panelRef}>
                {/* Содержимое панели */}
                {selectedEvent && (
                    <>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div className={styles.header}>
                                <div className={styles.round}
                                     style={{background: `${sectionsGroups.flatMap(group => group.sections).find(section => section.ID === selectedEvent?.SECTION_ID)?.COLOR}`}}></div>
                                <input
                                    className={styles.title}
                                    type="text"
                                    value={selectedEvent.NAME}
                                    onChange={(event) => {
                                        setSelectedEvent((prevState) => {
                                                if (!prevState) {
                                                    return null; // или возвращаем новый объект IEvent с заданным NAME
                                                }
                                                return {...prevState, NAME: event.target.value};
                                            }
                                        )
                                    }}
                                />
                            </div>
                            <div className={styles.row}>
                                <h3>Филиал: </h3><AccountBalanceRoundedIcon/>
                                <h3 style={{
                                    color: "#807185",
                                    fontWeight: "500"
                                }}>{sectionsGroups.find((group) => group.sections.find((section) => section.ID === selectedEvent.SECT_ID)) ? sectionsGroups.find((group) => group.sections.find((section) => section.ID === selectedEvent.SECT_ID))?.title : null}</h3>
                                {/*    <Autocomplete*/}
                                {/*    id="country-select-demo"*/}
                                {/*    sx={{width: 300}}*/}
                                {/*    options={sectionsGroups}*/}
                                {/*    autoHighlight*/}
                                {/*    value={sectionsGroups.find((group) => group.sections.find((section) => section.ID === selectedEvent.SECT_ID))}*/}
                                {/*    onChange={(event, newValue) => {*/}
                                {/*        if (!newValue) {*/}
                                {/*        } else {*/}
                                {/*            setSelectedEvent(prevState => {*/}
                                {/*                if (prevState === null) {*/}
                                {/*                    return null;*/}
                                {/*                }*/}
                                {/*                return {*/}
                                {/*                    ...prevState,*/}
                                {/*                    SECTION_ID: String(newValue.id),*/}
                                {/*                    SECT_ID: String(newValue.id)*/}
                                {/*                };*/}
                                {/*            });*/}
                                {/*        }*/}

                                {/*    }}*/}
                                {/*    getOptionLabel={(option) => option.title}*/}
                                {/*    renderOption={(props, option) => (*/}
                                {/*        <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>*/}
                                {/*            <div*/}
                                {/*                style={{*/}
                                {/*                    minWidth: "20px",*/}
                                {/*                    minHeight: "20px",*/}
                                {/*                    background: `${option.color}`,*/}
                                {/*                    borderRadius: "50%",*/}
                                {/*                    marginRight: "10px"*/}
                                {/*                }}*/}
                                {/*            />*/}
                                {/*            {option.title}*/}
                                {/*        </Box>*/}
                                {/*    )}*/}
                                {/*    renderInput={(params) => (*/}
                                {/*        <TextField*/}
                                {/*            {...params}*/}
                                {/*            label="Выберите филиал"*/}
                                {/*            inputProps={{*/}
                                {/*                ...params.inputProps,*/}
                                {/*                autoComplete: 'new-password', // disable autocomplete and autofill*/}
                                {/*            }}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*/>*/}


                            </div>
                            <div className={styles.row}>
                                <h3>Место: </h3><FmdGoodRoundedIcon/><Autocomplete
                                id="country-select-demo"
                                sx={{width: 300}}
                                options={sectionsGroups.reduce<ISection[]>((acc, el) => { // Явно указываем тип аккумулятора как ISection[]
                                    const hasSection = el.sections.some(section => section.ID === selectedEvent?.SECTION_ID);
                                    if (hasSection) {
                                        acc.push(...el.sections);
                                    }
                                    return acc;
                                }, [])} // Начальное значение - пустой массив ISection[]

                                autoHighlight
                                value={sectionsGroups.flatMap(group => group.sections).find(section => section.ID === selectedEvent?.SECTION_ID)}
                                onChange={(event, newValue) => {

                                    setSelectedEvent((prevstate) => {
                                        if (prevstate && newValue) {
                                            return {...prevstate, SECTION_ID: newValue.ID, SECT_ID: newValue.ID};
                                        }
                                        return prevstate;
                                    });
                                }}
                                getOptionLabel={(option) => `${option.NAME}`}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <div
                                            style={{
                                                minWidth: "20px",
                                                minHeight: "20px",
                                                background: option.COLOR,
                                                borderRadius: "50%",
                                                marginRight: "10px"
                                            }}
                                        />
                                        {option.NAME.replace(/\[.*?\]/g, '')}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Выберите филиал"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}

                                    />
                                )}
                            />
                            </div>


                            <div className={styles.row}><h3>Начало: </h3><AccessTimeFilledRoundedIcon/>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
                                    <DateTimePicker
                                        ampm={false}
                                        views={['month', 'day', 'hours', 'minutes']}
                                        maxDateTime={selectedEvent.DATE_TO}
                                        label={`${selectedEvent?.DATE_FROM.date()} ${Month[selectedEvent?.DATE_FROM.month()]} ${selectedEvent?.DATE_FROM.year()} ${WeekDay[selectedEvent?.DATE_FROM.day()]}`}
                                        value={selectedEvent?.DATE_FROM} // Убедитесь, что selectedEvent?.DATE_FROM корректно обрабатывается
                                        onChange={(newValue) => {
                                            setSelectedEvent((prev) => {
                                                if (!prev || !newValue) return prev; // Возвращаем prev, если оно равно null или newValue равно null

                                                return {...prev, DATE_FROM: newValue};
                                            });
                                        }}
                                        format="DD.MM.YYYY HH:mm"
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className={styles.row}>
                                <h3>Окончание: </h3><AccessTimeFilledRoundedIcon/>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ru"}>
                                    <DateTimePicker
                                        ampm={false}
                                        views={['month', 'day', 'hours', 'minutes']}
                                        minDateTime={selectedEvent.DATE_FROM}
                                        value={selectedEvent.DATE_TO}
                                        label={`${selectedEvent?.DATE_FROM.date()} ${Month[selectedEvent?.DATE_FROM.month()]} ${selectedEvent?.DATE_FROM.year()} ${WeekDay[selectedEvent?.DATE_FROM.day()]}`}
                                        onChange={(newValue, context) => {
                                            setSelectedEvent((prev) => {
                                                if (!prev) return prev;
                                                if (newValue) {
                                                    return {...prev, DATE_TO: newValue};
                                                }
                                                return prev;
                                            });
                                        }}

                                        format="DD.MM.YYYY HH:mm"
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className={styles.rowUsers}>
                                <h3>Участники:</h3><Groups2RoundedIcon/>
                                <Autocomplete
                                    multiple
                                    id="user-select-demo"
                                    options={users}
                                    value={getMatchingUsers(selectedEvent, users)}
                                    onChange={(event, newValue) => {
                                        setSelectedUsers(newValue);
                                        setSelectedEvent((prevState) => {
                                            if (prevState) {
                                                return {
                                                    ...prevState,
                                                    ATTENDEE_LIST: newValue.map((user) => ({
                                                        id: parseInt(user.ID), // Преобразование строки в число
                                                        entryId: prevState.ID,
                                                        status: "H"
                                                    }))
                                                };
                                            }
                                            return prevState;
                                        })
                                    }}
                                    getOptionLabel={(option) => `${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => (
                                            <Chip
                                                label={`${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
                                                {...getTagProps({index})}
                                                onDelete={() => {
                                                    // setSelectedUsers(currentSelectedUsers =>
                                                    //     currentSelectedUsers.filter(user => user.ID !== option.ID)
                                                    // );
                                                    setSelectedEvent((prevState) => {
                                                        if (prevState) {
                                                            return {
                                                                ...prevState,
                                                                ATTENDEE_LIST: prevState.ATTENDEE_LIST.filter((attendee) => attendee.id.toString() !== option.ID)
                                                            }
                                                        } else return null;
                                                    })
                                                }}
                                                avatar={
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        height="20"
                                                        style={{borderRadius: '50%', marginRight: "0"}}
                                                        src={option.PERSONAL_PHOTO || 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'} // Укажите путь к изображению по умолчанию, если PERSONAL_PHOTO отсутствует
                                                        alt=""
                                                    />
                                                }
                                            />
                                        ))
                                    }
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                height="20"
                                                style={{borderRadius: '50%', marginRight: "5px"}}
                                                src={option.PERSONAL_PHOTO || 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'} // Укажите путь к изображению по умолчанию, если PERSONAL_PHOTO отсутствует
                                                alt=""
                                            />
                                            {`${option.LAST_NAME} ${option.NAME} ${option.SECOND_NAME}`}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            placeholder={"Добавить сотрудника"}
                                            {...params}
                                            label="Выберите участников"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <h3>
                                Описание:
                                <textarea
                                    value={selectedEvent['~DESCRIPTION']}
                                    className={styles.description}
                                    style={{resize: 'none'}}

                                    onChange={(event) => {

                                        setSelectedEvent((prev) => {
                                            // Проверяем, что prev не null перед расширением объекта
                                            if (!prev) return null;

                                            // Обновляем описание, убедившись, что все обязательные поля присутствуют
                                            const updatedEvent: IEvent = {
                                                ...prev,
                                                '~DESCRIPTION': event.target.value,
                                                DESCRIPTION: event.target.value,
                                                // Убедитесь, что ID и другие обязательные поля имеют действующие значения
                                                ID: prev.ID || 'Некоторое значение по умолчанию',
                                            };

                                            return updatedEvent;
                                        });
                                    }}

                                />
                            </h3>


                            {
                                !newEvent && <>
                                    <h3>Прикрепленные документы: </h3>
                                    <FileUploader/>
                                </>
                            }

                        </div>
                        {
                            newEvent ?
                                <div className={styles.footer}>
                                    <Button variant="contained" color="success" onClick={() => {
                                        addCalendarEvent(selectedEvent)
                                            .then(data => {
                                                setEvents((prevState) => [...prevState, selectedEvent]);
                                            })
                                            .catch(error => console.error('Failed to update event', error));
                                        setIsOpen(false);
                                    }}>
                                        Создать
                                    </Button>

                                    <Button variant="outlined" color="error" onClick={() => {
                                        setIsOpen(false);
                                    }}>
                                        Отменить
                                    </Button>
                                </div>
                                :
                                <div className={styles.footer}>
                                    <Button variant="contained" color="success" onClick={() => {
                                        updateCalendarEvent(selectedEvent)
                                            .then(data => setEvents((prevState) => prevState.map((item) => {
                                                if (item.ID === selectedEvent.ID) {
                                                    return selectedEvent
                                                } else {
                                                    return item;
                                                }
                                            })))
                                            .catch(error => console.error('Failed to update event', error));
                                        setIsOpen(false);
                                    }}>
                                        Обновить
                                    </Button>

                                    <Button variant="outlined" color="error" onClick={() => {
                                        deleteCalendarEvent(selectedEvent)
                                            .then(data => setEvents((prevState) => prevState.filter((item) => item.ID !== selectedEvent.ID)))
                                            .catch(error => console.error('Failed to update event', error));
                                        setIsOpen(false);
                                    }}>
                                        Удалить
                                    </Button>
                                </div>
                        }
                    </>
                )}
            </div>
        );
    };

    export default SlidePanel;