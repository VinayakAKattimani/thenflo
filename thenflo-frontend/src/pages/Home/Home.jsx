import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ChatIcon, MicIcon, KnowledgeIcon, BrowsingIcon, ChevronRightIcon } from '../../components/common/Icons.jsx';
import './Home.css';

const capabilities = [
  { to: '/conversations', icon: ChatIcon, title: 'Conversations', description: 'Talk to ThenFLo.' },
  { to: '/voice', icon: MicIcon, title: 'Voice', description: 'Talk naturally with ThenFLo.' },
  { to: '/knowledge', icon: KnowledgeIcon, title: 'Knowledge', description: 'Give ThenFLo information to work with.' },
  { to: '/browsing', icon: BrowsingIcon, title: 'Automated Browsing', description: 'Let ThenFLo interact with the web and perform tasks.' }
];

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="home-page">
      <PageHeader title={`Good to see you, ${firstName}`} subtitle="Here's what ThenFLo can do for you." />

      <div className="home-grid">
        {capabilities.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="home-card">
            <div className="home-card-icon">
              <Icon />
            </div>
            <div className="home-card-body">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <ChevronRightIcon className="icon home-card-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}
