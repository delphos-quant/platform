import React from 'react';

type HeadProps = {
    title?: string;
    description?: string;
};

const Head: React.FC<HeadProps> = ({ title, description }) => (
    <head>
        <title>{title ? title : 'Delphos - Platform'}</title>
        <meta name="description" content={description ? description : ''} />
        {/* ... other meta tags and links ... */}
    </head>
);

export default Head;