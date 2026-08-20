import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes }) {
    return (
        <div className="note-list-container">
            {notes.map((note) => {
                return (
                    <NotePreview
                        id={note.id}
                        title={note.title}
                        color={note.color}
                        bodyText={note.bodyText}
                        key={note.id}
                        note={note}
                    />
                )
            })}
        </div>
    )
}
