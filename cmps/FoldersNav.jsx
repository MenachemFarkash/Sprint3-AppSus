import { eventBusService } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams } = ReactRouter
const { Link } = ReactRouterDOM

const ICON_CLASSES= {
  inbox: 'fa-solid fa-inbox',
  starred: 'fa-regular fa-star',
  sent: 'fa-regular fa-paper-plane',
  draft: 'fa-regular fa-file',
  trash: 'fa-regular fa-trash-can',
}

// TODO: Click on compose should trigger a new mail creation

export function FoldersNav({ app, folders, unreadCounts = {} }) {
  const { type: folderType } = useParams()
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    return eventBusService.on('toggle-folder-nav', () => setIsNavOpen(prev => !prev))
  }, [])

  function renderFolders() {
    return folders.map(folderName => {
      const folderUnreadCount = unreadCounts[folderName] || 0
      const hasUnread = folderUnreadCount > 0 ? 'unread' : ''
      const isSelected = folderName === folderType ? 'selected' : ''

      return (
        <Link to={`/${app}/folder/${folderName}`} key={folderName}>
          <button className={`round-btn folder ${hasUnread} ${isSelected}`}>
            <i className={ICON_CLASSES[folderName]}></i>
          </button>
          <span className="folder-txt">{folderName}</span>
          <span className="folder-txt">{folderUnreadCount}</span>
        </Link>
      )
    })
  }

  return (
    <div className={`folders-nav ${isNavOpen ? 'selected' : ''}`}>
      {app === 'mail' &&
        <button className="compose-area">
          <div className="compose"><i className="fa-solid fa-pencil"></i></div>
          <span className="folder-txt">Compose</span>
        </button>
      }

      <div className="folders-list">
        {renderFolders()}
      </div>
    </div>
  )
}