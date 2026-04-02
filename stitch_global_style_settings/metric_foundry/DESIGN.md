# Design System Document: The Precise Architect

## 1. Overview & Creative North Star
**Creative North Star: "The Precise Architect"**
This design system moves away from the "boxy" and "fragmented" nature of traditional dashboards. Instead of treating an admin interface as a collection of widgets, we treat it as a cohesive, architectural plan. The goal is to achieve high data density through **Atmospheric Depth** rather than structural rigidity.

The system breaks the "template look" by prioritizing negative space as a functional tool. By utilizing intentional asymmetry in sidebar widths and expansive margins, we create a layout that feels curated. This is a system where clarity is achieved through tonal contrast, and professional authority is communicated through sophisticated, layered surfaces.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a sophisticated range of neutral grays (`#f8f9fa` to `#d1dce0`) punctuated by a commanding Teal (`primary: #13677b`).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
*   Use `surface_container_low` for the main content area background.
*   Use `surface_container_lowest` (pure white) for high-priority cards to create a "lifted" effect without lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base Layer:** `surface` (The canvas).
*   **Section Layer:** `surface_container_low` (Large content areas).
*   **Content Layer:** `surface_container_lowest` (Individual cards/modules).
*   **Interactive Layer:** `surface_container_high` (Hover states and active tabs).

### The "Glass & Gradient" Rule
To elevate the dashboard beyond "flat" design, use **Glassmorphism** for floating elements (like dropdown menus or toast notifications). 
*   **Tokens:** Use `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur.
*   **Signature Textures:** For primary CTAs and Hero Data Points, apply a subtle linear gradient from `primary` (#13677b) to `primary_dim` (#005a6e). This adds a "jewel-like" depth that flat color cannot replicate.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-editorial" feel. Use `headline-lg` for dashboard titles to establish a strong visual anchor.
*   **Body & Labels (Inter):** The workhorse for data density. Inter’s tall x-height ensures readability at small scales (`body-sm`) within dense data tables.

**Hierarchy Strategy:** 
Maintain a high contrast in scale. Use `label-md` in all-caps with `0.05rem` letter-spacing for category headers to create a distinct separation from `body-md` content.

---

## 4. Elevation & Depth
In "The Precise Architect" system, depth is felt, not seen.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container` background. This "tonal lift" provides immediate recognition of a container without a single line of CSS border.
*   **Ambient Shadows:** For floating elements (Modals, Popovers), use an extra-diffused shadow. 
    *   *Shadow Specs:* `0px 20px 40px rgba(43, 52, 55, 0.06)`. The shadow color is derived from `on_surface` to ensure it feels like a natural lighting effect.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. This creates a "suggestion" of a boundary rather than a hard wall.

---

## 5. Components

### Cards & Content Modules
*   **Forbid dividers.** Use `1.75rem` (spacing scale `8`) of vertical white space to separate content blocks. 
*   **Corner Radius:** Standardize on `lg` (0.5rem) for main cards to maintain a professional, sharp look.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_dim`. Roundedness `md` (0.375rem). Text: `on_primary`.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text. Use for low-emphasis actions like "Cancel."

### Input Fields
*   **Base State:** `surface_container_high` background. No border.
*   **Focus State:** 2px solid `primary`. 
*   **Error State:** Background `error_container`, text `on_error_container`.

### Chips & Tags
*   Use `secondary_fixed_dim` for a muted, professional tag background. 
*   Text should be `on_secondary_fixed` in `label-sm` weight.

### Navigation Sidebar
*   Background: `surface_container_lowest`.
*   Active State: A vertical `primary` bar (3px width) on the left edge of the menu item, with the text switching to `on_surface`.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use `surface_bright` for tooltips to make them pop against the neutral dashboard.
*   **DO** rely on the `spacing scale` (values 4, 6, 8) to create rhythmic breathing room.
*   **DO** use `tertiary` colors for non-essential data visualizations (e.g., secondary axes on a chart).

### Don't
*   **DON’T** use 100% black text. Always use `on_surface` (#2b3437) for softer, more premium readability.
*   **DON’T** use "Drop Shadows" on standard cards. Use Tonal Layering instead.
*   **DON’T** use standard 1px dividers in lists. Use a `surface_container` background shift on hover to define rows.
*   **DON’T** crowd the edges. Ensure a minimum of `2.25rem` (spacing scale `10`) padding for the main page containers.