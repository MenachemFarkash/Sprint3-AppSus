import { mailService } from '../services/mail.service.js'
import {
  showErrorMsg,
  showSuccessMsg,
} from '../../../services/event-bus.service.js'

import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'

const { useState, useEffect } = React
const { useParams } = ReactRouter

export function MailIndex() {
  const { id: folderId } = useParams()
  const [selectedFolder, setSelectedFolder] = useState(folderId)

  const [mails, setMails] = useState(null)


  const [filterBy, setFilterBy] = useState({})

  useEffect(() => {
    loadMails()
  }, [filterBy])

  function loadMails() {
    mailService
      .query(filterBy)
      .then(setMails)
      .catch((err) => {
        showErrorMsg(`Error loading mails from ${selectedFolder}`)
        console.log(err)
      })
  }

  // Update specific mail property (front & back), and re-render MailIndex accordingly
  function onUpdateMail(mailId, update) {
    const mail = mails.find((mail) => mail.id === mailId)
    const updatedMail = { ...mail, ...update }

    mailService
      .save(updatedMail)
      .then(() => {
        setMails((prev) => {
          prev.map(((mail) => (mail.id === mailId ? updatedMail : mail)))
        })
        // Should update user based on the actual operation
// showErrorMsg()
      })
      .catch((err) => {
        console.log(err)
        showErrorMsg(`Could update mail ${mailId}`)
      })
  }


  return (
    <section className="mail-index">
      <MailFolderList />
      <div className="mails-section">
        <MailFilter />
        <MailList
          mails={mails}
          onUpdateMail={onUpdateMail}
        />
      </div>
    </section>
  )
}
