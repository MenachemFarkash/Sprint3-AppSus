import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { LOGGED_USER_EMAIL } from '../../../services/user.service.js'

const MAIL_KEY = 'mailDB'
_createMails()

export const FOLDER_TYPES = ['inbox', 'starred', 'sent', 'draft', 'trash']

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
}

function query(filterBy = {}) {
    const {from, to, isRead, isStarred, labels, createdBetween, sentBetween, removedBetween, subject, body, txt} = filterBy
    
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
            if (isRead) {
                mails = mails.filter((mail) => mail.isRead === isRead)
            }
            if (isStarred) {
                mails = mails.filter((mail) => mail.isStarred === isStarred)
            }
            if (labels && labels.length) {
                mails = mails.filter(mail => 
                    Array.isArray(mail.labels) && labels.every(label => mail.labels.includes(label))
                )
            }
            if (createdBetween && (createdBetween.from || createdBetween.to)) {
                const fromTime = createdBetween.from ? +createdBetween.from : -Infinity
                const toTime = createdBetween.to ? +createdBetween.to : Infinity
                
                mails = mails.filter(({createdAt}) => {
                    return typeof createdAt === 'number' && createdAt >= fromTime && createdAt <= toTime
                })
            }
            if (sentBetween && (sentBetween.from || sentBetween.to)) {
                const fromTime = sentBetween.from ? +sentBetween.from : -Infinity
                const toTime = sentBetween.to ? +sentBetween.to : Infinity
                
                mails = mails.filter(({sentAt}) => {
                    return typeof sentAt === 'number' && sentAt >= fromTime && sentAt <= toTime
                })
            }
            if (removedBetween && (removedBetween.from || removedBetween.to)) {
                const fromTime = removedBetween.from ? +removedBetween.from : -Infinity
                const toTime = removedBetween.to ? +removedBetween.to : Infinity

                mails = mails.filter(({removedAt}) => {
                    return typeof removedAt === 'number' && removedAt >= fromTime && removedAt <= toTime
                })
            }
            if (subject) {
                const regExp = new RegExp(subject, 'i')
                mails = mails.filter(({subject}) => regExp.test(subject))
            }
            if (body) {
                const regExp = new RegExp(body, 'i')
                mails = mails.filter(({body}) => regExp.test(body))
            }
            if (txt) {
                const regExp = new RegExp(txt, 'i')
                    mails = mails.filter( ({ subject, body }) =>
                        regExp.test(subject) || regExp.test(body)
                )
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

function getEmptyMail() {
    return {
        body: '',
        createdAt: Date.now(),
        from: LOGGED_USER_EMAIL,
        isRead: false,
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
            // TODO: Use users db to get the user's name - not name property
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
        }
    ]

    mails.push(...mockMails)
    utilService.saveToStorage(MAIL_KEY, mails)
}

function _createMail() {
    const mail = getEmptyMail()
    mail.id = utilService.makeId()
    return mail
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