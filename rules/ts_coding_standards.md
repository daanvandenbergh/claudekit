## Coding Standards
- Dont use `—`, instead use `-`.
- Use 4 spaces as 1 indent level, unless CLAUDE.md instructs otherwise.
- Write in commercial grade typescript which is ready for production.
- Ensure each function, class, method, interface, interface property has a docstring defining their behaviour.
- Never use @ts-ignore, @ts-nocheck, or similar directives that suppress real errors. `@ts-expect-error` is banned in library/source code too, with ONE exception: dedicated type-safety test files (`*.test-d.ts` / `*.test-d.tsx`), where `@ts-expect-error` *asserts* that an invalid construct is correctly rejected by the compiler. There it verifies type safety rather than hiding a bug - and `tsc` fails on an unused directive, so a regression breaks `npm run typecheck`. These files are validated by `tsc` (they are excluded from the vitest run glob), never executed.