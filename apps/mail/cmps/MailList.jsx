import { MailPreview } from '../cmps/MailPreview.jsx'
import { Loader } from '../../../cmps/Loader.jsx'

const { Link } = ReactRouterDOM

export function MailList({ mails, onUpdateMail }) {
  if (!mails) return <Loader />
  return (
    <section className="mail-list">
      <ul>
        {mails.map((mail) => (
          <Link to={`/mail/${mail.id}`} key={mail.id}>
            <MailPreview mail={mail} onUpdateMail={onUpdateMail} />
          </Link>
        ))}
      </ul>
    </section>
  )
}
