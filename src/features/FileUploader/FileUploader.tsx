import React, { useState } from 'react';
import axios from 'axios';
import styles from "../../styles/FileUploader.module.scss";
import { useRecoilState } from "recoil";
import { selectedEventAtom } from "../../store/atoms";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import dayjs from "dayjs";

const FileUploader: React.FC = () => {
    const [drag, setDrag] = useState(false);
    const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventAtom);

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(true);
    };

    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(false);
    };

    const onDropHandler = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDrag(false);
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            await uploadFile(file);
        }
    };

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
            setSelectedEvent({ ...response.data.result, DATE_FROM: dayjs(response.data.result.DATE_FROM, "DD.MM.YYYY HH:mm:ss"), DATE_TO: dayjs(response.data.result.DATE_TO, "DD.MM.YYYY HH:mm:ss") }); // Обновляем selectedEvent новыми данными
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
        }
    };

    const deleteFile = async (fileId: string) => {
        try {
            await axios.post('https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/disk.file.delete', { id: fileId });
            await updateSelectedEvent(); // Обновляем данные события после удаления файла
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
        }
    };

    return (
        <>
            <div className={styles.uploads}>
                {selectedEvent?.uploads.map((upload, index) => (

                    <a key={index} className={styles.fileWrapper}
                       // href={`https://intranet.gctm.ru${upload.UPLOAD_URL}`}
                       // href={`https://intranet.gctm.ru/bitrix/tools/disk/focus.php?objectId=${upload.ID}&cmd=show&action=showObjectInGrid&ncc=1`}
                       href={`https://intranet.gctm.ru/bitrix/tools/disk/focus.php?objectId=${upload.ID}&cmd=show&action=showObjectInGrid&ncc=1`}
                       target="_blank"
                    >
                        <ClearRoundedIcon className={styles.deleteIcon} onClick={() => deleteFile(String(upload.ID))} />
                            <AttachFileRoundedIcon style={{ transform: "rotate(40deg)", minHeight: "30px" }}/>
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
