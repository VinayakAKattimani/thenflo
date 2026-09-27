import React from 'react';
import { GlobeArrowIcon, AlertIcon } from '../common/Icons.jsx';
import './BrowserPreview.css';

/**
 * Renders the live view of a browsing task's target site.
 *
 * Today this is always a structural placeholder — there is no browser
 * automation engine yet, and this component deliberately does not fake one.
 * It is shaped so a real integration can later pass `screenshotUrl` (still
 * frame), `streamUrl` (live video/stream), or both without any change to
 * the surrounding layout:
 *
 *   <BrowserPreview status="active" url={task.site} screenshotUrl={...} />
 *   <BrowserPreview status="active" url={task.site} streamUrl={...} />
 */
export default function BrowserPreview({ status = 'idle', url, screenshotUrl, streamUrl }) {
  return (
    <div className="browser-preview">
      <div className="browser-preview-chrome">
        <div className="browser-preview-dots">
          <span /> <span /> <span />
        </div>
        <div className="browser-preview-url">{url || 'No site open yet'}</div>
      </div>

      <div className="browser-preview-viewport">
        {streamUrl ? (
          <video className="browser-preview-media" src={streamUrl} autoPlay muted playsInline />
        ) : screenshotUrl ? (
          <img className="browser-preview-media" src={screenshotUrl} alt={`Screenshot of ${url}`} />
        ) : status === 'error' ? (
          <PreviewPlaceholder icon={AlertIcon} label="Couldn't load a preview for this task" tone="error" />
        ) : status === 'idle' ? (
          <PreviewPlaceholder icon={GlobeArrowIcon} label="The browser preview appears here once a task starts" />
        ) : (
          <PreviewPlaceholder icon={GlobeArrowIcon} label="Live browser preview will render here" pulsing />
        )}
      </div>
    </div>
  );
}

function PreviewPlaceholder({ icon: Icon, label, tone, pulsing }) {
  return (
    <div className={`browser-preview-placeholder ${tone === 'error' ? 'is-error' : ''} ${pulsing ? 'is-pulsing' : ''}`}>
      <Icon />
      <span>{label}</span>
    </div>
  );
}
