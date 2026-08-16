export function UserAvatar({ fullname = '', color, className = '' }) {
    return (
        <span className={`user-avatar ${className}`} style={{ backgroundColor: color }}>
            {fullname.charAt(0).toUpperCase()}
        </span>
    )
}
