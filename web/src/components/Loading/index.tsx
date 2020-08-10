import React from 'react';

import './styles.css';

interface LoadingProps{
    value: boolean;
}

const Loading: React.FC<LoadingProps> = ({ value }) => {
    return value ? (
        <div className="loading">
            <div></div>
            <p>carregando...</p>
        </div>
    ) : null;
}

export default Loading;