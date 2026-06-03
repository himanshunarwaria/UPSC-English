---
name: Obsidian Precision
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#46464a'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#77767b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e60'
  primary: '#030304'
  on-primary: '#ffffff'
  primary-container: '#1d1d1f'
  on-primary-container: '#868587'
  inverse-primary: '#c8c6c8'
  secondary: '#5e5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe4'
  on-secondary-container: '#626267'
  tertiary: '#00030b'
  on-tertiary: '#ffffff'
  tertiary-container: '#001c41'
  on-tertiary-container: '#3b84eb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e2e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1b1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c7c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#d7e3ff'
  tertiary-fixed-dim: '#aac7ff'
  on-tertiary-fixed: '#001b3e'
  on-tertiary-fixed-variant: '#00458e'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  section-gap: 120px
---

## Brand & Style
This design system is built on the pillars of **Premium Minimalism** and **Expert Utility**. It targets a high-end, professional audience that values clarity over decoration. The aesthetic draws inspiration from high-fidelity hardware interfaces, utilizing "Apple-esque" restraint to allow content and data to remain the primary focus.

The emotional response should be one of quiet confidence and technical authority. By leveraging massive whitespace, strict alignment, and a monochrome palette, the UI communicates that the product is a precision tool for experts. The style is modern-corporate, favoring structural integrity and functional elegance over transient trends.

## Colors
The palette is intentionally restricted to maintain a high-contrast, editorial feel. 

- **Primary (#1D1D1F):** Used for headlines, primary actions, and high-impact text. It is a "Matte Black" that provides depth without the harshness of pure #000.
- **Background (#FFFFFF):** The canvas. Pure white is used to maximize the effect of negative space.
- **Neutral (#F5F5F7):** The "Premium Gray." Reserved for large surface areas like section backgrounds, input fills, and subtle dividers.
- **Secondary (#86868B):** Used for secondary text, icons, and deactivated states.
- **Accent (#0066CC):** A precise, high-end blue used sparingly for interactive cues and links to provide a singular point of focus within the monochrome environment.

## Typography
The typography system uses **Hanken Grotesk** for high-impact display and headlines to provide a sharp, contemporary edge, while **Inter** is utilized for body and UI labels due to its exceptional legibility and systematic feel.

Hierarchy is maintained through significant size variance and weight. Headlines should utilize tight letter-spacing to create a "locked-in" professional look. Body text must remain airy with a generous line height (1.6x) to ensure readability during long-form consumption.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop and a fluid model on mobile. Content is centered within a 1200px container to prevent excessive line lengths. 

- **Whitespace:** Use "massive" vertical spacing between sections (120px+) to allow the design to breathe and to signal a premium experience.
- **Rhythm:** All spacing must be multiples of the 8px base unit. 
- **Alignment:** Strict left-alignment for all text elements to maintain a structured, professional appearance. 
- **Responsive:** On mobile, margins reduce to 20px and section gaps compress to 64px, while maintaining the same 8px incremental logic for components.

## Elevation & Depth
This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

Depth is achieved through the use of the Neutral Gray (#F5F5F7) against the Pure White background. Surfaces that require separation (like cards or modals) should use a subtle 1px border in #E5E5E7 rather than a shadow. If a shadow is absolutely necessary for functional overlay (e.g., a dropdown menu), use a "Zero-Gravity" shadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`, which is felt rather than seen.

## Shapes
The shape language is "Soft-Square." We use a consistent **0.5rem (8px)** corner radius for standard components like buttons and input fields. This provides a modern, approachable feel without being overly "bubbly" or informal. 

For larger containers or featured cards, use **rounded-lg (16px)**. Larger radii are reserved for immersive elements, while smaller radii (4px) are used for nested components like tags or checkboxes to maintain visual sharpness.

## Components
- **Buttons:** Primary buttons are Solid Matte Black (#1D1D1F) with White text. Secondary buttons are Ghost style with a 1px border of #D2D2D7. No gradients or inner glows.
- **Input Fields:** Use the Neutral Gray (#F5F5F7) as a subtle background fill. Labels should be small, bold, and placed above the field.
- **Cards:** Cards should be borderless on #F5F5F7 backgrounds, or have a 1px #F5F5F7 border on White backgrounds. They do not use shadows.
- **Lists:** Use simple dividers (1px #F5F5F7) and generous vertical padding (16px-24px) between items.
- **Chips/Tags:** Small, 4px rounded corners, using a light gray background with #86868B text for a technical, metadata look.
- **Data Display:** Tables and data grids should use the `label-sm` font for headers, emphasizing a utilitarian, "pro-tool" vibe.