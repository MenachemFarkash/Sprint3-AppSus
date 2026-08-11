const { useState, useEffect } = React
import { CreateNote } from '../cmps/CreateNote.jsx'
import { NoteList } from '../cmps/NoteList.jsx'
import { noteService } from '../services/note.service.js'

export function NoteIndex() {
    const [notes, setNotes] = useState(noteService.query())

    useEffect(() => {
        const newNotes = noteService.query()

        setNotes(newNotes)
    }, [])

    function onGetEmptyNote() {
        return noteService.getEmptyNote()
    }

    function createNote(newNote) {
        setNotes((prev) => [newNote, ...prev])
    }

    return (
        <section className="container">
            <CreateNote createNote={createNote} />
            <NoteList notes={notes} />
        </section>
    )
}
