# Master Plan (Loop 3) - REVISED

**Goal**: Fix AI Assistant Positioning globally (Priority #1).
**Context**: Original documentation referred to obsolete `AiHelpAssistant.svelte`. Verified target is `GlobalChatbox.tsx`.
**Constraint**: Widget must be max 1/6 screen height, bottom-right, z-index 35.

**Required Skills**:
- `React/Styling`: To update Tailwind classes in JSX.

## Stage 1: Component Fix (React)
- **Target**: `src/components/dashboard/GlobalChatbox.tsx`
- **Step 1.1**: Locate the container `div`.
- **Step 1.2**: Update styles:
    - `z-index`: Change to `35` (or equivalent Tailwind `z-35`).
    - Position: `bottom-4 right-4` (approx 15px).
    - Widget Size: Add `max-h-[16vh]` and `min-h-[200px]`.

## Stage 2: Verification
- **Step 2.1**: `npm run build` to ensure no syntax errors.
- **Step 2.2**: Review `GlobalChatbox.tsx` content.