import { mailService, FOLDER_TYPES } from '../services/mail.service.js'
import { utilService } from '../../../services/util.service.js'
import {
  showErrorMsg,
  showSuccessMsg,
} from '../../../services/event-bus.service.js'
import { FoldersNav } from '../../../cmps/FoldersNav.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { useUnreadCounts } from '../hooks/useUnreadCounts.js'

const { useState, useEffect } = React
const { useParams } = ReactRouter
const { useSearchParams, useNavigate } = ReactRouterDOM

export function MailIndex() {
  const { id: mailId, type: folderType } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const filterBy = utilService.searchParamsToFilterBy(searchParams)

  const [allMails, setAllMails] = useState(null)
  const unreadCounts = useUnreadCounts(allMails)

  const [mails, setMails] = useState(null)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    utilService.setFavicon('assets/icons/mail.icon.png')
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

  // Hard-delete if mail is already in trash (removedAt set) or is a draft, otherwise move to trash
  function onDeleteMail(mailId) {
    const mail = mails.find((currMail) => currMail.id === mailId)

    if (mail.removedAt || !mail.sentAt) {
      setMails((prev) => prev.filter((currMail) => currMail.id !== mailId))
      showSuccessMsg(`Mail ${mailId} removed`)

      return mailService
        .remove(mailId)
        .then(loadAllMails)
        .catch((err) => {
          console.log(err)
          showErrorMsg(`Could not delete mail ${mailId}`)
          loadMails()
        })
    }

    return onUpdateMail(mailId, { removedAt: Date.now() })
      .then(() => showSuccessMsg('Mail moved to trash'))
  }

  function onCompose() {
    setIsComposing(true)
  }

  function onCloseCompose() {
    setIsComposing(false)
    if (folderType === 'draft') {
      if (mailId) navigate('/mail/folder/draft')
      loadMails()
    }
  }

  function onMailSave() {
    loadMails()
    loadAllMails()
  }

  const isDraftCompose = folderType === 'draft' && Boolean(mailId)

  return (
    <section className="mail-index">
      <FoldersNav app="mail" folders={FOLDER_TYPES} unreadCounts={unreadCounts} onCompose={onCompose} />

      {mailId && !isDraftCompose
        ? <MailDetails onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} />
        : <MailList mails={mails} onUpdateMail={onUpdateMail} onDeleteMail={onDeleteMail} />
      }

      {(isComposing || isDraftCompose) &&
        <MailCompose
          key={isDraftCompose ? mailId : 'new'}
          mailId={isDraftCompose ? mailId : null}
          onClose={onCloseCompose}
          onMailSave={onMailSave}
        />
      }
    </section>
  )
}
