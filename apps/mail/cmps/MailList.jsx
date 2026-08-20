import { MailPreview } from '../cmps/MailPreview.jsx'
import { Loader } from '../../../cmps/Loader.jsx'

export function MailList({ mails, onUpdateMail, onDeleteMail }) {
  if (!mails) return <Loader />
  return (
    <ul className="mail-list">
        {mails.map((mail) => (
          <MailPreview mail={mail} onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} key={mail.id}/>
        ))}
    </ul>
  )
}
