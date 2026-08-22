import { utilService } from '../../../services/util.service.js'

const { useParams } = ReactRouter
const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onUpdateMail, onDeleteMail }) {
  const { type: folderType } = useParams()
  const navigate = useNavigate()
  
  function handleMailClick() {
    onUpdateMail(mailId, { isRead: true })
    navigate(`/mail/folder/${folderType}/${mailId}`)
  }
  
  function handleToggleStar(ev) {
    ev.stopPropagation()
    onUpdateMail(mailId, {isStarred: !isStarred})
  }
  
  function handleToggleIsRead(ev) {
    ev.stopPropagation()
    onUpdateMail(mailId, {isRead: !isRead})
  }

  function handleSaveAsNote(ev) {
    ev.stopPropagation()
    // TODO: Integrate with Notes
  }
  
  function handleDeleteMail(ev) {
    ev.stopPropagation()
    onDeleteMail(mailId)
  }
  
  const { body, createdAt, id: mailId, isRead, isStarred, name, sentAt, subject } = mail
  const isDraft = !sentAt

  return (
    <li
      className={`mail-preview ${isRead ? 'read' : ''}`}
      onClick={handleMailClick}
    >
      <button
        className={`round-btn btn-star ${isStarred ? 'marked' : ''}`}
        onClick={handleToggleStar}
      >
        <i className="fa-solid fa-star icon-star-solid"></i>
        <i className="fa-regular fa-star icon-star-regular"></i>
      </button>

      <p className={`sender-name ${isRead ? '' : 'bold-txt'} ${isDraft ? 'draft-label' : ''}`}>
        {isDraft ? 'Draft' : name}
      </p>

      <p className="mail-intro">
        <span className={isRead ? '' : 'bold-txt'}>{subject}</span>
        <span> - </span>
        <span className="meta-txt">{body}</span>
      </p>
      
      <p className={`received-at ${isRead ? 'meta-txt' : ''}`}>{utilService.getReadableDate(createdAt)}</p>

      <div className="hover-actions">
        <button className={`round-btn lrg btn-mail ${isRead ? '' : 'unread'}`} onClick={handleToggleIsRead}>
          <i className="fa-regular fa-envelope icon-envelope-closed"></i>
          <i className="fa-regular fa-envelope-open icon-envelope-open"></i>
        </button>

        <button className="round-btn lrg btn-note" onClick={handleSaveAsNote}>
          <i className="fa-regular fa-lightbulb"></i>
        </button>

        <button className="round-btn lrg btn-delete" onClick={handleDeleteMail}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </li>
  )
}
