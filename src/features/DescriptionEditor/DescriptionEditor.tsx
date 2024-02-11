import React, { useState } from 'react';
import {IEvent} from "../../types/Api";

type TextEditorProps = {
    value: IEvent | null;
    onChange: (value: IEvent | null) => void;
};

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const [fontSize, setFontSize] = useState<number>(16);
    const [fontWeight, setFontWeight] = useState<number>(400);
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
    const [isList, setIsList] = useState<boolean>(false);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        // onChange(event.target.value);
    };

    const applyStyles = () => {
        let styles = {
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
            textAlign: textAlign,
        };
        return styles;
    };

    return (
        <div>
            {/*<div>*/}
            {/*    <label>*/}
            {/*        Font Size:*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={fontSize}*/}
            {/*            onChange={(e) => setFontSize(Number(e.target.value))}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        Font Weight:*/}
            {/*        <input*/}
            {/*            type="number"*/}
            {/*            value={fontWeight}*/}
            {/*            onChange={(e) => setFontWeight(Number(e.target.value))}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        Text Align:*/}
            {/*        <select value={textAlign} onChange={(e) => setTextAlign(e.target.value as 'left' | 'center' | 'right')}>*/}
            {/*            <option value="left">Left</option>*/}
            {/*            <option value="center">Center</option>*/}
            {/*            <option value="right">Right</option>*/}
            {/*        </select>*/}
            {/*    </label>*/}
            {/*    <label>*/}
            {/*        List:*/}
            {/*        <input*/}
            {/*            type="checkbox"*/}
            {/*            checked={isList}*/}
            {/*            onChange={(e) => setIsList(e.target.checked)}*/}
            {/*        />*/}
            {/*    </label>*/}
            {/*</div>*/}
            {/*{isList ? (*/}
            {/*    <ul style={applyStyles()}>*/}
            {/*        {value.split('\n').map((item, index) => (*/}
            {/*            <li key={index}>{item}</li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*) : (*/}
            {/*    <textarea value={value} onChange={handleTextChange} style={applyStyles()} />*/}
            {/*)}*/}
        </div>
    );
};

export default TextEditor;
