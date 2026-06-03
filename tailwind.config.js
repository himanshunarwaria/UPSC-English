/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ──────────────────────────────────────────────────────
        surface: '#f9f9fb',
        'surface-low': '#f3f3f5',              // Stitch surface-container-low
        'surface-container': '#ffffff',         // Stitch surface-container-lowest
        'surface-container-low': '#f3f3f5',    // Stitch alias
        'surface-container-lowest': '#ffffff',  // Stitch alias
        'surface-container-highest': '#e2e2e4', // Stitch — for dividers, tags

        // ── On-surface text ───────────────────────────────────────────────
        'on': '#030304',                        // Primary text (Matte Black)
        'on-variant': '#5e5e63',                // Secondary text (was secondary)
        'on-dim': '#8e8e93',                    // Dimmed / placeholder text
        'on-surface-variant': '#46464a',        // Stitch on-surface-variant

        // ── Borders / Outlines ────────────────────────────────────────────
        outline: '#77767b',                     // Stitch — medium-gray (checklist circles, strong dividers)
        'outline-variant': '#c7c6ca',           // Stitch — light-gray card borders

        // ── Primary = Matte Black (headlines, dominant actions) ───────────
        primary: '#030304',                     // FIXED from #1a56db → Matte Black per DESIGN.md
        'primary-container': '#1d1d1f',         // Stitch primary-container

        // ── Accent = Blue (interactive: active nav, selections, bookmarks) ─
        accent: '#1a56db',                      // WAS primary; blue moved here
        'accent-dim': '#e8f0fc',                // WAS primary-dim; light blue bg for accent states

        // ── Secondary system (Stitch) ─────────────────────────────────────
        secondary: '#5e5e63',
        'secondary-container': '#e0dfe4',

        // ── Tertiary / Interactive blue system (Stitch) ───────────────────
        'on-tertiary-container': '#3b84eb',     // Stitch interactive blue variant
        'tertiary-container': '#001c41',

        // ── Inverse surface ───────────────────────────────────────────────
        'inverse-surface': '#2f3132',

        // ── Semantic ──────────────────────────────────────────────────────
        error: '#ba1a1a',
        'error-dim': '#fce8e8',
        success: '#1a6b1a',
        'success-dim': '#e8f5e8',
        warn: '#7a5c00',
        'warn-dim': '#fdf3d0',
      },

      fontFamily: {
        display: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.04em' }],
        xs:   ['12px', { lineHeight: '18px' }],
        sm:   ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg:   ['18px', { lineHeight: '28px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl':['24px', { lineHeight: '32px' }],
        '3xl':['30px', { lineHeight: '38px' }],
      },

      // Stitch soft-square language: default 8px, card 12px, no bubbly 18px+
      borderRadius: {
        sm:      '4px',   // tags, badges, nested chips
        DEFAULT: '8px',   // buttons, inputs, small controls
        md:      '10px',  // medium cards
        lg:      '12px',  // standard cards (was 14px — reduced to match Stitch)
        xl:      '16px',  // large featured cards (was 18px)
        '2xl':   '20px',  // full-bleed panels (was 24px)
        full:    '9999px',
      },

      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'card-hover':'0 4px 20px 0 rgb(0 0 0 / 0.05)', // Stitch "zero-gravity"
      },
    },
  },
  plugins: [],
}
