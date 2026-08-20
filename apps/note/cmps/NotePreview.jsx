import { noteService } from '../services/note.service.js'
import { RenderElement } from './RenderElement.jsx'

export function NotePreview({id, color, note }) {

    function onDeleteNote(noteId){
        console.log('deleting note with id: ' , noteId)
        noteService.remove(noteId)
    }

    return (
        <div className={`note-container ${color}`}>
            <div>
            {note.elements.map((element, index) =>{
                return <RenderElement noteId={id} element={element} elementIndex={index}/>
            })}
                
            </div>
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
