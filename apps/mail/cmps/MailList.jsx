import { MailPreview } from '../cmps/MailPreview.jsx'
import { Loader } from '../../../cmps/Loader.jsx'

export function MailList({ mails, onUpdateMail, onDeleteMail }) {
  if (!mails) return <Loader />
  return (
    <ul className="mail-list">
        <li className="mail-sort">
          <button className="round-btn">
            <i className="fa-solid fa-star"></i>
          </button>
          <span>Sender</span>
          <span>Mail</span>
          <span>Date</span>
        </li>
        {mails.map((mail) => (
          <MailPreview mail={mail} onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} key={mail.id}/>
        ))}
    </ul>
  )
}
