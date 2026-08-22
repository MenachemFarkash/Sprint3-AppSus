import { eventBusService } from '../services/event-bus.service.js'
import { UserAvatar } from './UserAvatar.jsx'
import { AppMenu } from './AppMenu.jsx'
import { FilterSection } from './FilterSection.jsx'
import { APP_CONFIG } from '../apps/apps.config.js'
import { LOGGED_USER_FULLNAME, LOGGED_USER_COLOR } from '../services/user.service.js'

const { Link, useLocation } = ReactRouterDOM

export function AppHeader() {
    const { pathname } = useLocation()
    const currApp = pathname.split('/')[1] || 'about'
    const routeKey = pathname.split('/').slice(0, 4).join('/')

    const { hasFolderNav, txtToFilterBy, filterByToTxt, advancedFilterFields } = APP_CONFIG[currApp] || {}

    const pathSegments = pathname.split('/').filter(Boolean)
    const folderType = pathSegments[2]
    const mailId = pathSegments[3]
    
    const isMailDetails = (currApp === 'mail') && Boolean(mailId) && (folderType !== 'draft')

    function toggleFolderNav() {
        eventBusService.emit('toggle-folder-nav')
    }

    return (
        <header className={`app-header ${isMailDetails ? 'mail-details-open' : ''}`}>
            {hasFolderNav &&
                <button
                    className="folder-nav-toggle round-btn"
                    onClick={toggleFolderNav}
                >
                    <img src="assets/icons/folder-menu.icon.svg" alt="folder-menu" />
                </button>
            }

            <Link className="app-logo" to="/">
                <img src={`assets/icons/${currApp}.logo.png`} alt={`${currApp} logo`} />
            </Link>

            {hasFolderNav &&
                <FilterSection
                    currApp={currApp}
                    routeKey={routeKey}
                    txtToFilterBy={txtToFilterBy}
                    filterByToTxt={filterByToTxt}
                    advancedFilterFields={advancedFilterFields}
                />
            }

            <AppMenu />

            <button className="user-avatar-btn round-btn">
                <UserAvatar fullname={LOGGED_USER_FULLNAME} color={LOGGED_USER_COLOR} />
            </button>
        </header>
    )
}
