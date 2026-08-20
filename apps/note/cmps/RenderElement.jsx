export function RenderElement({ element }) {
    const Tag = element.type


    const className = [
        element.isBald && 'bold',
        element.isItalic && 'italic',
        element.isUnderline && 'underline',
        'note-dynamic-element',

    ].filter(Boolean).join(' ')

    return (
        <Tag className={className} src={element.url}>
            {element.txt}
        </Tag>
    )
}