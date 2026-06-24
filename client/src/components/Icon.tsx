// AARP Marketing Genie — shared line-glyph icons (ported from the prototype).
import type { CSSProperties } from 'react';

const ICON_PATHS: Record<string, string> = {
  genie: '<path d="M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3z"/><path d="M18.5 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  arrowR: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  members: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M17.5 14.5a5.5 5.5 0 0 1 3 4.5"/>',
  engage: '<path d="M3 13h3l2.5-6 4 13 2.5-7H21"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  chat: '<path d="M5 5h14v10H9l-4 4V5z"/>',
  bookmark: '<path d="M7 4h10v16l-5-3.5L7 20V4z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.8.3-1.2.9-1.2 1.8"/><circle cx="11.5" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
  sendUp: '<path d="M12 19V6"/><path d="M6 11l6-6 6 6"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  table: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 10h16M4 15h16M10 5v14"/>',
  bulb: '<path d="M9 17h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  trendUp: '<path d="M4 16l5-5 3 3 7-7"/><path d="M16 7h4v4"/>',
};

export type IconName = keyof typeof ICON_PATHS;

export function Icon({
  name,
  size = 18,
  stroke = 1.7,
  color = 'currentColor',
  style,
}: {
  name: IconName | string;
  size?: number;
  stroke?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span className="ag-icon" style={style}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }}
      />
    </span>
  );
}
