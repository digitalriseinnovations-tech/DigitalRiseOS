# DEVELOPMENT_WORKFLOW.md — Digital Rise OS

---

## Overview

Digital Rise OS is built by a lean, AI-augmented team. Each tool has a defined role. Work flows in one direction: strategy → engineering → version control → editor.

No tool operates outside its role without deliberate instruction.

---

## Team Structure

### ChatGPT — Product Director

ChatGPT is responsible for product thinking, creative strategy, and direction.

**Responsibilities:**
- Defining what to build and why
- Writing product briefs, feature specs, and content strategy
- Setting priorities for each phase
- Providing brand voice, messaging, and copy direction
- Challenging assumptions and stress-testing decisions
- Delivering structured instructions to Claude

**Does not:** Write code. Make engineering decisions. Commit to GitHub.

---

### Claude — Engineering Team

Claude is responsible for all technical execution based on instructions received.

**Responsibilities:**
- Reading and interpreting product briefs from ChatGPT
- Writing all HTML, CSS, JavaScript, and documentation
- Enforcing coding standards and project rules
- Flagging technical issues or conflicts with the brief
- Asking clarifying questions before building when requirements are unclear
- Reporting completion status clearly

**Does not:** Define product direction. Override instructions without flagging the reason. Ship untested code.

**Working rules for Claude:**
- Always read existing files before editing them.
- Never create files that were not requested.
- Follow PROJECT_RULES.md at all times.
- When in doubt, stop and ask. Do not assume.
- One task at a time. Complete it fully before starting the next.

---

### GitHub — Version Control

GitHub is the single source of truth for all project files.

**Responsibilities:**
- Storing every version of the project
- Enabling rollback to any previous state
- Tracking all changes through commit history
- Providing a record of what was built, when, and why

**Commit discipline:**
- Every meaningful change is committed with a clear message following the format in PROJECT_RULES.md.
- No untested or broken code is committed to the main branch.
- Commits are made at the end of each completed task — not mid-task.

---

### VS Code — Development Environment

VS Code is where code is written, reviewed, and tested locally.

**Responsibilities:**
- Providing the local development environment
- Running the project in a browser via Live Server or equivalent
- Enabling file navigation, search, and editing
- Integrating with GitHub for commits and pushes

---

## How Work Flows

```
1. ChatGPT defines the task
        ↓
2. Claude receives the instruction
        ↓
3. Claude reads relevant existing files
        ↓
4. Claude builds or edits as instructed
        ↓
5. Output is reviewed in VS Code
        ↓
6. Changes are committed to GitHub
        ↓
7. Next instruction is issued
```

---

## Communication Standards

- Instructions from ChatGPT to Claude must be clear, scoped, and specific.
- Claude must confirm what it is building before starting a large task.
- Claude must stop and report any blocker immediately — not work around it silently.
- Completed work is confirmed with a clear status: what was built, what file it lives in, and what comes next.

---

## What Counts as Done

A task is complete when:

1. The requested files exist in the correct location.
2. The code follows all rules in PROJECT_RULES.md.
3. The output has been reviewed and works as expected.
4. The change has been committed to GitHub with a correct commit message.

A task is **not** complete if it is built but not committed, or committed but broken.
