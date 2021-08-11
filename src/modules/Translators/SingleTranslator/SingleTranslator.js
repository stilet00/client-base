import React from 'react';
import "./SingleTranslator.css";
function SingleTranslator ({name, surname, clients, _id, dragOverHandler, onBoardDrop, dragLeaveHandler}) {
    return (
        <div className={"gallery-item translator-item"}>
            <h4>{name + " " + surname}</h4>
            <p>Clients in work:</p>
            <div className="clients-box">
                <ul className={"clients-list"} id={_id}
                    onDragOver={dragOverHandler}
                    dragLeaveHandler={dragLeaveHandler}
                    onDrop={(e) => onBoardDrop(e, _id)}
                >
                    {clients.map(client => <p>{`${client.name} ${client.surname}`}</p>)}
                </ul>
            </div>
        </div>
    );
}

export default SingleTranslator;