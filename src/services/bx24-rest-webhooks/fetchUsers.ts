// usersApi.ts
import axios from 'axios';
import { IResponcePages, IUsers} from "../../types/Api";



export async function getAllUsers(): Promise<IUsers[]> {
    let users: IUsers[] = [];
    let start = 0;
    const limit = 50;
    let hasMoreData = true;

    while (hasMoreData) {
        try {
            const response: IResponcePages = await axios.post(`https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/user.get`, {
                start: start,
                filter: {
                    USER_TYPE: "employee"
                }
            });
            const data: IUsers[] = response.data.result;
            users.push(...data);
            if (users.length < response.data.total) {
                start += limit;
            } else {
                hasMoreData = false;
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            break; // Выходим из цикла в случае ошибки
        }
    }
    return users;
}
