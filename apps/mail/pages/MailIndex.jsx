import { mailService, FOLDER_TYPES } from '../services/mail.service.js'
import { utilService } from '../../../services/util.service.js'
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
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {
  const { id: mailId, type: folderType } = useParams()
  const [searchParams] = useSearchParams()
  const filterBy = utilService.searchParamsToFilterBy(searchParams)

  const [allMails, setAllMails] = useState(null)
  const unreadCounts = useUnreadCounts(allMails)

  const [mails, setMails] = useState(null)

  useEffect(() => {
    loadAllMails()
  }, [])

  useEffect(() => {
    loadMails()
  }, [searchParams, folderType])

  function loadMails() {
    mailService
      .query({ ...filterBy, folder: folderType })
      .then(setMails)
      .catch((err) => {
        showErrorMsg(`Error loading mails from ${folderType}`)
        console.log(err)
      })
  }

  function loadAllMails() {
    return mailService.query({})
      .then(setAllMails)
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
      .then(loadAllMails)
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
        .then(loadAllMails)
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
