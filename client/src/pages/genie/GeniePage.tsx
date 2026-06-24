import {
  GenieChatInput,
  GenieChatMessageList,
  useGenieChat,
} from '@databricks/appkit-ui/react';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useRef } from 'react';
import { Icon } from '../../components/Icon';

/**
 * Branded Genie conversation that auto-executes a question handed over from
 * Home via ?q=… (the ask bar and use-case cards both navigate here).
 *
 * This mirrors appkit-ui's own <GenieChat> (a single useGenieChat instance
 * feeding the official <GenieChatMessageList> + <GenieChatInput>, which give
 * the native Genie formatting — tables, visualizations, SQL). The only addition
 * is an effect that sends the incoming question once, so it kicks off directly
 * in the Genie space without the user retyping.
 *
 * Using ONE hook instance for both sending and rendering is what makes the
 * auto-send appear in the chat (a separate hook instance would not).
 */
const GENIE_ALIAS = 'default';

export function GeniePage() {
  const navigate = useNavigate();
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

  // Fire the handed-over question exactly once, then strip ?q (keeping any
  // other params) so a refresh doesn't resend it.
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Branded conversation header */}
      <div style={{ flex: 'none', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)', padding: '14px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/')} className="ag-chip" style={{ padding: '6px 12px 6px 9px' }}>
            <Icon name="chevR" size={15} color="var(--ink-2)" style={{ transform: 'rotate(180deg)' }} />Home
          </button>
          <span className="ag-genie-badge"><Icon name="genie" size={17} color="#fff" /></span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: '-.01em' }}>ASI Marketing Insights Chatbot</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Connected to your Genie space</div>
          </div>
          {status === 'streaming' && (
            <span className="ag-chip" style={{ marginLeft: 'auto', cursor: 'default' }}>
              <Icon name="genie" size={14} color="var(--aarp-red)" />Working…
            </span>
          )}
        </div>
      </div>

      {/* Live Genie chat — native appkit-ui rendering, AARP red via theme tokens */}
      <div style={{ flex: '1 1 auto', minHeight: 0, padding: '20px 32px 28px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', height: '100%', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', background: 'var(--surface)', boxShadow: 'var(--sh-s)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {messages.length > 0 && (
              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', padding: '10px 14px 4px' }}>
                <button onClick={reset} className="ag-chip" style={{ padding: '5px 12px', fontSize: 12.5 }}>
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
              <div style={{ flexShrink: 0, padding: '10px 16px', fontSize: 13.5, color: 'var(--aarp-red)', background: 'var(--aarp-red-t)', borderTop: '1px solid var(--line)' }}>
                {String(error)}
              </div>
            )}
            <GenieChatInput
              onSend={sendMessage}
              disabled={status === 'streaming' || status === 'loading-history'}
              placeholder="Ask a question about members, campaigns, channels…"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
