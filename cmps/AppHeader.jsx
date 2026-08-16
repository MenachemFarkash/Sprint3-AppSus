import { eventBusService } from '../services/event-bus.service.js'
import { UserAvatar } from './UserAvatar.jsx'
import { AppMenu } from './AppMenu.jsx'
import { FilterSection } from './FilterSection.jsx'
import { LOGGED_USER_FULLNAME, LOGGED_USER_COLOR } from '../services/user.service.js'

const { Link, useLocation } = ReactRouterDOM

export function AppHeader() {
    const currApp = useLocation().pathname.split('/')[1]

    function toggleFolderNav() {
        eventBusService.emit('toggle-folder-nav')
    }

    return (
        <header className="app-header">
            <button
                className="folder-nav-toggle round-btn"
                onClick={toggleFolderNav}
            >
                <img src="../assets/icons/folder-menu.svg" alt="folder-menu"/>
            </button>

            <Link className="app-logo" to="/">
                <img src={`../assets/icons/${currApp}.logo.png`} alt={`${currApp} logo`} />
            </Link>

            <FilterSection currApp={currApp} />

            <AppMenu />

            <button className="user-avatar-btn round-btn">
                <UserAvatar fullname={LOGGED_USER_FULLNAME} color={LOGGED_USER_COLOR} />
            </button>
        </header>
    )
}