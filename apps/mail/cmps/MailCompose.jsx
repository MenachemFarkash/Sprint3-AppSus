import { mailService } from '../services/mail.service.js'
import { LOGGED_USER_FULLNAME } from '../../../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React

export function MailCompose({ mailId, onClose, onMailSave }) {
  const [mail, setMail] = useState(null)

  const draftRef = useRef({ mail: null, snapshot: null })
  const statusRef = useRef('idle')
  const onMailSaveRef = useRef(onMailSave)
  const formRef = useRef(null)
  const toRef = useRef(null)

  useEffect(() => {
    onMailSaveRef.current = onMailSave
  }, [onMailSave])

  useEffect(() => {
    if (mailId) {
      mailService.get(mailId).then(loadedMail => {
        draftRef.current = { mail: loadedMail, snapshot: JSON.stringify(loadedMail) }
        setMail(loadedMail)
      })
    } else {
      const newMail = { ...mailService.getEmptyMail(), name: LOGGED_USER_FULLNAME }
      draftRef.current = { mail: newMail, snapshot: null }
      setMail(newMail)
    }
  }, [mailId])

  useEffect(() => {
    const interval = setInterval(persistMail, 5000)
    return () => {
      clearInterval(interval)
      persistMail()
    }
  }, [])

  function persistMail() {
    const { mail: currMail, snapshot: savedSnapshot } = draftRef.current
    if (!currMail || statusRef.current !== 'idle' || currMail.sentAt) return

    const isEmpty = !currMail.to.trim() && !currMail.subject.trim() && !currMail.body.trim()

    if (isEmpty) {
      if (!currMail.id) return
      statusRef.current = 'saving'
      mailService.remove(currMail.id).then(() => {
        draftRef.current = { mail: { ...draftRef.current.mail, id: null }, snapshot: null }
        onMailSaveRef.current()
      })
      .catch(err => console.log(err))
      .finally(() => { statusRef.current = 'idle' })
      return
    }

    const snapshot = JSON.stringify(currMail)
    if (snapshot === savedSnapshot) return

    statusRef.current = 'saving'
    mailService.save(currMail).then(savedMail => {
      draftRef.current = { mail: { ...draftRef.current.mail, id: savedMail.id }, snapshot: JSON.stringify(savedMail) }
      setMail(draftRef.current.mail)
      onMailSaveRef.current()
    })
    .catch(err => console.log(err))
    .finally(() => { statusRef.current = 'idle' })
  }

  function handleChange({ target }) {
    const { name, value } = target
    const updatedMail = { ...draftRef.current.mail, [name]: value }
    draftRef.current = { ...draftRef.current, mail: updatedMail }
    setMail(updatedMail)

    const { to, subject, body } = updatedMail
    if (!updatedMail.id && (to.trim() || subject.trim() || body.trim())) persistMail()
  }

  function onSend() {
    toRef.current.setCustomValidity(toRef.current.validity.valueMissing ? 'Please specify recipient.' : '')
    if (!formRef.current.reportValidity()) return

    const sentMail = { ...draftRef.current.mail, sentAt: Date.now() }
    draftRef.current = { ...draftRef.current, mail: sentMail }
    mailService.save(sentMail).then(() => {
      onMailSaveRef.current()
      onClose()
      showSuccessMsg('Mail sent')
    })
    .catch(err => {
      console.log(err)
      showErrorMsg('Failed to send mail')
    })
  }

  function onDelete() {
    if (!draftRef.current.mail.id) return onClose()
    statusRef.current = 'deleted'
    mailService.remove(draftRef.current.mail.id).then(() => {
      onMailSaveRef.current()
      onClose()
    })
    .catch(err => {
      console.log(err)
      showErrorMsg('Failed to delete draft')
    })
  }

  if (!mail) return null

  const { body, subject, to } = mail

  return (
    <React.Fragment>
      <div className="mail-compose-backdrop" onClick={onClose} />
      <div className="mail-compose">
        <div className="compose-header">
          <span className="compose-title">New Message</span>

          <button className="btn-close square-btn meta-txt"
            onClick={onClose}
          >
              <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form ref={formRef} onSubmit={e => e.preventDefault()}>
          <input
            ref={toRef}
            className="compose-field"
            type="email"
            name="to"
            placeholder="Recipients"
            required
            value={to}
            onChange={handleChange}
          />

          <input
            className="compose-field"
            name="subject"
            placeholder="Subject"
            required
            value={subject}
            onChange={handleChange}
          />

          <textarea
            className="compose-body"
            name="body"
            required
            value={body}
            onChange={handleChange}
          ></textarea>
        </form>

        <div className="compose-footer">
          <button className="btn-send" onClick={onSend}>Send</button>
          <button className="round-btn lrg btn-delete" onClick={onDelete}>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}
