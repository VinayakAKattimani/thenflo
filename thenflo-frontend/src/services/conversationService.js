import { request, mockDelay } from './apiClient.js';
import { USE_MOCK } from './config.js';
import { mockConversations } from './mock/mockData.js';

// In-memory mutable copy so the mock behaves statefully within a session.
let conversations = mockConversations.map((c) => ({ ...c, messages: [...c.messages] }));

export async function listConversations() {
  if (USE_MOCK.conversations) {
    await mockDelay(400);
    return conversations
      .map(({ messages, ...summary }) => summary)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  // Real path — e.g. GET /api/v1/conversations (path to be confirmed)
  return request('/api/v1/conversations');
}

export async function getConversation(conversationId) {
  if (USE_MOCK.conversations) {
    await mockDelay(350);
    const convo = conversations.find((c) => c.id === conversationId);
    if (!convo) throw new Error('Conversation not found');
    return convo;
  }
  return request(`/api/v1/conversations/${conversationId}`);
}

export async function createConversation() {
  if (USE_MOCK.conversations) {
    await mockDelay(300);
    const convo = {
      id: 'conv_' + Date.now(),
      title: 'New conversation',
      updatedAt: new Date().toISOString(),
      lastMessagePreview: '',
      messages: []
    };
    conversations = [convo, ...conversations];
    return convo;
  }
  return request('/api/v1/conversations', { method: 'POST' });
}

export async function sendMessage(conversationId, text) {
  if (USE_MOCK.conversations) {
    await mockDelay(150);
    const convo = conversations.find((c) => c.id === conversationId);
    if (!convo) throw new Error('Conversation not found');

    const userMessage = { id: 'm_' + Date.now(), role: 'user', text, createdAt: new Date().toISOString() };
    convo.messages.push(userMessage);
    if (convo.title === 'New conversation') convo.title = text.slice(0, 48);

    await mockDelay(900);
    const assistantMessage = {
      id: 'm_' + (Date.now() + 1),
      role: 'assistant',
      text: mockReply(text),
      createdAt: new Date().toISOString()
    };
    convo.messages.push(assistantMessage);
    convo.updatedAt = assistantMessage.createdAt;
    convo.lastMessagePreview = assistantMessage.text;

    return { userMessage, assistantMessage };
  }
  return request(`/api/v1/conversations/${conversationId}/messages`, { method: 'POST', body: { text } });
}

function mockReply(prompt) {
  return `This is placeholder assistant output for: "${prompt.slice(0, 60)}${
    prompt.length > 60 ? '…' : ''
  }" — replace conversationService's mock branch with the real LLM/Conversations Gateway contract to get live responses.`;
}
