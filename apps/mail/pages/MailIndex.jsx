import { mailService } from "../services/mail.service.js";
import { showErrorMsg } from "../../../services/event-bus.service.js";

import { MailFolderList } from "../cmps/MailFolderList.jsx";
import { MailFilter } from "../cmps/MailFilter.jsx";
import { MailList } from "../cmps/MailList.jsx";

const { useState, useEffect } = React;

export function MailIndex() {
  const [mails, setMails] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [filterBy, setFilterBy] = useState({});

  useEffect(() => {
    loadMails();
  }, [filterBy]);

  function loadMails() {
    mailService
      .query(filterBy)
      .then(setMails)
      .catch((err) => {
        showErrorMsg(`Error loading mails from ${selectedFolder}`);
        console.log(err);
      });
  }

  return (
    <section className="mail-container">
      <MailFolderList />
      <div>
        <MailFilter />
        <MailList />
      </div>
    </section>
  );
}
