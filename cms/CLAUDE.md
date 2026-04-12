@AGENTS.md

## Shadow tokens

Use color-mix tinted shadows rather than generic rgba-black boxes. The pattern:

```
shadow-[0_16px_48px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]
```

Vary the pixel values for different elevations (8px/24px small, 16px/48px medium, 24px/64px large). The opacity percentage (12%) can be raised to 20% for more prominent cards. This approach automatically adapts to every client's brand color.

Never use `shadow-black/10` or `rgba(0,0,0,...)` for UI surfaces — those break the tinted look when the brand color changes.
