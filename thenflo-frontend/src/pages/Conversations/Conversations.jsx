import React, { useEffect, useRef, useState } from 'react';
import * as conversationService from '../../services/conversationService.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import { ChatIcon, PlusIcon, SendIcon } from '../../components/common/Icons.jsx';
import './Conversations.css';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeConvo, setActiveConvo] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    conversationService.listConversations().then((list) => {
      setConversations(list);
      setLoading(false);
      if (list.length) setActiveId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeId) {
      setActiveConvo(null);
      return;
    }
    conversationService.getConversation(activeId).then(setActiveConvo);
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeConvo?.messages?.length]);

  const handleNewConversation = async () => {
    const convo = await conversationService.createConversation();
    setConversations((prev) => [{ ...convo }, ...prev]);
    setActiveId(convo.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setDraft('');
    setActiveConvo((prev) => ({
      ...prev,
      messages: [...prev.messages, { id: 'temp_' + Date.now(), role: 'user', text, createdAt: new Date().toISOString() }]
    }));
    const { assistantMessage } = await conversationService.sendMessage(activeId, text);
    const refreshed = await conversationService.getConversation(activeId);
    setActiveConvo(refreshed);
    setConversations(await conversationService.listConversations());
    setSending(false);
  };

  if (loading) return <div className="conversations-loading">Loading conversations…</div>;

  return (
    <div className="conversations-page">
      <aside className="conversations-list">
        <button className="btn btn-primary conversations-new" onClick={handleNewConversation}>
          <PlusIcon /> New conversation
        </button>
        <ul>
          {conversations.map((c) => (
            <li key={c.id}>
              <button className={'conversations-list-item' + (c.id === activeId ? ' is-active' : '')} onClick={() => setActiveId(c.id)}>
                <span className="conversations-list-item-title">{c.title || 'New conversation'}</span>
                <span className="conversations-list-item-preview">{c.lastMessagePreview}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="conversations-thread">
        {!activeConvo ? (
          <EmptyState icon={ChatIcon} title="No conversation selected" description="Start a new conversation to talk to ThenFLo." />
        ) : (
          <>
            <div className="conversations-messages scroll-region" ref={scrollRef}>
              {activeConvo.messages.map((m) => (
                <div key={m.id} className={`message-bubble message-${m.role}`}>
                  <p>{m.text}</p>
                </div>
              ))}
              {sending && (
                <div className="message-bubble message-assistant message-typing">
                  <span /> <span /> <span />
                </div>
              )}
            </div>

            <form className="conversations-composer" onSubmit={handleSend}>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message ThenFLo…"
                disabled={sending}
              />
              <button type="submit" className="conversations-send" disabled={!draft.trim() || sending} aria-label="Send">
                <SendIcon />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
