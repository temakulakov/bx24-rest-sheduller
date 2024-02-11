// usersApi.ts
import axios from 'axios';
import { ISection, IResponceSections } from "../../types/Api";



export async function getSections(): Promise<ISection[]> {
    const type = "company_calendar";
    const ownerId = "";
    let sections: ISection[] = [];
        try {
            const response: IResponceSections = await axios.post(`https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/calendar.section.get`, {
                type: type,
                ownerId: ownerId,
            });
            sections = response.data.result;
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }

    return sections;
}
