const { useState, useEffect } = React
import { FoldersNav } from '../../../cmps/FoldersNav.jsx'
import { CreateNote } from '../cmps/CreateNote.jsx'
import { NoteList } from '../cmps/NoteList.jsx'
import { noteService } from '../services/note.service.js'
import { utilService } from '../../../services/util.service.js'

const FOLDER_TYPES = [
    { name: 'notes' },
    { name: 'reminders' },
    { name: 'edit labels' },
    { name: 'archive' },
    { name: 'trash', icon: 'trash.icon.svg' },
]

export function NoteIndex() {
    const [notes, setNotes] = useState(noteService.query())

    useEffect(() => {
        utilService.setFavicon('assets/icons/notes.icon.png')

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
        <section className="note-index">
            <FoldersNav app="note" folders={FOLDER_TYPES}/>
            
            <div className="notes-container">
                <CreateNote createNote={createNote} />
                <NoteList notes={notes} setNotes={setNotes}/>
            </div>
        </section>
    )
}
