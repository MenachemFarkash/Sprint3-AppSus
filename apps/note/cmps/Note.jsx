export function Note({ id, title, bodyText }) {
    return (
        <div className="note-container">
            {/* <p>{id}</p> */}
            <h1 className="note-title">{title}</h1>
            <p className="note-body-text">{bodyText}</p>
        </div>
    )
}
