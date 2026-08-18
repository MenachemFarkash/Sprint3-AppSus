export function NotePreview({ title, bodyText, color }) {
    return (
        <div className={`note-container ${color}`}>
            <h1 className="note-title">{title}</h1>
            <p className="note-body-text">{bodyText}</p>
        </div>
    )
}
