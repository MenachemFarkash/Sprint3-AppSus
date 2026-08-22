import { eventBusService } from '../services/event-bus.service.js'
import { FolderNavItem } from './FolderNavItem.jsx'

const { useState, useEffect } = React
const { useParams } = ReactRouter

export function FoldersNav({ app, folders, unreadCounts = {}, onCompose }) {
  const { type: folderType } = useParams()
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    return eventBusService.on('toggle-folder-nav', () => setIsNavOpen(prev => !prev))
  }, [])

  function closeNav() {
    setIsNavOpen(false)
  }

  return (
    <React.Fragment>
      <div className={`folders-nav ${isNavOpen ? 'selected' : ''}`}>
        <img className="folders-nav-logo" src={`assets/icons/${app}.logo.png`} alt={`${app} logo`} />

        {app === 'mail' &&
          <button className="compose-area" onClick={onCompose}>
            <div className="compose"><i className="fa-solid fa-pencil"></i></div>
            <span className="folder-txt">Compose</span>
          </button>
        }

        <div className="folders-list">
          {folders.map(folder => (
            <FolderNavItem
              app={app}
              folder={folder}
              folderType={folderType}
              unreadCount={unreadCounts[folder.name] || 0}
              onNavigate={closeNav}
              key={folder.name}
            />
          ))}
        </div>
      </div>

      <div className="folders-nav-backdrop" onClick={closeNav} />
    </React.Fragment>
  )
}
