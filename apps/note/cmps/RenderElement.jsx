const { useState } = React
import { noteService } from './../services/note.service.js'

export function RenderElement({ noteId, element ,elementIndex }) {
    const [tag, setTag] = useState(element.type)
    const Tag = element.type

    const className = [
        element.isBald && 'bold',
        element.isItalic && 'italic',
        element.isUnderline && 'underline',
        'note-dynamic-element',
    ]
        .filter(Boolean)
        .join(' ')

    function handleCheck(index) {
        console.log(noteId)
        const elIndex = elementIndex
        noteService.updateChecklistCheck(noteId, index, elIndex)
    }

    function handleRender(type) {
        if (type === 'h1' || type === 'p') {
            return <Tag className={className}>{element.txt}</Tag>
        }

        if (type === 'img') return <Tag src={element.url} />

        if (type === 'ul')
            return element.items.map((item, index) => {
                return (
                    <Tag className={className}>
                        <li>
                            <input
                                type="checkbox"
                                value={item.txt}
                                checked={item.isChecked}
                                onChange={() => handleCheck(index)}
                            />
                            <label htmlFor="item1">{item.txt}</label>
                        </li>
                    </Tag>
                )
            })
    }

    return handleRender(tag)
}
