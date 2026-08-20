import { mailFilterFields } from './mail/services/mail.service.js'

// Single place AppHeader/FilterSection look up per-app header + filter behavior
// Goal is for those shared components to stay generic and don't import individual app modules themselves
export const APP_CONFIG = {
    mail: {
        hasFolderNav: true,
        txtToFilterBy: txt => txt.trim() ? { txt: txt.trim() } : {},
        filterByToTxt: filterBy => filterBy.txt || '',
        advancedFilterFields: mailFilterFields,
    },
    
    // Note: not adding txtToFilterBy, filterByToTxt, advancedFilterFields will fall back to
    // default plain-txt filter (filterBy.txt); no advanced panel.
    note: {
        hasFolderNav: true,
    },
}
