import { mailService, FOLDER_TYPES } from '../services/mail.service.js'
import {
  showErrorMsg,
  showSuccessMsg,
} from '../../../services/event-bus.service.js'

import { FoldersNav } from '../../../cmps/FoldersNav.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { useUnreadCounts } from '../hooks/useUnreadCounts.js'

const { useState, useEffect } = React
const { useParams } = ReactRouter

export function MailIndex() {
  const { id: mailId, type: folderType } = useParams()

  const [mails, setMails] = useState(null)
  const unreadCounts = useUnreadCounts(mails)

  // TODO: update filterBy based on folderType
  const [filterBy, setFilterBy] = useState({})

  useEffect(() => {
    loadMails()
  }, [filterBy])

  function loadMails() {
    mailService
      .query(filterBy)
      .then(setMails)
      .catch((err) => {
        showErrorMsg(`Error loading mails from ${folderType}`)
        console.log(err)
      })
  }

  // Update specific mail property (front & back), and re-render MailIndex accordingly
  function onUpdateMail(mailId, update) {
    const mail = mails.find((currMail) => currMail.id === mailId)
    const updatedMail = { ...mail, ...update }

    function replaceMail(newMail) {
      setMails((prev) =>
        prev.map((currMail) => (currMail.id === mailId ? newMail : currMail))
      )
    }

    replaceMail(updatedMail)

    return mailService
      .save(updatedMail)
      .catch((err) => {
        console.log(err)
        showErrorMsg(`Could update mail ${mailId}`)
        replaceMail(mail)
      })
  }

  // Hard-delete if mail is already in trash (removedAt set), otherwise move to trash
  function onDeleteMail(mailId) {
    const mail = mails.find((currMail) => currMail.id === mailId)

    if (mail.removedAt) {
      return mailService
        .remove(mailId)
        .then(() => {
          setMails((prev) => prev.filter((currMail) => currMail.id !== mailId))
          showSuccessMsg(`Mail ${mailId} removed`)
        })
        .catch((err) => {
          console.log(err)
          showErrorMsg(`Could not delete mail ${mailId}`)
        })
    }

    return onUpdateMail(mailId, { removedAt: Date.now() })
      .then(() => showSuccessMsg('Mail moved to trash'))
  }

  return (
    <section className="mail-index">
      <FoldersNav app="mail" folders={FOLDER_TYPES} unreadCounts={unreadCounts} />

      {mailId
        ? <MailDetails onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} />
        : <MailList mails={mails} onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} />
      }
    </section>
  )
}
