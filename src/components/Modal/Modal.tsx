import React from 'react';
import styles from "../../styles/Modal.module.scss";
import { useRecoilState } from "recoil";
import { modaAtom } from "../../store/atoms";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiModal from "@mui/material/Modal"; // Импортировать Modal как MuiModal

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomModal = () => { // Переименовать компонент, чтобы избежать конфликта имен
    const [modal, setModal] = useRecoilState(modaAtom);

    return (
        <MuiModal // Использовать MuiModal здесь
            open={modal.status}
            onClose={() => setModal(prev => ({ ...prev, status: false }))}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </MuiModal>
    );
};

export default CustomModal;
