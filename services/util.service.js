export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getRandomColor,
    padNum,
    getFullDate,
    getDayName,
    getDayNumber,
    getMonthName,
    getReadableDate,
    loadFromStorage,
    saveToStorage,
    searchParamsToFilterBy
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return JSON.parse(val)
}

function searchParamsToFilterBy(searchParams) {
    return Object.fromEntries(searchParams.entries())
}

function makeId(length = 6) {
    var txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getFullDate(date) {
    date = new Date(date)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })
}

function getDayName(date, locale) {
    date = new Date(date)
    return date.toLocaleDateString(locale, { weekday: 'long' })
}

function getDayNumber(date) {
    date = new Date(date)
    return date.getDate()
}

function getReadableDate(date) {
    const now = new Date()
    const isFromLastDay = now - new Date(date) < 24 * 60 * 60 * 1000
    const isFromStartOfMonth =
        new Date(date).getMonth() === now.getMonth() &&
        new Date(date).getFullYear() === now.getFullYear()

    if (isFromLastDay) {
        return new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }
    if (isFromStartOfMonth) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }
    return new Date(date).toLocaleDateString('en-GB')
}

function getMonthName(date, isFullName) {
    date = new Date(date)
    
    const longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    if (isFullName) return longMonthNames[date.getMonth()]
    return shortMonthNames[date.getMonth()]
    
}