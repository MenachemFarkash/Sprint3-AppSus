const { useState } = React
import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'

export function CreateNote({ createNote }) {
    const [newNote, setNewNote] = useState(noteService.getEmptyNote())
    const [isFocused, setIsFocused] = useState(false)
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

    function onCreateNote(ev) {
        ev.preventDefault()
        setNewNote((prev) => ({ ...prev, createAt: Date.now() }))
        noteService.save(newNote).then((note) => {
            createNote(note)
        })
    }

    function handleChange({ target }) {
        const { value, name } = target
        setNewNote((prev) => ({ ...prev, [name]: value }))
    }

    function changeNoteColor(newColor) {
        setNewNote((prev) => ({ ...prev, color: newColor }))
        console.log(newNote.color)
    }

    return (
        <section className="create-note-container">
            <form
                onSubmit={onCreateNote}
                style={{ backgroundColor: `var(--${newNote.color})` }}
            >
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

                        <div className="note-creation-buttons">
                            <button
                                type="button"
                                className="color-picker"
                                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            >
                                🎨
                            </button>
                            {isColorPickerOpen ? (
                                <span className="color-picker-container hidden">
                                    <button
                                        type="button"
                                        className="color-picker coral"
                                        onClick={() => changeNoteColor('coral')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker sand"
                                        onClick={() => changeNoteColor('sand')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker mint"
                                        onClick={() => changeNoteColor('mint')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker sage"
                                        onClick={() => changeNoteColor('sage')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker fog"
                                        onClick={() => changeNoteColor('fog')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker storm"
                                        onClick={() => changeNoteColor('storm')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker dusk"
                                        onClick={() => changeNoteColor('dusk')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker blossom"
                                        onClick={() => changeNoteColor('blossom')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker clay"
                                        onClick={() => changeNoteColor('clay')}
                                    ></button>
                                    <button
                                        type="button"
                                        className="color-picker chalk"
                                        onClick={() => changeNoteColor('chalk')}
                                    ></button>
                                </span>
                            ) : (
                                ''
                            )}
                            <button>Create Note</button>
                            <button
                                type="button"
                                onClick={() => setIsFocused(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <input
                            className="create-note-fake-input"
                            onClick={() => setIsFocused(true)}
                            placeholder="Take a note..."
                            onChange={handleChange}
                            value={newNote.bodyText}
                        />
                    </div>
                )}
            </form>
        </section>
    )
}
