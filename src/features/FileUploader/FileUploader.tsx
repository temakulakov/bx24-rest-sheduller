// FileUploader.tsx
import React, { useState, useCallback } from 'react';
import { uploadFiles } from '../../services/bx24-rest-webhooks/uploadFiles';
import styles from "../../styles/FileUploader.module.scss";


const FileUploader: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const onUpload = () => {
        uploadFiles(files).then(() => setFiles([])); // Очистка списка файлов после отправки
    };

    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onDrop(Array.from(event.target.files));
        }
    };

    return (
        <div className={styles.root}>
            <input type="file" multiple onChange={handleFiles} className={styles.button} style={{ }} />
            <div
                onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.dataTransfer.files) {
                        onDrop(Array.from(event.dataTransfer.files));
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }}
                style={{ border: '2px dashed #000', padding: '20px', marginBottom: '20px' }}
            >
                Перетащите файлы сюда или кликните для выбора
            </div>
            <button onClick={onUpload}>Отправить</button>
        </div>
    );
};

export default FileUploader;
