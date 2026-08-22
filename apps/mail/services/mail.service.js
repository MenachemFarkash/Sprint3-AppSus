import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { LOGGED_USER_EMAIL } from '../../../services/user.service.js'

const MAIL_KEY = 'mailDB'
const DAY_MS = 24 * 60 * 60 * 1000
const DATE_WITHIN_OPTIONS = [
    { value: '', label: 'Any time' },
    { value: 1, label: '1 day' },
    { value: 3, label: '3 days' },
    { value: 7, label: '1 week' },
    { value: 14, label: '2 weeks' },
    { value: 30, label: '1 month' },
    { value: 60, label: '2 months' },
    { value: 90, label: '3 months' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
]
const SORT_BY_OPTIONS = [
    { value: '', label: 'Default' },
    { value: 'name', label: 'Sender' },
    { value: 'subject', label: 'Subject' },
    { value: 'sentAt', label: 'Date' },
]
const SORT_DIR_OPTIONS = [
    { value: 1, label: 'Ascending' },
    { value: -1, label: 'Descending' },
]
const SORT_COMPARATORS = {
    name: (a, b) => a.name.localeCompare(b.name),
    subject: (a, b) => a.subject.localeCompare(b.subject),
    sentAt: (a, b) => (a.sentAt || 0) - (b.sentAt || 0),
    createdAt: (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
}

_createMails()

export const FOLDER_TYPES = [
    { name: 'inbox', icon: 'inbox.icon.svg' },
    { name: 'starred', icon: 'starred.icon.svg' },
    { name: 'sent', icon: 'sent.icon.svg' },
    { name: 'draft', icon: 'draft.icon.svg' },
    { name: 'trash', icon: 'trash.icon.svg' },
]

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    bodyFromNoteElements,
}
export const mailFilterFields = [
    { name: 'from', label: 'From' },
    { name: 'to', label: 'To' },
    { name: 'subject', label: 'Subject' },
    { name: 'sentBetween', label: 'Date within', type: 'select', options: DATE_WITHIN_OPTIONS },
    { name: 'sortBy', label: 'Sort by', type: 'select', options: SORT_BY_OPTIONS },
    { name: 'sortDir', label: 'Direction', type: 'select', options: SORT_DIR_OPTIONS },
]

function query(filterBy = {}) {
    const {from, to, sentBetween, subject, txt, folder, sortBy, sortDir} = filterBy

    return storageService.query(MAIL_KEY)
        .then( mails => {

            if (from) {
                const regExp = new RegExp(from, 'i')
                mails = mails.filter(({ from }) => regExp.test(from))
            }
            if (to) {
                const regExp = new RegExp(to, 'i')
                mails = mails.filter(({ to }) => regExp.test(to))
            }
            if (sentBetween) {
                const fromTime = Date.now() - (+sentBetween) * DAY_MS

                mails = mails.filter(({sentAt}) => {
                    return typeof sentAt === 'number' && sentAt >= fromTime
                })
            }
            if (subject) {
                const regExp = new RegExp(subject, 'i')
                mails = mails.filter(({subject}) => regExp.test(subject))
            }
            if (txt) {
                const regExp = new RegExp(txt, 'i')
                    mails = mails.filter( ({ subject, body }) =>
                        regExp.test(subject) || regExp.test(body)
                )
            }
            if (folder) {
                mails = mails.filter(mail => _isInFolder(mail, folder))
            }
            const comparator = SORT_COMPARATORS[sortBy || (folder === 'draft' ? 'createdAt' : 'sentAt')]
            if (comparator) {
                const dir = sortBy ? (+sortDir || -1) : -1
                mails = [...mails].sort((a, b) => comparator(a, b) * dir)
            }
            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => _setNextPrevMailId(mail))
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) return storageService.put(MAIL_KEY, mail)
    return storageService.post(MAIL_KEY, mail)
}

// Function for notes integration
// 1. create a mail via
// {
//  ...getEmptyMail(),
//  name: LOGGED_USER_FULLNAME,
//  body: bodyFromNoteElements(note.elements)
// }
// 2. use mailService.save() to save the new mail as draft.
// 3. Get the new mail ID, then navigate to mail/folder/draft/{new mail id}
//
// Note: this was created based on what I saw in notes branch
function bodyFromNoteElements(elements = []) {
    return elements.map(el => {
        if (el.type === 'ul') {
            return el.items.map(item => `[${item.isChecked ? 'x' : ' '}] ${item.txt}`).join('\n')
        }
        if (el.type === 'img') return `[image: ${el.url}]`
        return el.txt || ''
    }).filter(Boolean).join('\n\n')
}

function getEmptyMail() {
    return {
        body: '',
        createdAt: Date.now(),
        from: LOGGED_USER_EMAIL,
        isRead: true,
        isStarred: false,
        labels: [],
        name: '',
        removedAt : null,
        sentAt : null,
        subject: '',
        to: ''
    }
}

function _createMails() {
    const mails = utilService.loadFromStorage(MAIL_KEY) || []
    if (mails.length > 0) return

    const mockMails = [
        {
            id: utilService.makeId(),
            body: 'Would love to catch up sometimes',
            color: utilService.getRandomColor(),
            createdAt: 1551133930500,
            from: 'momo@momo.com',
            isRead: false,
            isStarred: false,
            labels: ['important'],
            name: 'Momo Momo',
            removedAt: null,
            sentAt: 1551133930594,
            subject: 'Miss you!',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Reminder: standup moved to 9:30am tomorrow.',
            color: utilService.getRandomColor(),
            createdAt: 1551220330500,
            from: 'boss@work.com',
            isRead: true,
            isStarred: false,
            labels: ['work'],
            name: 'Sarah Cohen',
            removedAt: null,
            sentAt: 1551220330594,
            subject: 'Standup time change',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Your invoice #4521 has been paid. Thanks!',
            color: utilService.getRandomColor(),
            createdAt: 1551306730500,
            from: 'billing@shopify.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Shopify Billing',
            removedAt: null,
            sentAt: 1551306730594,
            subject: 'Payment confirmation',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Happy birthday! Hope you have an amazing day.',
            color: utilService.getRandomColor(),
            createdAt: 1551393130500,
            from: 'dana@friends.com',
            isRead: false,
            isStarred: true,
            labels: ['important'],
            name: 'Dana Levi',
            removedAt: null,
            sentAt: 1551393130594,
            subject: 'Happy birthday!',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Your flight to Berlin is confirmed for March 20th.',
            color: utilService.getRandomColor(),
            createdAt: 1551479530500,
            from: 'noreply@airlines.com',
            isRead: true,
            isStarred: true,
            labels: ['important'],
            name: 'SkyLine Airlines',
            removedAt: null,
            sentAt: 1551479530594,
            subject: 'Flight confirmation - Berlin',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Can you review the PR when you get a chance?',
            color: utilService.getRandomColor(),
            createdAt: 1551565930500,
            from: 'yossi@work.com',
            isRead: false,
            isStarred: false,
            labels: ['work'],
            name: 'Yossi Adiri',
            removedAt: null,
            sentAt: 1551565930594,
            subject: 'PR review needed',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: '50% off everything this weekend only!',
            color: utilService.getRandomColor(),
            createdAt: 1551652330500,
            from: 'deals@store.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'MegaStore Deals',
            removedAt: null,
            sentAt: 1551652330594,
            subject: 'Weekend sale',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Verify your new password to complete the reset.',
            color: utilService.getRandomColor(),
            createdAt: 1551738730500,
            from: 'security@appsus.com',
            isRead: false,
            isStarred: false,
            labels: ['important'],
            name: 'Appsus Security',
            removedAt: null,
            sentAt: 1551738730594,
            subject: 'Password reset',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Dinner Friday at 8? Let me know.',
            color: utilService.getRandomColor(),
            createdAt: 1551825130500,
            from: 'ronit@friends.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Ronit Bar',
            removedAt: null,
            sentAt: 1551825130594,
            subject: 'Dinner Friday?',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Your monthly statement is now available.',
            color: utilService.getRandomColor(),
            createdAt: 1551911530500,
            from: 'statements@bank.com',
            isRead: false,
            isStarred: false,
            labels: ['work'],
            name: 'National Bank',
            removedAt: null,
            sentAt: 1551911530594,
            subject: 'Monthly statement ready',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Thanks for the update, sounds good to me.',
            color: utilService.getRandomColor(),
            createdAt: 1551997930500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Mahatma Appsus',
            removedAt: null,
            sentAt: 1551997930594,
            subject: 'Re: Standup time change',
            to: 'boss@work.com'
        },
        {
            id: utilService.makeId(),
            body: 'Attached the files you asked for, let me know if anything is missing.',
            color: utilService.getRandomColor(),
            createdAt: 1552084330500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: ['work'],
            name: 'Mahatma Appsus',
            removedAt: null,
            sentAt: 1552084330594,
            subject: 'Files attached',
            to: 'yossi@work.com'
        },
        {
            id: utilService.makeId(),
            body: 'Hey, are we still on for Friday dinner?',
            color: utilService.getRandomColor(),
            createdAt: 1552170730500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Mahatma Appsus',
            removedAt: null,
            sentAt: 1552170730594,
            subject: 'Re: Dinner Friday?',
            to: 'ronit@friends.com'
        },
        {
            id: utilService.makeId(),
            body: 'Hi team, just wanted to follow up on the budget for next quarter...',
            color: utilService.getRandomColor(),
            createdAt: 1552257130500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Mahatma Appsus',
            removedAt: null,
            sentAt: null,
            subject: 'Budget follow up',
            to: 'boss@work.com'
        },
        {
            id: utilService.makeId(),
            body: 'Draft: notes for the trip itinerary, still need to fill in hotel info.',
            color: utilService.getRandomColor(),
            createdAt: 1552343530500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Mahatma Appsus',
            removedAt: null,
            sentAt: null,
            subject: 'Trip itinerary',
            to: ''
        },
        {
            id: utilService.makeId(),
            body: 'You have won a free cruise! Click here to claim.',
            color: utilService.getRandomColor(),
            createdAt: 1552429930500,
            from: 'spam@lottery.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Lucky Winner',
            removedAt: 1552516330594,
            sentAt: 1552429930594,
            subject: 'You won!',
            to: 'user@appsus.com'
        },
        {
            id: utilService.makeId(),
            body: 'Old meeting notes, no longer needed.',
            color: utilService.getRandomColor(),
            createdAt: 1552516330500,
            from: 'user@appsus.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Mahatma Appsus',
            removedAt: 1552602730594,
            sentAt: 1552516330594,
            subject: 'Old meeting notes',
            to: 'yossi@work.com'
        },
        {
            id: utilService.makeId(),
            body: 'Unsubscribe confirmed, you will no longer receive these emails.',
            color: utilService.getRandomColor(),
            createdAt: 1552602730500,
            from: 'noreply@newsletter.com',
            isRead: true,
            isStarred: false,
            labels: [],
            name: 'Weekly Newsletter',
            removedAt: 1552689130594,
            sentAt: 1552602730594,
            subject: 'Unsubscribed',
            to: 'user@appsus.com'
        }
    ]

    mails.push(...mockMails)
    utilService.saveToStorage(MAIL_KEY, mails)
}

const folderCheckers = {
    trash: mail => Boolean(mail.removedAt),
    starred: mail => mail.isStarred && !mail.removedAt,
    sent: mail => mail.from === LOGGED_USER_EMAIL && Boolean(mail.sentAt) && !mail.removedAt,
    draft: mail => mail.from === LOGGED_USER_EMAIL && !mail.sentAt && !mail.removedAt,
    inbox: mail => mail.to === LOGGED_USER_EMAIL && !mail.removedAt,
}

function _isInFolder(mail, folder) {
    const checker = folderCheckers[folder]
    return checker ? checker(mail) : true
}

function _setNextPrevMailId(mail) {
    return storageService.query(MAIL_KEY)
        .then( mails => {
            const mailIdx = mails.findIndex( currMail => currMail.id === mail.id)
            const nextMail = mails[mailIdx + 1] || null
            const prevMail = mails[mailIdx - 1] || null

            mail.nextMailId = nextMail ? nextMail.id : null
            mail.prevMailId = prevMail ? prevMail.id : null
            
            return mail
        })
}