import { Note } from './Note.jsx'

export function NoteList({ notes }) {
    return (
        <div className="note-list-container">
            {notes.map((note) => {
                return <Note id={note.id} title={note.title} bodyText={note.bodyText} key={note.id} />
            })}
        </div>
    )
}
