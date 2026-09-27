// Realistic-shaped mock data. Field names follow conventional REST/JSON
// conventions so swapping in real Gateway responses later is a shape-mapping
// exercise, not a rewrite.

export let mockUser = {
  id: 'usr_01h8x',
  name: 'Asha Rao',
  email: 'asha@example.com',
  role: 'Workspace Admin',
  avatarColor: '#f2b705'
};

export const mockConversations = [
  {
    id: 'conv_1',
    title: 'Renewal terms for Meridian account',
    updatedAt: '2026-09-27T09:12:00Z',
    lastMessagePreview: 'Here are three renewal options based on their usage...',
    messages: [
      { id: 'm1', role: 'user', text: 'Summarize the Meridian contract renewal terms.', createdAt: '2026-09-27T09:10:00Z' },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Meridian is on a 12-month term ending Nov 30. Usage is 40% above plan, so there are three renewal paths: hold current tier, step up to Growth, or move to usage-based billing.',
        createdAt: '2026-09-27T09:10:40Z'
      },
      { id: 'm3', role: 'user', text: 'Give me pros and cons of each.', createdAt: '2026-09-27T09:11:20Z' },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Here are three renewal options based on their usage: holding the current tier keeps costs flat but risks another overage; Growth tier smooths the price but is a 22% increase; usage-based billing scales with them but is harder to forecast.',
        createdAt: '2026-09-27T09:12:00Z'
      }
    ]
  },
  {
    id: 'conv_2',
    title: 'Draft onboarding checklist',
    updatedAt: '2026-09-26T15:40:00Z',
    lastMessagePreview: 'Here is a seven-step checklist for new team members...',
    messages: [
      { id: 'm1', role: 'user', text: 'Draft an onboarding checklist for new hires on the support team.', createdAt: '2026-09-26T15:38:00Z' },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Here is a seven-step checklist for new team members: accounts and access, tool walkthrough, shadowing two live tickets, style guide review, first supervised reply, macro review, and a 30-day check-in.',
        createdAt: '2026-09-26T15:40:00Z'
      }
    ]
  },
  {
    id: 'conv_3',
    title: 'Explain the Q3 churn numbers',
    updatedAt: '2026-09-24T11:02:00Z',
    lastMessagePreview: 'Churn ticked up 0.4pts, concentrated in the SMB tier...',
    messages: [
      { id: 'm1', role: 'user', text: 'What happened with churn in Q3?', createdAt: '2026-09-24T11:00:00Z' },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Churn ticked up 0.4pts, concentrated in the SMB tier, mostly accounts that never completed onboarding in their first 14 days.',
        createdAt: '2026-09-24T11:02:00Z'
      }
    ]
  }
];

export const mockKnowledgeDocuments = [
  {
    id: 'doc_1',
    name: 'Support Playbook v3.pdf',
    type: 'pdf',
    sizeBytes: 2_400_000,
    status: 'processed',
    chunkCount: 84,
    uploadedAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'doc_2',
    name: 'Pricing & Packaging.docx',
    type: 'docx',
    sizeBytes: 512_000,
    status: 'processed',
    chunkCount: 22,
    uploadedAt: '2026-09-18T08:30:00Z'
  },
  {
    id: 'doc_3',
    name: 'Q3 Churn Analysis.xlsx',
    type: 'xlsx',
    sizeBytes: 890_000,
    status: 'processing',
    chunkCount: null,
    uploadedAt: '2026-09-27T08:00:00Z'
  }
];
