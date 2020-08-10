import React, { InputHTMLAttributes } from 'react';

import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    name: string;
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ name, label, error, ...rest }) => {
    return(
        <div className="input-block">
            <label htmlFor={name}>
                {label}
            </label>
            <input type="text" id={name} {...rest}/>
            <span>{error}</span>
        </div>
    );
}

export default Input;