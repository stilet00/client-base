import React from 'react';
import "./SingleTranslator.css";
function SingleTranslator ({name, surname, clients}) {
    return (
        <div className={"gallery-item translator-item"} draggable={true}>
            <h4>{name + " " + surname}</h4>
            <p>Clients in work:</p>
            <div className="clients-box">
                <ul className={"clients-list"}>
                    <li>Natasha</li>
                    <li>Maria</li>
                    <li>Evlampia</li>
                </ul>
            </div>
        </div>
    );
}

export default SingleTranslator;