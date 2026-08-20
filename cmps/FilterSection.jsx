import { utilService } from '../services/util.service.js'
import { AdvancedFilterPanel } from '../apps/mail/cmps/AdvancedFilterPanel.jsx'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function FilterSection({ currApp, routeKey, txtToFilterBy, filterByToTxt, advancedFilterFields }) {
    const sectionRef = useRef(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const filterBy = utilService.searchParamsToFilterBy(searchParams)

    const [txt, setTxt] = useState('')
    const [advFilter, setAdvFilter] = useState(() =>
        Object.fromEntries((advancedFilterFields || []).map(field => [field.name, '']))
    )
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    // Keep form in sync with relevant filterBy
    useEffect(() => {
        setTxt(filterByToTxt ? filterByToTxt(filterBy) : (filterBy.txt || ''))
        if (advancedFilterFields) {
            setAdvFilter(Object.fromEntries(advancedFilterFields.map(field => [field.name, filterBy[field.name] || ''])))
        }
    }, [searchParams])

    // Reset search filter when the app or its folder changes
    useEffect(() => {
        setIsPanelOpen(false)
        setSearchParams({}, { replace: true })
    }, [routeKey])

    // Close advanced filter if open and click outside of it
    useEffect(() => {
        if (!isPanelOpen) return

        function handleClickOutside(ev) {
            if (sectionRef.current && !sectionRef.current.contains(ev.target)) {
                setIsPanelOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isPanelOpen])

    function handleAdvChange({ target }) {
        const { name, value } = target
        setAdvFilter(prev => ({ ...prev, [name]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const nextFilterBy = txtToFilterBy ? txtToFilterBy(txt) : { txt }
        if (advancedFilterFields) {
            advancedFilterFields.forEach(({ name }) => {
                if (advFilter[name]) nextFilterBy[name] = advFilter[name]
            })
        }
        setSearchParams(nextFilterBy)
        setIsPanelOpen(false)
    }

    function clearFilter() {
        setSearchParams({})
    }

    return (
        <div className="filter-section" ref={sectionRef}>
            <form className="filter-bar" onSubmit={handleSubmit}>
                <button type="submit" className="search-button round-btn">
                    <img className="search-icon" src="assets/icons/search.icon.svg" alt="search-icon" />
                </button>

                <input
                    className="text-filter"
                    type="text"
                    placeholder={`Search ${currApp}`}
                    value={txt}
                    onChange={({ target }) => setTxt(target.value)}
                />

                {advancedFilterFields &&
                    <button
                        type="button"
                        className={`search-button round-btn${Object.keys(filterBy).some(key => key !== 'txt') ? ' has-filter' : ''}`}
                        onClick={() => setIsPanelOpen(open => !open)}
                    >
                        <img className="filter-icon" src="assets/icons/filter.icon.svg" alt="filter-icon" />
                    </button>
                }

                {advancedFilterFields && isPanelOpen &&
                    <AdvancedFilterPanel
                        fields={advancedFilterFields}
                        values={advFilter}
                        onChange={handleAdvChange}
                        onClear={clearFilter}
                    />
                }
            </form>
        </div>
    )
}
