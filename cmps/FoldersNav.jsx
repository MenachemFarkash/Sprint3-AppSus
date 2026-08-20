import { eventBusService } from '../services/event-bus.service.js'
import { FolderNavItem } from './FolderNavItem.jsx'

const { useState, useEffect } = React
const { useParams } = ReactRouter

// TODO: Click on compose should trigger a new mail creation

export function FoldersNav({ app, folders, unreadCounts = {} }) {
  const { type: folderType } = useParams()
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    return eventBusService.on('toggle-folder-nav', () => setIsNavOpen(prev => !prev))
  }, [])

  return (
    <div className={`folders-nav ${isNavOpen ? 'selected' : ''}`}>
      {app === 'mail' &&
        <button className="compose-area">
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
            key={folder.name}
          />
        ))}
      </div>
    </div>
  )
}
