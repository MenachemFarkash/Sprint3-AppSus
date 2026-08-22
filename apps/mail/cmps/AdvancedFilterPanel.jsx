
export function AdvancedFilterPanel({ fields, values, onChange, onClear }) {
    const { filterFields, sortByField, sortDirField } = fields.reduce((acc, field) => {
        if (field.name === 'sortBy') acc.sortByField = field
        else if (field.name === 'sortDir') acc.sortDirField = field
        else acc.filterFields.push(field)
        return acc
    }, { filterFields: [], sortByField: null, sortDirField: null })

    return (
        <div className="filter-panel">
            {filterFields.map(field => {
                const fieldType = (field.type === 'select')
                    ? <select
                        id={field.name}
                        name={field.name}
                        value={values[field.name]}
                        onChange={onChange}
                        >
                            {field.options.map(({ value, label }) => (
                                <option key={label} value={value}>{label}</option>
                            ))}
                      </select>

                    : <input
                        id={field.name}
                        name={field.name}
                        value={values[field.name]}
                        onChange={onChange}
                      />

                return (<React.Fragment key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {fieldType}
                </React.Fragment>
            )})}

            {sortByField && sortDirField &&
                <div className="filter-panel-sort">
                    <label htmlFor={sortByField.name}>{sortByField.label}</label>
                    <select
                        id={sortByField.name}
                        name={sortByField.name}
                        value={values[sortByField.name]}
                        onChange={onChange}
                        >
                            {sortByField.options.map(({ value, label }) => (
                                <option key={label} value={value}>{label}</option>
                            ))}
                    </select>

                    <label htmlFor={sortDirField.name}>{sortDirField.label}</label>
                    <select
                        id={sortDirField.name}
                        name={sortDirField.name}
                        value={values[sortDirField.name]}
                        onChange={onChange}
                        >
                            {sortDirField.options.map(({ value, label }) => (
                                <option key={label} value={value}>{label}</option>
                            ))}
                    </select>
                </div>
            }

            <div className="filter-panel-actions">
                <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={onClear}
                >
                    Clear filter
                </button>
                
                <button
                    type="submit"
                    className="btn-send"
                >
                    Search
                </button>
            </div>
        </div>
    )
}
