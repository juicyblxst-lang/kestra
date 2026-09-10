# @card-settlement/ui

Accessible, finance-oriented React primitives for Card Settlement Rail.

## Install

The package is consumed from the pnpm workspace. Consumers must provide the peer dependencies listed in `package.json`.

```tsx
import '@card-settlement/ui/styles.css';
import { Button, Input, StatusPill, Currency, currencyFromMinor } from '@card-settlement/ui';

<Button>Authorize settlement</Button>
<Input label="Account" error="Account is required" />
<StatusPill status="processing" />
<Currency money={currencyFromMinor(125000n, 'USD')} />
```

## When to use what

- **Button**: user actions, authorization and destructive operations. Use `danger` only for irreversible/destructive actions.
- **Input / Select**: controlled form fields with explicit labels and validation messages.
- **Table**: high-volume operational data. Columns may provide `sortValue`; rows are windowed to keep DOM size bounded.
- **Dialog**: confirmation/review flows that must retain focus and provide an escape path.
- **Toast**: transient success/failure feedback. Keep critical financial state visible in the page as well.
- **Currency**: render domain `Money`; never pass floating-point currency amounts into financial logic.
- **Delta**: compact signed change indicator.
- **Sparkline**: low-density trend visualization where exact point inspection is unnecessary.
- **StatusPill**: compact lifecycle state.
- **EmptyState / LoadingState**: explicit asynchronous and zero-data states; never leave a blank operational panel.

## Accessibility

Controls use semantic HTML, visible keyboard focus, labels, ARIA state attributes, and Radix primitives where appropriate. Run `pnpm --filter ui test` before publishing.

## Design preview

Run `pnpm --filter @card-settlement/design-preview dev`; the preview listens on `http://localhost:3001`.
