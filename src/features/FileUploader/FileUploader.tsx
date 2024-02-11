import React, { useState } from 'react';
import axios from 'axios';
import styles from "../../styles/FileUploader.module.scss";
import {useRecoilState} from "recoil";
import {selectedEventAtom} from "../../store/atoms";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import dayjs from "dayjs";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const FileUploader: React.FC = () => {
    const [drag, setDrag] = useState(false);
    const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventAtom);

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(true);
    }

    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
    }

    async function onDropHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            await uploadFile(file);
        }
    }

    const uploadFile = async (file: File) => {
        try {
            const { data: { result: { uploadUrl } } } = await axios.post(
                'https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/disk.folder.uploadfile',
                { id: "3648" }
            );

            const fileNameParts = file.name.split('.');
            const extension = fileNameParts.pop();
            const newFileName = `${fileNameParts.join('.')}[${selectedEvent?.ID}].${extension}`;

            const formData = new FormData();
            formData.append('file', new Blob([file], { type: file.type }), newFileName);

            await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Загрузка файла успешно завершена, обновляем selectedEvent
            await updateSelectedEvent();
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const updateSelectedEvent = async () => {
        try {
            const response = await axios.post(
                'https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/calendar.event.getbyid',
                { id: selectedEvent?.ID }
            );
            setSelectedEvent({...response.data.result, DATE_FROM: dayjs(response.data.result.DATE_FROM), DATE_TO: dayjs(response.data.result.DATE_TO)}); // Обновляем selectedEvent новыми данными
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
        }
    };

    return (
        <>
            <div className={styles.uploads}>
                {selectedEvent?.uploads.map((upload, index) => (
                    <a key={index} href={`https://intranet.gctm.ru${upload.UPLOAD_URL}`} className={styles.fileWrapper}>
                        <AttachFileRoundedIcon style={{ transform: "rotate(40deg)", margin: "auto 0", minHeight: "80px" }}/>
                        <p>{upload.NAME.replace(/\[.*?\]/g, '')}</p>

                    </a>
                ))}
            </div>
            <div className={styles.container}>
                {drag ? (
                    <div
                        onDragStart={dragStartHandler}
                        onDragLeave={dragLeaveHandler}
                        onDragOver={dragStartHandler}
                        onDrop={onDropHandler}
                        className={styles.dragAreaActive}
                    >
                        Отпустите файлы, чтобы загрузить
                    </div>
                ) : (
                    <div
                        onDragStart={dragStartHandler}
                        onDragLeave={dragLeaveHandler}
                        onDragOver={dragStartHandler}
                        className={styles.dragArea}
                    >
                        Перетащите файлы, чтобы загрузить
                    </div>
                )}
            </div>
        </>
    );
};

export default FileUploader;
