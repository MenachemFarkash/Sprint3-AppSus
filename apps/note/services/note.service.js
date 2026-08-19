import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'notesDB'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyNote,
    togglePin,
    duplicateNote,
    changeColor,
    addNoteMsg,
    getNoteTypes,
}

function query(filterBy = {}) {
    // filter by txt/title, isPinned, color, type, label
    return utilService.loadFromStorage(NOTE_KEY)
}

function get(noteId) {
    // fetch a single note by id
}

function remove(noteId) {
    storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
    return storageService.post(NOTE_KEY, note)
}

function getDefaultFilter(filterBy = { txt: '', type: '' }) {
    // returns default filter object shape
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (notes && notes.length > 0) return

    notes = []

    for (let i = 0; i < 20; i++) {
        const note = {
            id: utilService.makeId(),
            type: 'text',
            title: utilService.makeLorem(3),
            bodyText: utilService.makeLorem(30),
            color: '#ffffff',
            createAt: Date.now(),
        }
        notes.push(note)
    }

    utilService.saveToStorage(NOTE_KEY, notes)
}

function getEmptyNote() {
   let emptyNote = {
        id: utilService.makeId(),
        type: 'text',
        title: '',
        bodyText: '',
        color: 'white',
    }

    return emptyNote
}

function togglePin(noteId) {
    // flips isPinned on a note and saves it
}

function duplicateNote(noteId) {
    // clones an existing note with a new id
}

function changeColor(noteId, color) {
    // updates note's background color
}

function addNoteMsg(noteId, txt) {
    // appends a comment/message to a note (if you support comments)
}

function getNoteTypes() {
    // returns supported note types e.g. ['note-txt', 'note-img', 'note-todos']
}
