
export function AdvancedFilterPanel({ fields, values, onChange, onClear }) {
    return (
        <div className="filter-panel">
            {fields.map(field => {
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
                    className="search-btn"
                >
                    Search
                </button>
            </div>
        </div>
    )
}
