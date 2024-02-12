import axios from 'axios';
import {IEvent} from "../../types/Api";
import dayjs from "dayjs";

export const updateCalendarEvent = async (eventData: IEvent) => {
    const url = 'https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/calendar.event.update';
    try {
        const response = await axios.post(url, {
            type: 'company_calendar',
            id: eventData.ID,
            ownerId: " ",
            name: eventData.NAME,
            section: eventData.SECTION_ID,
            attendees: eventData.ATTENDEE_LIST.map(item => item.id),
            is_meeting: "Y",
            description: eventData['~DESCRIPTION'],
            from: dayjs(eventData.DATE_FROM).format('DD.MM.YYYY HH:mm'),
            to: dayjs(eventData.DATE_TO).format('DD.MM.YYYY HH:mm'),
        });

        return response.data;
    } catch (error) {
        console.error('Error updating calendar event:', error);
        throw error; // Или обработайте ошибку по-другому
    }
};

