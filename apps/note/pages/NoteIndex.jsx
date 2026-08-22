import { utilService } from '../../../services/util.service.js'

const { useEffect } = React

export function NoteIndex() {
    useEffect(() => {
        utilService.setFavicon('assets/icons/notes.icon.png')
    }, [])

    return <section className="container">Notes app</section>
}
