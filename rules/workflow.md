## Workflow Orchestration

- **Plan mode for ANY non-trivial task** (3+ steps or an architectural decision), for verification steps
  too - not just building. If something goes sideways, STOP and re-plan rather than pushing on.
- **Subagents liberally** to keep the main context clean - research, exploration, parallel analysis. One
  task per subagent.
- **After ANY correction from the user**, capture the pattern: `/memory-store --store .agentstore/memory/
  <data>`, or append to `.agentstore/memory/lessons.md`. Write the rule that prevents the repeat, and
  review lessons at session start.
- **Never mark a task complete without proving it works** - run the tests, check the logs, diff the
  behaviour against main where that is the question. "Would a staff engineer approve this?"
- **For non-trivial changes, ask once whether there is a more elegant way**, and challenge your own work
  before presenting it. Skip it for simple obvious fixes.
- **Given a bug report: just fix it.** Point at the logs, errors and failing tests, then resolve them -
  no hand-holding round-trip.

## Task Management
Write the plan to `.agentstore/tasks/plans.md` as checkable items, check in before implementing, mark
them off as you go with a high-level summary at each step, and add a review section there when done.
