import { Loader } from '../../../cmps/Loader.jsx'
import { UserAvatar } from '../../../cmps/UserAvatar.jsx'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { utilService } from '../../../services/util.service.js'
import { mailService } from '../services/mail.service.js'
import { LOGGED_USER_EMAIL, LOGGED_USER_COLOR } from '../../../services/user.service.js'

const { useState, useEffect } = React
const { useParams } = ReactRouter
const { useNavigate } = ReactRouterDOM

export function MailDetails({ onUpdateMail, onDeleteMail }) {
  
  const { id: mailId, type: folderType } = useParams()
  const [mail, setMail] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    mailService.get(mailId)
    .then(mail => {
      setMail(mail)
      if (!mail.isRead && folderType !== 'sent' && folderType !== 'draft') {
        onUpdateMail(mailId, { isRead: true })
      }
    })
    .catch((err) => {
      console.log(err)
      showErrorMsg(`Failed to load mail ${mailId}`)
      onReturnToFolder()
    })
  }, [mailId])

  function onReturnToFolder() {
    navigate(`/mail/folder/${folderType || 'inbox'}`)
  }

  function onTrash() {
    onDeleteMail(id).then(onReturnToFolder)
  }

  // TODO: Notes integration - Move to notes page, and send object with needed property values to note creation 
  function onSaveAsNote() {}

  function onMarkUnread() {
    onUpdateMail(id, {isRead: false})
      .then(() => {
          showSuccessMsg('Mail marked as unread')
          onReturnToFolder()
        })
        .catch(err => {
          console.log(err)
          showErrorMsg('Failed mark mail as unread')
        })
  }

    function onStar() {
      const opposite = !isStarred

      setMail(prevMail => ({ ...prevMail, isStarred: opposite }))
      onUpdateMail(mailId, { isStarred: opposite })
        .catch(err => {
          console.log(err)
          showErrorMsg('Failed to star mail')
          setMail(prevMail => ({ ...prevMail, isStarred: opposite }))
        })
  }

    function onNavToMail(targetMailId) {
    onUpdateMail(targetMailId, { isRead: true })
      .catch(err => console.log(err))
    navigate(`/mail/folder/${folderType}/${targetMailId}`)
  }

  function renderNavButton(id, iconClass, isFirst) {
    const icon = <i className={`fa-solid ${iconClass}`}></i>
    const className = isFirst ? 'mail-nav first' : 'mail-nav'

    return id
      ? <button className={`round-btn lrg btn-nav ${className}`} onClick={() => onNavToMail(id)}>{icon}</button>
      : <button className={`round-btn lrg ${className}`} disabled>{icon}</button>
  }

  if (!mail) return <Loader />

  const { body, color, from, id, isStarred, name, nextMailId, prevMailId, sentAt, subject, to } = mail
  const userBgColor = from === LOGGED_USER_EMAIL ? LOGGED_USER_COLOR : color

  return <div className="mail-details">
    <div className="mail-options">
      <button className="round-btn lrg btn-nav" onClick={onReturnToFolder}><i className="fa-solid fa-arrow-left"></i></button>
      <button className="round-btn lrg btn-note" onClick={onSaveAsNote}><i className="fa-regular fa-lightbulb"></i></button>
      <button className={`round-btn lrg btn-star ${isStarred ? 'marked' : ''}`} onClick={onStar}>
        <i className="fa-solid fa-star icon-star-solid"></i>
        <i className="fa-regular fa-star icon-star-regular"></i>
      </button>
      <button className="round-btn lrg btn-mail" onClick={onMarkUnread}><i className="fa-regular fa-envelope"></i></button> 
      <button className="round-btn lrg btn-delete" onClick={onTrash}><i className="fa-regular fa-trash-can"></i></button>
      {renderNavButton(prevMailId, 'fa-chevron-left', true)}
      {renderNavButton(nextMailId, 'fa-chevron-right')}
    </div>

    <div className="mail-content">
      <p className="mail-subject">{subject}</p>
      <div className="mail-meta">
        <UserAvatar
          className="sender-avatar"
          fullname={name}
          color={userBgColor}
        />
        <div className="participants-details">
          <p>
            <span className="sender-name">{name}</span>
            <span className="small-txt meta-txt">{`< ${from} >`}</span>
            </p>
          <p className="small-txt meta-txt">{`to ${to}`}</p>
        </div>
        <div className="small-txt meta-txt sent-at">
          <span className="sent-at-full">{utilService.getFullDate(sentAt)}</span>
          <span className="sent-at-date-only">{utilService.getDateOnly(sentAt)}</span>
        </div>
      </div>
      <div className="mail-body">{body}</div>
    </div>
  </div>
}