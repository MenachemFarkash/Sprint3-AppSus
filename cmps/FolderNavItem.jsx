const { Link } = ReactRouterDOM

export function FolderNavItem({ app, folder, folderType, unreadCount, onNavigate }) {
  const { name, icon = 'folder-menu.icon.svg' } = folder
  const hasUnread = unreadCount > 0 ? 'unread' : ''
  const isSelected = name === folderType ? 'selected' : ''

  return (
    <Link to={`/${app}/folder/${name}`} onClick={onNavigate}>
      <button className={`round-btn folder ${hasUnread} ${isSelected}`}>
        <img src={`assets/icons/${icon}`} alt={name} />
      </button>
      <span className="folder-txt">{name}</span>
      {unreadCount > 0 &&
        <span className="folder-txt">{unreadCount}</span>
      }
    </Link>
  )
}
