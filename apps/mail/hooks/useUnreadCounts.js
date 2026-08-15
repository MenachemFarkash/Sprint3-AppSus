import { LOGGED_USER_EMAIL } from '../services/mail.service.js'

export function useUnreadCounts(mails) {
  if (!mails) return {}

  return mails.reduce((counts, mail) => {
    if (mail.isRead) return counts

    if (mail.removedAt) counts.trash++
    else {
      if (mail.to === LOGGED_USER_EMAIL) counts.inbox++
      if (mail.isStarred) counts.starred++
    }

    return counts
  }, { inbox: 0, starred: 0, sent: 0, draft: 0, trash: 0 })
}
