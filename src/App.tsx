import { useState } from 'react'
import Layout, { TabId } from './components/Layout'
import TodayView from './views/TodayView'
import ContactsView from './views/ContactsView'
import TemplatesView from './views/TemplatesView'
import WeeklyPlanView from './views/WeeklyPlanView'
import ReportsView from './views/ReportsView'
import RoleGuideView from './views/RoleGuideView'
import SettingsView from './views/SettingsView'

export default function App() {
  const [tab, setTab] = useState<TabId>('today')

  return (
    <Layout active={tab} onChange={setTab}>
      {tab === 'today' && <TodayView />}
      {tab === 'contacts' && <ContactsView />}
      {tab === 'templates' && <TemplatesView />}
      {tab === 'plan' && <WeeklyPlanView />}
      {tab === 'reports' && <ReportsView />}
      {tab === 'roles' && <RoleGuideView />}
      {tab === 'settings' && <SettingsView />}
    </Layout>
  )
}
