import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '../../components/Icon';
import { useShell } from '../../App';

/* Curated starter questions — swap for your real catalog. */
const MEMBERSHIP_Q = [
  'How many new members did we acquire last quarter vs. last year?',
  'What is the renewal rate by membership tenure cohort?',
  'Which acquisition channels drove the most new members in 2025?',
  'What is average member lifetime value by join age?',
];
const ENGAGEMENT_Q = [
  'What is the email open-rate trend over the last 6 months?',
  'Which engagement channel has the highest conversion to renewal?',
  'What is event attendance by region this year?',
  'Which member segment is most engaged with our content?',
];
const RECENT = ['Renewal rate by tenure cohort', 'Q1 acquisition by state', 'Email open-rate trend'];

type Tone = { bg: string; fg: string; qicon: 'members' | 'engage' };

function UseCaseTile({
  tone, icon, title, desc, questions, onAsk,
}: {
  tone: Tone; icon: 'members' | 'engage'; title: string; desc: string;
  questions: string[]; onAsk: (q: string) => void;
}) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--sh-s)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tone.bg, color: tone.fg }}>
            <Icon name={icon} size={24} color={tone.fg} stroke={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: tone.fg }}>Use case</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em', marginTop: 3 }}>{title}</div>
          </div>
        </div>
        <p style={{ margin: '14px 0 0', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, textWrap: 'pretty' }}>{desc}</p>
      </div>
      <div style={{ padding: '10px 12px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '8px 12px 6px' }}>Popular questions</div>
        {questions.map((q, i) => (
          <button key={i} className="ag-q" onClick={() => onAsk(q)}>
            <span className="ag-qicon" style={{ background: tone.bg }}><Icon name={tone.qicon} size={16} color={tone.fg} /></span>
            <span style={{ flex: 1 }}>{q}</span>
            <span className="ag-qarrow"><Icon name="arrowR" size={17} /></span>
          </button>
        ))}
        <button onClick={() => onAsk('')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 0, background: 'transparent', color: tone.fg, fontWeight: 600, fontSize: 13.5, padding: '12px 12px 6px', cursor: 'pointer' }}>
          Browse all {title.toLowerCase()} questions <Icon name="chevR" size={15} />
        </button>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useShell();
  const [draft, setDraft] = useState('');

  // Hand the question to the Genie route. GenieChat picks it up from ?q= —
  // see GeniePage for how it's read.
  const ask = (q: string) => {
    const query = q.trim();
    navigate(query ? `/genie?q=${encodeURIComponent(query)}` : '/genie');
  };
  const submit = (e: React.FormEvent) => { e.preventDefault(); ask(draft); setDraft(''); };

  return (
    <div className="ag-scroll">
      {/* Brand-forward gradient hero */}
      <div style={{ background: 'linear-gradient(180deg, #fbeef0 0%, var(--bg) 100%)', borderBottom: '1px solid var(--line-2)', padding: '40px 48px 34px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--aarp-red)', background: 'var(--surface)', border: '1px solid var(--aarp-red-t2)', padding: '5px 12px', borderRadius: 999, boxShadow: 'var(--sh-s)' }}>
                <Icon name="genie" size={14} color="var(--aarp-red)" /> ASI Marketing Genie
              </div>
              <h1 className="ag-serif" style={{ margin: '16px 0 0', fontSize: 36, fontWeight: 500, letterSpacing: '-.02em', lineHeight: 1.08, textWrap: 'balance' }}>Hello{user?.firstName ? `, ${user.firstName}` : ''}</h1>
              <p style={{ margin: '10px 0 0', fontSize: 16, color: 'var(--ink-2)' }}>Ask about AARP membership and engagement — in plain language.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500, paddingBottom: 6, whiteSpace: 'nowrap' }}>
              <Icon name="db" size={15} color="var(--ink-3)" /> Connected to <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>mktg_analytics</strong>
            </div>
          </div>

          <form onSubmit={submit} className="ag-askbar" style={{ marginTop: 24, borderRadius: 16, padding: '15px 16px', boxShadow: 'var(--sh-m)' }}>
            <Icon name="genie" size={20} color="var(--aarp-red)" />
            <input placeholder="Ask a question about members, campaigns, channels…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button type="submit" className="ag-send" style={{ width: 40, height: 40 }}><Icon name="sendUp" size={19} color="#fff" /></button>
          </form>
        </div>
      </div>

      {/* Use-case tiles + recent */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 48px 54px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em', margin: 0 }}>Start with a use case</h2>
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>Curated for marketing</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <UseCaseTile
            tone={{ bg: 'var(--aarp-red-t)', fg: 'var(--aarp-red)', qicon: 'members' }}
            icon="members" title="Membership"
            desc="Acquisition, renewals, retention and lifetime value across tiers, channels and geographies."
            questions={MEMBERSHIP_Q} onAsk={ask} />
          <UseCaseTile
            tone={{ bg: 'rgba(38,74,107,.09)', fg: 'var(--c-navy)', qicon: 'engage' }}
            icon="engage" title="Engagement"
            desc="Email, content, events and channel performance — and which member segments respond."
            questions={ENGAGEMENT_Q} onAsk={ask} />
        </div>

        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Pick up where you left off</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {RECENT.map((c) => (
              <button key={c} className="ag-chip" onClick={() => ask(c)}><Icon name="clock" size={15} color="var(--ink-3)" />{c}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
