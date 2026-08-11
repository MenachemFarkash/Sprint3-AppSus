const { useState } = React
import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'

export function CreateNote({ createNote }) {
    const [newNote, setNewNote] = useState(noteService.getEmptyNote())

    function onCreateNote(ev) {
        ev.preventDefault()
        setNewNote((prev) => ({ ...prev, createAt: Date.now() }))
        noteService.save(newNote).then((note) => {
            createNote(note)
        })
    }

    function handleChange({ target }) {
        const { value, type, name } = target
        setNewNote((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <section className="create-note-container">
            <form onSubmit={onCreateNote}>
                <input
                    name="title"
                    value={newNote.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <input
                    name="bodyText"
                    placeholder="Body Text"
                    value={newNote.bodyText}
                    onChange={handleChange}
                />
                <button>Create Note</button>
                <button type="button">Cancel</button>
            </form>
        </section>
    )
}
