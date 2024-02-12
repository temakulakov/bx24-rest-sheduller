// CalendarGrid.tsx
import React, {useEffect} from 'react';
import styles from '../../styles/CalendarGrid.module.scss';
import {useRecoilState, useRecoilValue} from "recoil";
import {dateAtom, eventsAtom, sectionsAtom, sectionsGroupsAtom, selectedEventAtom} from "../../store/atoms";
import dayjs, {Dayjs} from "dayjs";
import {Position} from "../../types/App";
import {EventType} from "@testing-library/react";
import {IEvent, ISection} from "../../types/Api";
import SlidePanel from "../SlideBar/SlideBar";
import ProgressBar from "../../features/ProgressBar/ProgressBar";
import {getEvents} from "../../services/bx24-rest-webhooks/fetchEvents";

const CalendarGrid = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    const sections = useRecoilValue(sectionsAtom);
    const sectionsGroups = useRecoilValue(sectionsGroupsAtom);
    const date = useRecoilValue(dateAtom);
    const [events, setEvents] = useRecoilState(eventsAtom);
    const [isVisible, setIsVisible] = React.useState(false);
    const [position, setPosition] = React.useState<Position>({x: 0, y: 0});
    const [currentEvent, setCurrentEvent] = React.useState<IEvent | null>(null);

    const [slidePanel, setSlidePanel] = React.useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventAtom);
    const [currentSection, setCurrentSection] = React.useState<ISection | null>(null);

    const [newEvent, setNewEvent] = React.useState<boolean>(false);
    const [formulas, setFormulas] = React.useState<{ ID:string, NUMBER?: number }[]>([]);
    const [isVisibleSection, setIsVisibleSection]  = React.useState<boolean>(false);

    const [isVisibleFixed, setIsVisibleFixed] = React.useState<boolean>(false);

    const calculateFormulaForSection = (SECT_ID: string, events: IEvent[], intervalStart: Dayjs = date.hour(9).minute(30),
                                        intervalEnd: Dayjs = date.hour(18).minute(30)) => {
        const filteredEvents = events.filter(event => {
            const eventStart = dayjs(event.DATE_FROM);
            const eventEnd = dayjs(event.DATE_TO);
            return eventStart.isBefore(intervalEnd) && eventEnd.isAfter(intervalStart) && event.SECTION_ID === SECT_ID;
        });

        // Подсчет общей длительности отфильтрованных событий в минутах
        const totalDuration = filteredEvents.reduce((acc, event) => {
            const eventStart = dayjs(event.DATE_FROM);
            const eventEnd = dayjs(event.DATE_TO);

            // Ограничение начала и конца события интервалом
            const start = eventStart.isBefore(intervalStart) ? intervalStart : eventStart;
            const end = eventEnd.isAfter(intervalEnd) ? intervalEnd : eventEnd;

            // Добавление длительности события к аккумулятору
            return acc + end.diff(start, 'minute');
        }, 0);
        console.log(`${sections.find(sect => sect.ID === SECT_ID)?.NAME} = ${totalDuration}`)
        return totalDuration;
    }

    React.useEffect(() => {
        const newFormulas = sections.map(section => ({
            ID: section.ID,
            NUMBER: calculateFormulaForSection(section.ID, events) // Это пример функции, которую вам нужно определить
        }));
        setFormulas(newFormulas);
    }, [events]);



    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, event: IEvent) => {
        setPosition({x: e.clientX, y: e.clientY});
        setIsVisible(true);
        setCurrentEvent(event);
    };

    const handleMouseEnter1 = (e: React.MouseEvent<HTMLDivElement>, section: ISection) => {
        setPosition({x: e.clientX, y: e.clientY});
        setIsVisibleSection(true);
        setCurrentSection(section);
    }

    const handleMouseEnter2 = (e: React.MouseEvent<HTMLDivElement>, section: ISection) => {
        setPosition({x: e.clientX, y: e.clientY});
        setIsVisibleFixed(true);
        setCurrentSection(section);
    }

    const handleMouseLeave = () => {
        setIsVisible(false);
        setCurrentEvent(null);
    };
    const handleMouseLeave1 = () => {
        setIsVisibleSection(false);
        setCurrentSection(null);
    };

    const handleMouseLeave2 = () => {
        setIsVisibleFixed(false);
        setCurrentSection(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setPosition({x: e.clientX, y: e.clientY});
    };

    useEffect(() => {
        if (!slidePanel) {
            getEvents(date).then((events) => {
                setEvents(events);
            });
        }

    }, [slidePanel]);

    // Функция для фильтрации событий по временному интервалу и подсчета их общей длительности


    React.useEffect(()=>{
        if (!slidePanel) {
            setNewEvent(false);
        }
    },[slidePanel]);





    return (
        <div className={styles.gridContainer} ref={ref}>
            <div className={styles.fixedColumn}>
                {
                    sectionsGroups.map((group, index) => (
                        <React.Fragment key={index}>
                            <div key={index}
                                 className={styles.titleGroup}
                            >{group.title}</div>
                            {group.sections.map((section, index) => {

                                return <div  onMouseMove={handleMouseMove}
                                             onMouseEnter={(e) => handleMouseEnter2(e, section)}
                                             onMouseLeave={handleMouseLeave2}
                                            key={index}
                                            style={currentSection?.ID === section.ID ?
                                                {
                                                    boxShadow: "0 0 0 1px #E1DCE2",
                                                    backgroundColor: "#DBDADC",
                                                    height: "45px"
                                                }
                                                :
                                                {}} className={styles.stickyCell}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        justifyContent: "space-between",
                                        padding: "2px 0 0 2px",
                                        flexWrap: "wrap"

                                    }}
                                    >
                                        <p>{section.NAME.replace(/\[.*?\]/g, '')}</p>
                                        <ProgressBar
                                            value={formulas ? (formulas.find(formula => formula.ID === section.ID)?.NUMBER || 0) / 5.4
                                                : 0} color={section.COLOR}
                                            height={currentSection && currentSection.ID === section.ID ? 15 : 10}/>

                                    </div>
                                    <div className={styles.secondColumn}>
                                        <p style={{fontSize: "14px"}}>{formulas ? Math.floor((formulas.find(formula => formula.ID === section.ID)?.NUMBER || 0) / 5.4)
                                            : 0}%</p>
                                        <p>{`Занято: ${formulas ? Math.floor((formulas.find(formula => formula.ID === section.ID)?.NUMBER || 0) / 60) : 0} ч
                                            ${formulas ? Math.floor((formulas.find(formula => formula.ID === section.ID)?.NUMBER || 0) % 60) : 0} мин`}</p>
                                    </div>
                                </div>
                            })}
                        </React.Fragment>
                    ))
                }
            </div>
            <div className={styles.scrollableRows}>
                {sectionsGroups.map((group, index) => {
                    return <React.Fragment key={index}>
                            <div className={styles.titleRow}>
                            </div>
                            {group.sections.map((section, index) => {
                                return <div key={index}
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={(e) => handleMouseEnter1(e, section)}
                                            onMouseLeave={handleMouseLeave1}
                                            onClick={() => {
                                                setSlidePanel(true);
                                                setSelectedEvent({...events[0],
                                                    ID: "6666",
                                                    NAME: "Новое событие",
                                                    SECTION_ID: section.ID,
                                                    SECT_ID: section.ID,
                                                    ATTENDEE_LIST: [],
                                                    DATE_FROM: date.hour(12),
                                                    DATE_TO: date.hour(13),
                                                    DESCRIPTION: '',
                                                    ['~DESCRIPTION']: '',
                                                    uploads: []
                                                });
                                                setNewEvent(true);
                                            }}
                                            style={currentSection && currentSection.ID === section.ID ? {
                                                height: "45px",
                                                backgroundColor: "rgba(0, 0, 0, 0.1)"
                                            } : {}} className={styles.row}>
                                    {events.map((calEvent, index) => {
                                        return calEvent.SECTION_ID === section.ID ? <div onMouseMove={handleMouseMove}
                                                                                         onClick={(e) => {
                                                                                             e.stopPropagation();
                                                                                             setNewEvent(false);
                                                                                             setSlidePanel(true);
                                                                                             setSelectedEvent(calEvent);
                                                                                         }}
                                                                                         onMouseEnter={(e) => handleMouseEnter(e, calEvent)}
                                                                                         onMouseLeave={handleMouseLeave}

                                                                                         className={styles.eventWrapper}
                                                                                         style={currentEvent?.ID === calEvent.ID ? {
                                                                                                 width: `${calEvent.DATE_TO.diff(calEvent.DATE_FROM, 'minute') * 2.5 - 8}px`,
                                                                                                 left: `${calEvent.DATE_FROM.diff(calEvent.DATE_FROM.startOf('day'), 'minute') * 2.5 - 300}px`,
                                                                                                 background: `${section.COLOR}`,
                                                                                                 boxShadow: ` 0 0 0 1.5px rgb(255, 255, 255),
                                                                                                         0 0 0 3px ${section.COLOR}`
                                                                                             }
                                                                                             :
                                                                                             {
                                                                                                 width: `${calEvent.DATE_TO.diff(calEvent.DATE_FROM, 'minute') * 2.5 - 8}px`,
                                                                                                 left: `${calEvent.DATE_FROM.diff(calEvent.DATE_FROM.startOf('day'), 'minute') * 2.5 - 300}px`,
                                                                                                 background: `${section.COLOR}`,
                                                                                             }
                                                                                         }
                                                                                         key={index}>{calEvent.NAME}</div> : null
                                    })}
                                </div>
                            })}
                        </React.Fragment>
                    }
                )}
            </div>
            {
                currentSection && isVisibleFixed && (<div
                    className={`${styles.popup} ${isVisibleSection ? styles.popupVisible : ''}`}
                    style={{
                    top: position.y + 10,
                    left: position.x,
                    zIndex: '9999',
                    padding: "10px 15px"
                }}
                    ><p style={{margin: "0"}}>Создать новое событие</p></div>)
            }
            {currentSection && !currentEvent && isVisibleSection && (
                <div
                    className={`${styles.popup} ${isVisibleSection ? styles.popupVisible : ''}`}
                    style={{
                        top: position.y + 10,
                        left: position.x,
                        zIndex: '9999',
                        padding: "10px 15px"
                    }}
                ><p style={{margin: "0"}}>Создать новое событие</p></div>
            )}
            {currentEvent && (
                <div
                    className={`${styles.popup} ${isVisible ? styles.popupVisible : ''}`}
                    style={{
                        top: position.y + 10,
                        left: position.x,
                        zIndex: '9999'
                    }}
                >
                    <div style={{
                        width: "28px",
                        height: "3.5px",
                        borderRadius: "3px",
                        background: `${sections.find(section => section.ID === currentEvent.SECTION_ID)?.COLOR}`
                    }}></div>
                    <div className={styles.headerPopup}>{currentEvent.NAME}</div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className={styles.timePopup}>

                            <p>{`${dayjs(currentEvent.DATE_FROM, 'DD.MM.YYYY hh:mm:ss').hour()}:${dayjs(currentEvent.DATE_FROM, 'DD.MM.YYYY hh:mm:ss').minute()}`}</p>

                            <p>{`${dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').hour()}:${dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').minute() === 0
                                ? "00" : dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').minute()}`}</p>
                        </div>
                        <div style={{marginLeft: "5px"}}><a style={{color: "#807186"}}>Филиал:<br/> </a>{
                            sectionsGroups.map((group) => {
                                const foundSection = group.sections.find((section) => section.ID === currentEvent?.SECTION_ID);
                                return group ? group.title : null;
                            }).filter(name => name !== null)[0] // Извлекаем первое непустое имя и отображаем его
                        }</div>
                        <div style={{paddingLeft: "5px", marginLeft: "5px", borderLeft: "2px #807185 solid"}}>
                            <div/>
                            <a style={{color: "#807186"}}>Место:<br/>
                            </a>{sections.find(section => section.ID === currentEvent.SECTION_ID)?.NAME.replace(/\[.*?\]/g, '')}
                        </div>
                    </div>
                    {currentEvent["~DESCRIPTION"] === '' ? null : <div className={styles.descriptionPopup}>
                        <p>{`${currentEvent["~DESCRIPTION"]}`}</p>
                    </div>}

                </div>
            )}
            <SlidePanel isOpen={slidePanel} setIsOpen={setSlidePanel} newEvent={newEvent} />
        </div>
    );
});

export default CalendarGrid;