import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RecoilRoot} from "recoil";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#9D2135', // Новый цвет акцента, здесь пример с оранжевым цветом
        },
        // Дополнительно, можно изменить и secondary, если нужно
        secondary: {
            // main: '#8A1635', // Пример изменения вторичного цвета
            main: '#9D2135', // Новый цвет акцента, здесь пример с оранжевым цветом
        },
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/> {/* Для сброса стилей и применения фона из темы */}
        <RecoilRoot>
            <App/>
        </RecoilRoot>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
