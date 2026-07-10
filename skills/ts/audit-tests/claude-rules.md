## Unit Tests
After writing any code, write meticulous unit tests. This is critical, non-negotiable.
- Test every single edge case - happy path, error path, boundaries, empty/null inputs, malformed data.
- Aim for 100% coverage. Every branch, every line.
- Write as many tests as needed - never skimp on tests to save effort.
- Code without its tests is unfinished.
- Place test files in a `tests/` subdirectory next to the code under test - never alongside the source files. Example: tests for `src/i18n/*.ts` live in `src/i18n/tests/*.test.ts`, tests for `src/*.ts` live in `src/tests/*.test.ts`.