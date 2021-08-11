import React from 'react';

function SingleTranslator ({name, surname, clients}) {
    return (
        <div className={"gallery-item"} draggable={true}>
            <p>{name + " " + surname}</p>
        </div>
    );
}

export default SingleTranslator;