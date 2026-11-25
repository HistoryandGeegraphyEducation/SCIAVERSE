# SCIAVERSE — Project Instructions

## Project identity
SCIAVERSE (Digital Science Environment) is an independent, multi-disciplinary digital science environment. It is not a rename or a fork of EDUVERSE. Do not read, copy, migrate, edit, or depend on EDUVERSE unless the user explicitly starts a later research and transfer phase.

## Required workflow before every development task
1. Read this file first.
2. Read the current Taste Skill instructions and only the references relevant to the task.
3. Read the current Hallmark instructions and the references relevant to the task.
4. Read Unslop after the design or implementation stage, then audit and correct the result.
5. Inspect the actual repository state before editing. Never rely on prior summaries as a substitute for the current files.

The pinned skill sources are Git submodules:
- Taste Skill: `tools/taste-skill/skills/taste-skill/SKILL.md`
- Hallmark: `tools/hallmark/skills/hallmark/SKILL.md`
- Unslop: `tools/unslop/skills/unslop/SKILL.md`

## Product and implementation rules
- Mobile-first is mandatory. Design, implement, and verify the complete core experience on a phone-sized viewport before adapting it to tablet and desktop.
- Do not treat desktop as the source layout or shrink a desktop dashboard to fit a phone.
- Touch targets, reading order, navigation, scrolling, and performance on mobile take priority.
- Support reduced motion, visible keyboard focus, sufficient contrast, and no horizontal overflow.
- Use restrained scientific/technical visual language. Avoid generic space gradients, neon glow, decorative planets, fake charts, invented metrics, and filler content.
- Motion must communicate state or spatial relationships. Keep it lightweight and respect reduced-motion preferences.
- Do not invent scientific facts, user activity, statistics, or completed features. Clearly mark demonstrative/sample data when used.
- Do not add domains or product modules as approved taxonomy unless the user has approved them.

## Change discipline
- Make the smallest targeted change that satisfies the task.
- Do not rewrite unrelated files or remove unrelated functionality.
- Preserve working behavior and assets.
- Do not add dependencies unless required and justified.
- Before editing, state the intended files and verification criteria.
- After editing, report exact files changed, behavior implemented, tests actually run, and known limitations.
- Never claim a test, render, deployment, or repository change succeeded unless the result was observed.

## Dashboard development order
1. Establish the mobile navigation and app shell.
2. Build the mobile dashboard content hierarchy and touch interactions.
3. Verify at phone widths and heights, including narrow and tall devices.
4. Refine tablet layouts.
5. Refine desktop layouts.
6. Run the relevant Hallmark and Unslop checks.

## Definition of done for mobile-first work
- Core navigation is visible and usable without hover.
- No clipped controls, overlapping content, or horizontal page scrolling.
- Main actions are reachable with one-handed touch where practical.
- Text remains readable without zooming.
- Layout remains usable with reduced motion enabled.
- The page works at 320px, 360px, 390px, and 430px CSS widths before larger breakpoints are considered.
