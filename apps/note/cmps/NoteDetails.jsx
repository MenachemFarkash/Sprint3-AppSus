import { noteService } from '../services/note.service.js'
const {useState} = React


export function NoteDetails({noteId}) {
    const [note, setNote] = useState(noteService.get(noteId))
  return (
    <div>NoteDetails</div>
  )
}
