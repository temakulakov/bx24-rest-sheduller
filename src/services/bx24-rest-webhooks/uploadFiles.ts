// uploadFiles.ts
import axios from 'axios';

async function uploadFiles(files: File[]): Promise<void> {
    const initUrl = "https://intranet.gctm.ru/rest/1552/c751t78u4kgzxy2i/disk.folder.uploadfile";

    for (const file of files) {
        try {
            // Первый запрос для получения URL для загрузки
            const initResponse = await axios.post(initUrl, JSON.stringify({ id: "3648" }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!initResponse.data || !initResponse.data.result || !initResponse.data.result.uploadUrl) {
                throw new Error('Failed to get upload URL');
            }

            const uploadUrl = initResponse.data.result.uploadUrl;
            const formData = new FormData();
            formData.append('file', file);

            // Отправка файла по полученному URL
            await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
        }
    }
}

export { uploadFiles };
