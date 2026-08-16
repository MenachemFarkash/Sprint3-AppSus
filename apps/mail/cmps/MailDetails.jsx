import { Loader } from '../../../cmps/Loader.jsx'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { utilService } from '../../../services/util.service.js'
import { mailService } from '../services/mail.service.js'

const { useState, useEffect } = React
const { useParams } = ReactRouter
const { useNavigate, Link } = ReactRouterDOM

export function MailDetails({ onUpdateMail, onDeleteMail }) {
  
  const { id: mailId, type: folderType } = useParams()
  const [mail, setMail] = useState(null)
  const navigate = useNavigate()
  
  
  useEffect(() => {
    mailService.get(mailId)
    .then(setMail)
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

  // TODO: Move to notes page, and send object with needed property values to note creation 
  function onSaveAsNote() {

  }

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

    function renderNavButton(id, iconClass, isFirst) {
    const icon = <i className={`fa-solid ${iconClass}`}></i>
    const className = isFirst ? 'mail-nav first' : 'mail-nav' 
    
    return id
      ? <Link className={className} to={`/mail/folder/${folderType}/${id}`}><button className="round-btn lrg btn-nav">{icon}</button></Link>
      : <button className={`round-btn lrg ${className}`} disabled>{icon}</button>
  }

  if (!mail) return <Loader />

  const { body, from, id, name, nextMailId, prevMailId, sentAt, subject, to } = mail

  return <div className="mail-details">
    <div className="mail-options">
      <button className="round-btn lrg btn-nav" onClick={onReturnToFolder}><i className="fa-solid fa-arrow-left"></i></button>
      <button className="round-btn lrg btn-note" onClick={onSaveAsNote}><i className="fa-regular fa-lightbulb"></i></button>
      <button className="round-btn lrg btn-mail" onClick={onMarkUnread}><i className="fa-regular fa-envelope"></i></button> 
      <button className="round-btn lrg btn-delete" onClick={onTrash}><i className="fa-regular fa-trash-can"></i></button>
      {renderNavButton(prevMailId, 'fa-chevron-left', true)}
      {renderNavButton(nextMailId, 'fa-chevron-right')}
    </div>

    <div className="mail-content">
      <p className="mail-subject">{subject}</p>
      <div className="mail-meta">
        {/* TODO: Should use a db for users. Then, I will be able to use user's avatar */}
        <img
          className="user-avatar"
          src="assets/img/avatar.png"
          alt="user-avatar"
          onError={(ev) => (ev.target.src = 'assets/img/avatar.png')}
        />
        <div className="participants-details">
          <p>
            <span className="sender-name">{name}</span>
            <span className="small-txt meta-txt">{`< ${from} >`}</span>
            </p>
            {/* Add function to render current user's username instead of mail if receiving user is me. Requires user service and function to check if receiever is current user. If not, render the target user */}
          <p className="small-txt meta-txt">{`to ${to}`}</p>
        </div>
        <div className="small-txt meta-txt">{utilService.getFullDate(sentAt)}</div>
      </div>
      <div className="mail-body">{body}</div>
    </div>
  </div>
}