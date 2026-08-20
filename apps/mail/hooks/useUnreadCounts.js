import { LOGGED_USER_EMAIL } from '../../../services/user.service.js'

export function useUnreadCounts(mails) {
  if (!mails) return {}

  return mails.reduce((counts, mail) => {
    if (!mail.removedAt && !mail.sentAt && mail.from !== LOGGED_USER_EMAIL) {
      counts.draft++
    }

    if (!mail.isRead && !mail.removedAt && mail.to === LOGGED_USER_EMAIL) {
      counts.inbox++
    }

    return counts
  }, { inbox: 0, draft: 0 })
}
