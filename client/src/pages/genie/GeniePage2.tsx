import {
  GenieChatInput,
  GenieChatMessageList,
  useGenieChat,
} from '@databricks/appkit-ui/react';
import { useSearchParams } from 'react-router';
import { useEffect, useRef } from 'react';

/**
 * Native Databricks Genie chat.
 *
 * The rest of the app uses the AARP theme, but the chat itself renders in the
 * NATIVE Databricks interface — no AARP chrome, no theme overrides (see
 * index.css, which intentionally does not override AppKit's color/font tokens).
 * Whatever the Genie space streams shows up exactly as Databricks renders it.
 *
 * This mirrors appkit-ui's own <GenieChat> (one useGenieChat instance feeding
 * the native <GenieChatMessageList> + <GenieChatInput>), with one addition: an
 * effect that auto-sends a question handed over from Home via ?q=… so the ask
 * bar and use-case cards kick off the query directly in the space.
 */
const GENIE_ALIAS = 'default';

export function GeniePage() {
  const [params, setParams] = useSearchParams();
  const initialQuestion = (params.get('q') || '').trim();

  const {
    messages,
    status,
    error,
    sendMessage,
    reset,
    hasPreviousPage,
    fetchPreviousPage,
  } = useGenieChat({ alias: GENIE_ALIAS });

  // Fire the handed-over question once, then strip ?q so a refresh won't resend.
  const sentRef = useRef('');
  useEffect(() => {
    if (!initialQuestion || sentRef.current === initialQuestion) return;
    if (status === 'streaming' || status === 'loading-history') return;
    sentRef.current = initialQuestion;
    sendMessage(initialQuestion);
    const next = new URLSearchParams(params);
    next.delete('q');
    setParams(next, { replace: true });
  }, [initialQuestion, status, sendMessage, params, setParams]);

  return (
    <div className="native-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {messages.length > 0 && (
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', padding: '8px 12px' }}>
          <button
            onClick={reset}
            style={{ border: 0, background: 'transparent', color: 'var(--muted-foreground)', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}
          >
            New conversation
          </button>
        </div>
      )}
      <GenieChatMessageList
        messages={messages}
        status={status}
        hasPreviousPage={hasPreviousPage}
        onFetchPreviousPage={fetchPreviousPage}
      />
      {error && (
        <div style={{ flexShrink: 0, padding: '10px 16px', fontSize: 13.5, color: 'var(--destructive, #dc2626)', borderTop: '1px solid var(--border, #e5e7eb)' }}>
          {String(error)}
        </div>
      )}
      <GenieChatInput
        onSend={sendMessage}
        disabled={status === 'streaming' || status === 'loading-history'}
      />
    </div>
  );
}
