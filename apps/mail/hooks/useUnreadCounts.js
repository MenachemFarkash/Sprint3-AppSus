import { LOGGED_USER_EMAIL } from '../../../services/user.service.js'

export function useUnreadCounts(mails) {
  if (!mails) return {}

  return mails.reduce((counts, mail) => {
    if (!mail.isRead && !mail.removedAt && mail.to === LOGGED_USER_EMAIL) {
      counts.inbox++
    }

    return counts
  }, { inbox: 0 })
}
