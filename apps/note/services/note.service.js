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
    updateChecklistCheck
}

function query(filterBy = {}) {
    // filter by txt/title, isPinned, color, type, label
    return utilService.loadFromStorage(NOTE_KEY)
}

function get(noteId) {
    return storageService.get(NOTE_KEY, noteId)
}

function remove(noteId) {
    storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTE_KEY, note)
    } else {
        return storageService.post(NOTE_KEY, note)
    }
}

function getDefaultFilter(filterBy = { txt: '', type: '' }) {
    // returns default filter object shape
}

function updateChecklistCheck(noteId, itemIndex, elIndex){
    get(noteId).then(note => {
        const item = note.elements[elIndex].items[itemIndex]
        item.isChecked = !item.isChecked
        
        return save(note)
        
    })
    

}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (notes && notes.length > 0) return

    const colors = [
        'coral',
        'peach',
        'sand',
        'mint',
        'sage',
        'fog',
        'storm',
        'dusk',
        'blossom',
        'clay',
        'chalk',
        'white',
    ]

    notes = []

    for (let i = 0; i < 20; i++) {
        const note = {
            id: utilService.makeId(),
            type: 'text',
            color: colors[utilService.getRandomIntInclusive(0, colors.length -1)],
            createdAt: Date.now(),
            isPinned: false,
            elements: [
                {
                    type: 'h1',
                    txt: `${utilService.makeLorem(5)}`,
                    isBald: true,
                    isItalic: false,
                    isUnderline: false,
                },
                {
                    type: 'p',
                    txt: `${utilService.makeLorem(utilService.getRandomIntInclusive(5, 30))}`,
                    isBald: false,
                    isItalic: false,
                    isUnderline: false,
                },
                {
                    type: 'img',
                    url: `https://picsum.photos/200/200/?${utilService.getRandomIntInclusive(0, 7384)}`,
                },
                {type: 'ul', items: [
                    {isChecked: true, txt: 'Something something'},
                    {isChecked: false, txt: 'Something something'},
                    {isChecked: false, txt: 'Something something'}
                ]}
            ],
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
        createdAt: 1112222,
        isPinned: false,
        elements: [],
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
