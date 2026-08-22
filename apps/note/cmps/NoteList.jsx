import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes }) {
    return (
        <div className="note-list-container">
            {notes.map((note) => {
                return (
                    <NotePreview
                        id={note.id}
                        color={note.color}
                        key={note.id}
                        note={note}
                    />
                )
            })}
        </div>
    )
}
