import { utilService } from '../../../services/util.service.js'

export function MailPreview({ mail, onUpdateMail }) {
  const { body, createdAt, isStarred, name, subject } = mail

  return (
    <li className="mail-preview">
      <button className="btn-star">
        <i
          className={isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star'}
        ></i>
      </button>
      <p className="sender-name">{name}</p>
      <p className="mail-intro">
        <span>{subject}</span>-<span>{body}</span>
      </p>
      <p className="received-at">{getReadableDate(createdAt)}</p>
    </li>
  )
}

function getReadableDate(date) {
  const month = utilService.getMonthName(date)
  const day = utilService.getDayNumber(date)

  return `${month} ${day}`
}
