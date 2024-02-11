// CalendarGrid.tsx
import React from 'react';
import styles from '../../styles/CalendarGrid.module.scss';
import {useRecoilState, useRecoilValue} from "recoil";
import {eventsAtom, sectionsAtom, sectionsGroupsAtom, selectedEventAtom} from "../../store/atoms";
import dayjs from "dayjs";
import {Position} from "../../types/App";
import {EventType} from "@testing-library/react";
import {IEvent, ISection} from "../../types/Api";
import SlidePanel from "../SlideBar/SlideBar";

const CalendarGrid = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    const sections = useRecoilValue(sectionsAtom);
    const sectionsGroups = useRecoilValue(sectionsGroupsAtom);
    const [events, setEvents] = useRecoilState(eventsAtom);
    const [isVisible, setIsVisible] = React.useState(false);
    const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });
    const [currentEvent, setCurrentEvent] = React.useState<IEvent | null>(null);

    const [slidePanel, setSlidePanel] = React.useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventAtom);
    const [currentSection, setCurrentSection] = React.useState<ISection | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, event: IEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
        setCurrentEvent(event);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
        setCurrentEvent(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className={styles.gridContainer} ref={ref}>
            <div className={styles.fixedColumn}>
                {
                    sectionsGroups.map((group, index) => (
                        <React.Fragment key={index}>
                            <div key={index}  className={styles.titleGroup}>{group.title}</div>
                            {group.sections.map((section, index) => <div key={index} style={currentSection?.ID === section.ID ?
                                {
                                    boxShadow: "0 0 0 1px #E1DCE2",
                                    backgroundColor: "#DBDADC",
                                    height: "45px"
                                }
                                :
                                {}} className={styles.stickyCell}>
                                {section.NAME.replace(/\[.*?\]/g, '')}
                            </div>)}
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
                                return <div key={index} onMouseEnter={() => setCurrentSection(section)} onMouseLeave={() => setCurrentSection(null)} className={styles.row} >
                                    {events.map((calEvent, index) => {
                                        return calEvent.SECTION_ID === section.ID ? <div onMouseMove={handleMouseMove}
                                                                                         onClick={() => {
                                                                                             setSlidePanel(true);
                                                                                             setSelectedEvent(calEvent);
                                                                                         }}
                                                                                      onMouseEnter={(e) => handleMouseEnter(e, calEvent)}
                                                                                      onMouseLeave={handleMouseLeave}

                                                                                      className={styles.eventWrapper}
                                                                                      style= {currentEvent?.ID === calEvent.ID ? {width: `${dayjs(calEvent.DATE_TO).diff(dayjs(calEvent.DATE_FROM), 'minute') * 2.2916666667 - 8}px`,
                                                                                                 left: `${dayjs(calEvent.DATE_FROM, "DD.MM.YYYY HH:mm:ss").diff(dayjs(calEvent.DATE_FROM, "DD.MM.YYYY HH:mm:ss").startOf('day'), 'minute') * 2.5}px`,
                                                                                                 background: `${section.COLOR}`,
                                                                                                 boxShadow: ` 0 0 0 1.5px rgb(255, 255, 255),
                                                                                                         0 0 0 3px ${section.COLOR}`} : {width: `${dayjs(calEvent.DATE_TO).diff(dayjs(calEvent.DATE_FROM), 'minute') * 2.2916666667 - 8}px`,
                                                                                                 left: `${dayjs(calEvent.DATE_FROM, "DD.MM.YYYY HH:mm:ss").diff(dayjs(calEvent.DATE_FROM, "DD.MM.YYYY HH:mm:ss").startOf('day'), 'minute') * 2.5}px`,
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
            {currentSection && !currentEvent && isVisible && (
                <div
                    className={`${styles.popup} ${isVisible ? styles.popupVisible : ''}`}
                    style={{
                        top: position.y + 10,
                        left: position.x,
                        zIndex: '9999'
                    }}
                ><h1>wefwef</h1></div>
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
                    <div style={{display: "flex",  alignItems: "center"}}>
                        <div className={styles.timePopup}>

                            <p>{`${dayjs(currentEvent.DATE_FROM, 'DD.MM.YYYY hh:mm:ss').hour()}:${dayjs(currentEvent.DATE_FROM, 'DD.MM.YYYY hh:mm:ss').minute()}`}</p>

                            <p>{`${dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').hour()}:${dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').minute() === 0
                                ? "00" : dayjs(currentEvent.DATE_TO, 'DD.MM.YYYY hh:mm:ss').minute()}`}</p>
                        </div>
                        <div style={{marginLeft: "5px"}}><a style={{color: "#807186"}}>Филиал: </a>{
                            sectionsGroups.map((group) => {
                                const foundSection = group.sections.find((section) => section.ID === currentEvent?.SECTION_ID);
                                return group ? group.title : null;
                            }).filter(name => name !== null)[0] // Извлекаем первое непустое имя и отображаем его
                        }</div>
                        <div style={{marginLeft: "5px"}}><div/><a style={{color: "#807186"}}>Место: </a>{sections.find(section => section.ID === currentEvent.SECTION_ID)?.NAME.replace(/\[.*?\]/g, '')}</div>
                    </div>
                    {currentEvent["~DESCRIPTION"] === '' ? null : <div className={styles.descriptionPopup}>
                        <p>{`${currentEvent["~DESCRIPTION"]}`}</p>
                    </div>}

                </div>
            )}
            <SlidePanel isOpen={slidePanel} setIsOpen={setSlidePanel}/>
        </div>
    );
});

export default CalendarGrid;