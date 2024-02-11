import axios from 'axios';
import {IEvent} from "../../types/Api";
import dayjs from "dayjs";

export const deleteCalendarEvent = async (eventData: IEvent) => {
    const url = 'https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/calendar.event.delete';
    try {
        const response = await axios.post(url, {
            type: 'company_calendar',
            id: eventData.ID,
            ownerId: " ",
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating calendar event:', error);
        throw error; // Или обработайте ошибку по-другому
    }
};

