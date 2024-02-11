// usersApi.ts
import axios from 'axios';
import {IResponceEvents, IEvent} from "../../types/Api";
import {Dayjs} from "dayjs";



export async function getEvents(date: Dayjs): Promise<IEvent[]> {
    const type = "company_calendar";
    const ownerId = "";
    let events: IEvent[] = [];
        try {
            const response: IResponceEvents = await axios.post(`https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/calendar.event.get`, {
                type: type,
                ownerId: ownerId,
                from: date.format("YYYY-MM-DD"),
                to: date.format("YYYY-MM-DD")
            });
            events = response.data.result;
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }

    return events;
}
