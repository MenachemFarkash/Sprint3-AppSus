const { useState, useEffect } = React
import { NoteList } from '../cmps/NoteList.jsx'
import { noteService } from '../services/note.service.js'

export function NoteIndex() {
    const [notes, setNotes] = useState(noteService.query())

    useEffect(() => {
        setNotes(noteService.query())
    }, [])

    function onGetEmptyNote() {
        return noteService.getEmptyNote()
    }

    return (
        <section className="container">
            <button onClick={() => onGetEmptyNote()}>Create Note</button>
            <NoteList notes={notes} />
        </section>
    )
}
