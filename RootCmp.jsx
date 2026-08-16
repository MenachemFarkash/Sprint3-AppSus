const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'

export function RootCmp() {
  return (
    <Router>
      <section className="root-cmp">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mail" element={<Navigate to="/mail/folder/inbox" />} />
          <Route path="mail/folder/:type" element={<MailIndex />} />
          <Route path="mail/folder/:type/:id" element={<MailIndex />} />
          <Route path="/note" element={<NoteIndex />} />
        </Routes>
        <UserMsg />
      </section>
    </Router>
  )
}
