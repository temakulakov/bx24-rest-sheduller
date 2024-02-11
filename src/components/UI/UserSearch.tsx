import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Autocomplete, TextField} from "@mui/material";
import {IUsers} from "../../types/Api";

const UserSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState<IUsers[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (inputValue) {
            setIsLoading(true);
            axios.post('https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/user.get', {
                filter: { "NAME_SEARCH": inputValue }
            })
                .then(response => {
                    setUsers(response.data.result); // Предполагаем, что данные пользователя находятся в response.data.result
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the users:', error);
                    setIsLoading(false);
                });
        } else {
            setUsers([]);
        }
    }, [inputValue]);

    return (
        // <Autocomplete
        //     value={value}
        //     onChange={(event: any, newValue: string | null) => {
        //         setValue(newValue);
        //     }}
        //     inputValue={inputValue}
        //     onInputChange={(event, newInputValue) => {
        //         setInputValue(newInputValue);
        //     }}
        //     id="controllable-states-demo"
        //     options={options}
        //     sx={{ width: 300 }}
        //     renderInput={(params) => <TextField {...params} label="Controllable" />}
        // />
        <></>
        // <div>
        //     <input
        //         type="text"
        //         value={inputValue}
        //         onChange={(e) => setInputValue(e.target.value)}
        //         placeholder="Search users..."
        //     />
        //     {isLoading ? (
        //         <div>Loading...</div>
        //     ) : (
        //         <ul style={{listStyle: "none"}}>
        //             {users.map((user) => (
        //                 <li key={user.ID}><img style={{height: "20px", width: "20px", borderRadius: "50%"}} alt={user.NAME} src={user.PERSONAL_PHOTO ? user.PERSONAL_PHOTO : "https://intranet.gctm.ru/bitrix/js/ui/icons/b24/images/ui-user.svg?v2"}/>{user.NAME} {user.LAST_NAME}</li>
        //             ))}
        //         </ul>
        //     )}
        // </div>
    );
};

export default UserSearch;
