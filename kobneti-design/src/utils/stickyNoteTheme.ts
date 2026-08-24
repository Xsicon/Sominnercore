export interface StickyNoteColorOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  textHex: string;
  subtextHex: string;
  sampleText?: string;
  sampleDate?: string;
  sampleBadge?: 'star' | 'edit' | 'cursor' | 'none';
}

export const STICKY_NOTE_COLORS: StickyNoteColorOption[] = [
  {
    id: 'apricot-orange',
    name: 'Apricot Orange',
    hex: '#F29D68',
    borderHex: '#E58A52',
    textHex: '#1E1B18',
    subtextHex: '#5C4E43',
    sampleText: 'This is Docket note.|',
    sampleBadge: 'cursor',
  },
  {
    id: 'amber-yellow',
    name: 'Amber Yellow',
    hex: '#F8CF66',
    borderHex: '#EABF4C',
    textHex: '#1E1B18',
    subtextHex: '#5C4E43',
    sampleText: 'The beginning of screenless design: UI jobs to be taken over by Solution Architect',
    sampleDate: 'May 21, 2020',
    sampleBadge: 'edit',
  },
  {
    id: 'peach-salmon',
    name: 'Peach Salmon',
    hex: '#ED9566',
    borderHex: '#DE804E',
    textHex: '#1E1B18',
    subtextHex: '#5C4E43',
    sampleText: '13 Things You Should Give Up If You Want To Be a Successful UX Designer',
    sampleDate: 'May 25, 2020',
    sampleBadge: 'none',
  },
  {
    id: 'lavender-purple',
    name: 'Lavender Purple',
    hex: '#9D80F5',
    borderHex: '#8B6CE6',
    textHex: '#181424',
    subtextHex: '#423860',
    sampleText: '10 UI & UX Lessons from Designing My Own Product',
    sampleBadge: 'star',
  },
  {
    id: 'chartreuse-lime',
    name: 'Chartreuse Lime',
    hex: '#D2EA7B',
    borderHex: '#BCD85E',
    textHex: '#1A210F',
    subtextHex: '#4A5B2B',
    sampleText: '52 Research Terms you need to know as a UX Designer',
    sampleBadge: 'none',
  },
  {
    id: 'sky-cyan',
    name: 'Sky Cyan',
    hex: '#56CCF2',
    borderHex: '#3BBCE6',
    textHex: '#0C2738',
    subtextHex: '#255875',
    sampleText: 'Text fields & Forms design — UI component series',
    sampleBadge: 'none',
  },
  {
    id: 'soft-pink',
    name: 'Soft Rose Pink',
    hex: '#F5A3C7',
    borderHex: '#E28DB3',
    textHex: '#2E111E',
    subtextHex: '#69324B',
    sampleText: 'Micro-interactions and haptic feedback standards for modern apps',
    sampleDate: 'Jun 02, 2020',
    sampleBadge: 'none',
  },
  {
    id: 'cream-sand',
    name: 'Warm Cream',
    hex: '#FDF0CD',
    borderHex: '#E8D7A7',
    textHex: '#261F14',
    subtextHex: '#5E4E37',
    sampleText: 'Accessibility audit checklist for high contrast dark & light modes',
    sampleDate: 'Jun 14, 2020',
    sampleBadge: 'none',
  },
];

export const getStickyNoteColor = (hexOrId?: string): StickyNoteColorOption => {
  if (!hexOrId) return STICKY_NOTE_COLORS[0];
  const found =
    STICKY_NOTE_COLORS.find((c) => c.hex.toLowerCase() === hexOrId.toLowerCase()) ||
    STICKY_NOTE_COLORS.find((c) => c.id === hexOrId);
  return found || STICKY_NOTE_COLORS[0];
};

export const getSavedStickyColorHex = (): string => {
  try {
    const saved = localStorage.getItem('kobneti_sticky_color');
    if (saved) return saved;
  } catch {
    // fallback
  }
  return '#F29D68';
};

export const saveStickyColorHex = (hex: string) => {
  try {
    localStorage.setItem('kobneti_sticky_color', hex);
    window.dispatchEvent(new CustomEvent('kobneti:sticky-color-change', { detail: { hex } }));
  } catch {
    // fallback
  }
};
