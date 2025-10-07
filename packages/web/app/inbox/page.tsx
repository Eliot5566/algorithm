import { DashboardPage } from '../../components/DashboardPage';
import { InboxList } from './InboxList';

export default function InboxPage() {
  return (
    <DashboardPage
      title="Inbox"
      description="Monitor omnichannel conversations and respond faster."
    >
      <InboxList />
    </DashboardPage>
  );
}
