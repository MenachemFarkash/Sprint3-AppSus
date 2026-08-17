const { useState } = React
import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'

export function CreateNote({ createNote }) {
    const [newNote, setNewNote] = useState(noteService.getEmptyNote())
    const [isFocused, setIsFocused] = useState(false)

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
                {isFocused ? (
                    <div>
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
                        <button type="button" onClick={()=> setIsFocused(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <input
                            className="create-note-fake-input"
                            onClick={() => setIsFocused(true)}
                            placeholder="Take a note..."
                        />
                    </div>
                )}
            </form>
        </section>
    )
}
