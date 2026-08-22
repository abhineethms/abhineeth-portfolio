# Patches to vendored Agents UI components

The `@agents-ui` components are installed as source (shadcn registry), so we own the files.
Re-running `pnpm dlx shadcn@latest add @agents-ui/...` **overwrites them and drops these
patches** — re-apply anything listed here afterwards.

## `src/components/agents-ui/agent-control-bar.tsx` — boolean `inert`

Upstream:

```tsx
<motion.div inert={!(isChatOpen || isChatOpenUncontrolled)} ...>
```

Boolean `inert` is a React 19 feature. This project runs React 18.3.1 (matching the
portfolio SPA), where React serialises it as the string `inert="false"`. In HTML *any*
present `inert` attribute is truthy, so the chat input panel would be permanently inert —
visible but unfocusable and unclickable.

Patched to emit the attribute only when the panel should actually be inert. React 18's
`@types/react` doesn't know `inert` at all, so it is spread in rather than passed directly:

```tsx
{...({ inert: isChatOpen || isChatOpenUncontrolled ? undefined : '' } as Record<string, unknown>)}
```

`undefined` omits the attribute entirely; `''` is the canonical way to set a boolean HTML
attribute.

**On React 19 this patch is unnecessary** — revert to the upstream line if this ever moves
into a React 19 app.

## `src/components/agents-ui/agent-audio-visualizer-aura.tsx` — unused React import

Upstream opens with `import React, { useMemo, type ComponentProps } from 'react';`. The
default `React` binding is never used (the project compiles with `jsx: "react-jsx"`), and
`noUnusedLocals` in `tsconfig.app.json` makes that a build error. Dropped the default
import; the named imports are unchanged.

Cosmetic only — no behavioural difference.
