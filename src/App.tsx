import React from 'react';
import styles from './styles/App.module.scss';
import Side from "./components/Side/Side";
import UserSearch from "./components/UI/UserSearch";
import {getAllUsers} from "./services/bx24-rest-webhooks/fetchUsers";
import {useRecoilState, useRecoilValue} from "recoil";
import {dateAtom, eventsAtom, sectionsAtom, sectionsGroupsAtom, usersAtom} from "./store/atoms";
import {getEvents} from "./services/bx24-rest-webhooks/fetchEvents";
import FileUploader from "./features/FileUploader/FileUploader";
import Main from "./components/Main/Main";
import {getSections} from "./services/bx24-rest-webhooks/fetchSections";
import {ISection} from "./types/Api";

function App() {
    const [users, setUsers] = useRecoilState(usersAtom);
    const [events, setEvents] = useRecoilState(eventsAtom);
    const [sections, setSections] = useRecoilState(sectionsAtom);
    const [sectionsGroups, setSectionsGroups] = useRecoilState(sectionsGroupsAtom);
    const date = useRecoilValue(dateAtom);

    React.useEffect(() => {
        getAllUsers().then(users => {
            setUsers(users);
        }).catch(error => {
            console.error('Ошибка при получении пользователей:', error);
        });

        getSections().then(sections => {
            setSections(sections);

        }).catch(error => {
            console.error('Ошибка при получении секций календаря:', error);
        });
    }, []);
    React.useEffect(() => {
        getEvents(date).then((events) => {
            setEvents(events);
        });
    }, [date]);



    React.useEffect(() => {
        if (sections) {
            const filteredSections1 = sections.map((section) => {
                const match = section.NAME.match(/\[(.*?)\]/);
                // Проверяем, соответствует ли содержимое скобок определенному условию
                if (match && match[1] === '1') { // Укажите ваше условие
                    return {...section, NAME: section.NAME.replace(/\[.*?\]/g, '')};
                }
                return null; // Возвращаем null, если условие не выполнено
            }).filter((section): section is ISection => section !== null); // Удаляем null элементы, уточняя тип
            const filteredSections2 = sections.map((section) => {
                const match = section.NAME.match(/\[(.*?)\]/);
                // Проверяем, соответствует ли содержимое скобок определенному условию
                if (match && match[1] === '2') { // Укажите ваше условие
                    return {...section, NAME: section.NAME.replace(/\[.*?\]/g, '')};
                }
                return null; // Возвращаем null, если условие не выполнено
            }).filter((section): section is ISection => section !== null); // Удаляем null элементы, уточняя тип
            const filteredSections3 = sections.map((section) => {
                const match = section.NAME.match(/\[(.*?)\]/);
                // Проверяем, соответствует ли содержимое скобок определенному условию
                if (match && match[1] === '3') { // Укажите ваше условие
                    return {...section, NAME: section.NAME.replace(/\[.*?\]/g, '')};
                }
                return null; // Возвращаем null, если условие не выполнено
            }).filter((section): section is ISection => section !== null); // Удаляем null элементы, уточняя тип

            setSectionsGroups([
                {id: 0, title: 'Главное здание бахрушинского музея', color: "#9E0502", sections: filteredSections1},
                {id: 1, title: 'Дом-музей Ермоловой', color: "#BB85AB", sections: filteredSections2},
                {id: 2, title: 'Музей-квартира Вс.Э. Мейерхольда', color: "#F11617", sections: filteredSections3},
            ]);
        }
    }, [sections]);

    console.log(users)

    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <Main/>
            </div>
            <div className={styles.side}>
                <Side/>
            </div>
        </div>
    );
}

export default App;
