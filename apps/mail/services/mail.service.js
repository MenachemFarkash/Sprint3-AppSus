import { utilService } from "../../../services/util.service.js"
import { storageService } from "../../../services/async-storage.service.js"

const loggedUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

const MAIL_KEY = 'mailDB'
_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
}

window.cs = mailService

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
        .then(mail => {
            return mail
        })
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
        from: loggedUser.email,
        isRead: false,
        isStarred: false,
        labels: [],
        removedAt : null,
        sentAt : null,
        subject: '',
        to: ''
    }
}

function _createMails() {
    const mails = utilService.loadFromStorage(MAIL_KEY) || []
    if (mails.length > 0) return

    const mail = {
        id: 'e101',
        body: 'Would love to catch up sometimes',
        createdAt : 1551133930500,
        from: 'momo@momo.com',
        isRead: false,
        isStarred: false,
        labels: ['important'],
        removedAt : null,
        sentAt : 1551133930594,
        subject: 'Miss you!',
        to: 'user@appsus.com'
    }
    
    mails.push(mail)
    utilService.saveToStorage(MAIL_KEY, mails)
}

function _createMail() {
    const mail = getEmptyMail()
    mail.id = utilService.makeId()
    return mail
}