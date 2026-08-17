const { NavLink } = ReactRouterDOM
const { useRef } = React

export function AppMenu() {
    const dialogRef = useRef()

    function toggleAppMenu(ev) {
        const dialog = dialogRef.current
        if (dialog.open) return dialog.close()

        const btnRect = ev.currentTarget.getBoundingClientRect()
        dialog.style.top = `${btnRect.bottom + 8}px`
        dialog.style.right = `${window.innerWidth - btnRect.right}px`
        dialog.showModal()
    }

    function closeAppMenu() {
        dialogRef.current.close()
    }

    function onBackdropClick(ev) {
        if (ev.target === dialogRef.current) closeAppMenu()
    }

    return (
        <div className="app-menu">
            <button className="round-btn" onClick={toggleAppMenu}>
                <img src="../assets/icons/app-menu.svg" alt="apps-menu"/>
            </button>
            <dialog ref={dialogRef} className="app-menu-popup" onClick={onBackdropClick}>
                <nav>
                    <NavLink to="/" onClick={closeAppMenu}>Home</NavLink>
                    <NavLink to="/about" onClick={closeAppMenu}>About</NavLink>
                    <NavLink to="/mail" onClick={closeAppMenu}>Mail</NavLink>
                    <NavLink to="/note" onClick={closeAppMenu}>Note</NavLink>
                </nav>
            </dialog>
        </div>
    )
}
