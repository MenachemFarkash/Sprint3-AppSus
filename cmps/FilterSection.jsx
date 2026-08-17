export function FilterSection({ currApp }) {
    return (
        <div className="filter-section">
            <button className="search-button round-btn">
                <img className="search-icon" src="assets/icons/search-icon.svg" alt="search-icon" />
            </button>

            <input
                className="text-filter"
                type="text"
                placeholder={`Search ${currApp}`}
            />

            <button className="search-button round-btn">
                <img className="filter-icon" src="assets/icons/filter-icon.svg" alt="filter-icon" />
            </button>
        </div>
    )
}
