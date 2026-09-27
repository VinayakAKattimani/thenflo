import React from 'react';

const base = (children, props) => (
  <svg viewBox="0 0 24 24" className="icon" {...props}>
    {children}
  </svg>
);

export const HomeIcon = (p) => base(<path d="M4 11.5 12 4l8 7.5M6 10v9.5a1 1 0 0 0 1 1h3.5v-6h3v6H17a1 1 0 0 0 1-1V10" />, p);
export const ChatIcon = (p) => base(<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />, p);
export const MicIcon = (p) => base(
  <>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </>,
  p
);
export const KnowledgeIcon = (p) => base(
  <>
    <path d="M4 5.5C4 4.7 5.8 4 8 4s4 .7 4 1.5v14C12 18.7 10.2 18 8 18s-4 .7-4 1.5v-14Z" />
    <path d="M20 5.5c0-.8-1.8-1.5-4-1.5s-4 .7-4 1.5v14c0-.8 1.8-1.5 4-1.5s4 .7 4 1.5v-14Z" />
  </>,
  p
);
export const BrowsingIcon = (p) => base(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.5 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.5-3.6-8.5S9.6 5.9 12 3.5Z" />
  </>,
  p
);
export const AnalyticsIcon = (p) => base(<path d="M5 19V9.5M12 19V5M19 19v-6" />, p);
export const SettingsIcon = (p) => base(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a1.7 1.7 0 0 0 .34 1.87l.06.06a2.1 2.1 0 1 1-2.97 2.97l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19a2.1 2.1 0 1 1-4.2 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2.1 2.1 0 1 1-2.97-2.97l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4a2.1 2.1 0 1 1 0-4.2h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.1 2.1 0 1 1 2.97-2.97l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1-1.55V4a2.1 2.1 0 1 1 4.2 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.1 2.1 0 1 1 2.97 2.97l-.06.06a1.7 1.7 0 0 0-.34 1.87V10c.68.2 1.2.75 1.55 1.4Z" />
  </>,
  p
);
export const ProfileIcon = (p) => base(
  <>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M4.5 20c1.3-3.6 4.4-5.5 7.5-5.5s6.2 1.9 7.5 5.5" />
  </>,
  p
);
export const SendIcon = (p) => base(<path d="M4.5 12 20 4.5 15 12l5 7.5L4.5 12Z" />, p);
export const StopIcon = (p) => base(<rect x="6" y="6" width="12" height="12" rx="2" />, p);
export const PlusIcon = (p) => base(<path d="M12 5v14M5 12h14" />, p);
export const UploadIcon = (p) => base(<path d="M12 16V4M7 9l5-5 5 5M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />, p);
export const TrashIcon = (p) => base(<path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />, p);
export const CheckIcon = (p) => base(<path d="M5 12.5 9.5 17 19 6.5" />, p);
export const AlertIcon = (p) => base(
  <>
    <path d="M12 3.5 21 19H3L12 3.5Z" />
    <path d="M12 10v4M12 16.5v.01" />
  </>,
  p
);
export const GlobeArrowIcon = (p) => base(
  <>
    <circle cx="10.5" cy="12" r="7.5" />
    <path d="M3 12h15M10.5 4.5c1.9 1.9 2.85 4.5 2.85 7.5s-.95 5.6-2.85 7.5c-1.9-1.9-2.85-4.5-2.85-7.5S8.6 6.4 10.5 4.5Z" />
    <path d="m17 15 4 4m0 0-4 .3m4-.3-.3-4" />
  </>,
  p
);
export const ChevronRightIcon = (p) => base(<path d="m9 6 6 6-6 6" />, p);
