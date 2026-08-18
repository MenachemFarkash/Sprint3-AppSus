import { noteService } from '../services/note.service.js'

export function NotePreview({id, title, bodyText, color }) {

    function onDeleteNote(noteId){
        console.log('deleting note with id: ' , noteId)
        noteService.remove(noteId)
    }

    return (
        <div className={`note-container ${color}`}>
            <h1 className="note-title">{title}</h1>
            <p className="note-body-text">{bodyText}</p>
            <div className="note-action-buttons">
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>🗑️</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>🎨</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>🔔</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>👤</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>🖼️</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>📥</button>
                <button className={'round-btn'} onClick={()=> onDeleteNote(id)}>⋮</button>
            </div>
        </div>
    )
}
