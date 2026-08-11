export function NotePreview({ id, title, bodyText }) {
    return (
        <div className="note-container">
            <h1 className="note-title">{title}</h1>
            <p className="note-body-text">{bodyText}</p>
        </div>
    )
}
