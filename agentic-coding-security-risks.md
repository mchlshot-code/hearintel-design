# Agentic Coding Security Risks — Comprehensive Research Reference

> Last updated: June 2026  
> Sources: OWASP Top 10 for Agentic Applications 2026, OWASP Agentic Security Initiative (ASI), Cloud Security Alliance, academic research (arXiv), and real-world incident reports.

---

## Overview

Agentic AI systems — autonomous agents that plan, delegate, and execute complex workflows — introduce a fundamentally different attack surface from traditional web applications. Unlike static software, agents act, decide, and chain tools together, meaning a single vulnerability can cascade across an entire workflow before a human can intervene.

This document catalogs all known risk categories, organized by threat domain.

---

## PART 1: OWASP Top 10 for Agentic Applications (2026)

These are the 10 most critical risks identified by 100+ industry experts and published December 2025.

---

### ASI01 — Agent Goal Hijack (Prompt Injection)

**What it is:**  
An attacker manipulates the agent's core objective by injecting malicious instructions through any data the agent processes — emails, documents, web pages, RAG database entries, tool outputs, or user chat input.

**Attack variants:**
- **Direct injection** — user sends malicious text directly to the agent
- **Indirect injection** — attacker poisons a document/email/webpage the agent will later retrieve; the agent processes it as trusted context
- **RAG poisoning** — a single malicious PDF slipped into a knowledge base gives persistent influence over every future query that retrieves it

**Real incident:**  
EchoLeak (CVE-2025-32711, CVSS 9.3) — a hidden prompt payload inside an attacker's email, when retrieved by Microsoft 365 Copilot's RAG, silently leaked emails, SharePoint files, and Teams chats with no user interaction. Attack success rates for indirect injection reached 84% in controlled trials.

**Mitigation:**
- Never allow untrusted input to reach the agent's system prompt or instruction layer
- Treat all external data (emails, docs, web content) as untrusted — apply a semantic firewall layer before agent processing
- Use separate context windows for instructions vs. retrieved data
- Require human confirmation before any action triggered by externally-sourced content

---

### ASI02 — Tool Misuse and Over-Privileged Access

**What it is:**  
The agent is granted broader tool permissions than any single task requires. A compromised or confused agent can then call destructive tools — `DROP TABLE`, `rm -rf`, shell commands, payment APIs — that far exceed what it needed.

**Real incident:**  
Check Point Research disclosed CVE-2025-59536 (CVSS 8.7) and CVE-2026-21852 (CVSS 5.3) in Claude Code: simply cloning and opening an untrusted repository could trigger remote code execution and API key exfiltration before any user consent dialog appeared.

**Mitigation:**
- Apply strict **least privilege** per task — grant only what the current workflow requires, revoke after completion
- Use scoped database roles that cannot drop tables or alter system configs
- Sandbox code execution environments with no network, no root, no write access unless explicitly required
- Require dry-run previews for any destructive or high-impact tool action

---

### ASI03 — Identity Spoofing and Impersonation

**What it is:**  
In multi-agent systems, an attacker registers a rogue agent that clones the schema or identity of a trusted agent. Legitimate agents route sensitive tasks — and sensitive data — through the impersonator.

**Attack patterns:**
- Fake peer registration: cloned agent schema intercepts privileged coordination traffic
- A2A (Agent-to-Agent) spoofing: forged agent identity cards embed adversarial instructions, triggering data exfiltration via the host LLM
- Non-Human Identity (NHI) bypass: agent identity governance checks bypassed via caller-controlled input

**Mitigation:**
- Mutual TLS for all agent-to-agent communication
- Signed agent identity cards (cryptographic provenance)
- Authenticated discovery mechanisms — no dynamic agent registration without verification
- Anti-replay protections on delegation messages

---

### ASI04 — Privilege Escalation via Chained Actions

**What it is:**  
An agent starts with limited permissions but chains together a sequence of individually permitted actions that collectively achieve a privilege level no single action would have allowed. Each step looks benign; the aggregate is an attack.

**Real incident:**  
Four CVEs in CrewAI (2026) enabled chaining prompt injection into Remote Code Execution, SSRF, and file reads via the Code Interpreter and default configurations.

**Mitigation:**
- Monitor cumulative action sequences, not just individual calls
- Enforce hard ceilings on chained tool calls per session (e.g., max 10 consecutive tool executions before human review)
- Log entire action graphs for post-incident forensics
- Apply semantic validation on multi-step plans before execution begins

---

### ASI05 — Agentic Supply Chain Attacks

**What it is:**  
Agents assemble models, tools, MCP servers, plugins, prompt templates, and third-party agents **at runtime**. Any compromised component in this dynamic supply chain can silently redirect or poison the entire agent.

**Attack vectors:**
- Malicious MCP servers impersonating trusted tools
- Typosquatted or hallucinated npm/pip package names that resolve to malware
- Poisoned prompt templates with hidden instructions
- Tool descriptors embedding adversarial metadata
- Vulnerable third-party agents joining multi-agent workflows
- Compromised MCP registries serving altered components

**Real incident:**  
ClawHub (the primary marketplace for OpenClaw skills) was systematically poisoned in Q1 2026. Five of the top seven most-downloaded skills at peak infection were confirmed malware. A malicious MCP server also impersonated Postmark's email service and secretly forwarded all sent emails.

**Mitigation:**
- Pin all dependencies to specific verified versions (no floating `latest`)
- Use signed manifests and curated, audited registries only
- Never run `npm install` or `pip install` from agent-generated package names without human review
- Sandbox third-party tools and MCP servers; treat their outputs as untrusted
- Implement kill switches for rapid deactivation of compromised components

---

### ASI06 — Memory and Context Poisoning

**What it is:**  
Agents use memory (short-term context, long-term storage, RAG databases, conversation history) to inform future behavior. If an attacker can insert malicious content into any memory layer, the agent becomes persistently compromised — silently shaping future decisions across sessions and even across users.

**Attack patterns:**
- Attacker submits a crafted support ticket stored in the agent's RAG database, causing the agent to include exfiltration instructions in responses to all other users
- "Sleeper" memory attacks: fabricated memories stay dormant, then re-emerge across sessions to drive attacker-chosen actions
- Cross-user contamination: one user's poisoned input affects another's results
- MemoryTrap (Claude Code vulnerability): poisoned memory spreading across sessions to infect multiple users

**Why detection is hard:**  
Poisoned memory looks identical to legitimate data — it is natural language that passes standard content filters and safety checks.

**Mitigation:**
- Never write unvalidated user content directly into long-term memory
- Apply semantic validation on all content before it enters any persistent memory store
- Implement memory access controls and isolation between user sessions
- Periodically audit and expire stale or unverified memory entries
- Log all memory write operations with source attribution

---

### ASI07 — Unexpected Code Execution

**What it is:**  
Agents generate and execute code — shell commands, scripts, migrations, template evaluation, deserialization — without adequate sandboxing or human review. Injected or hallucinated code runs with the agent's full system permissions.

**Attack patterns:**
- Code assistants applying generated patches directly to production systems
- Prompt injection triggering shell commands via tool calls
- Unsafe deserialization in agent memory systems
- Tool-chaining attacks using PowerShell + curl to exfiltrate data

**Mitigation:**
- Treat all model-generated code as untrusted until reviewed
- Require explicit human approval before executing any generated script or migration
- Enforce strict sandbox boundaries: no filesystem write, no outbound network, no elevated shell access without explicit grant
- Apply static analysis on generated code before execution

---

### ASI08 — Recursive Tool Call Cascades (Runaway Loops)

**What it is:**  
Autonomous agents loop until they believe a task is complete. When an agent encounters an error it cannot resolve, it may enter an infinite retry loop — burning API credits, exhausting system resources, or amplifying a mistake across many downstream systems before anyone notices.

**Why it compounds:**  
In multi-agent systems, a hallucinating planner can issue destructive tasks to multiple sub-agents simultaneously. A single confused top-level agent can trigger a cascade of bad actions across an entire workflow.

**Mitigation:**
- Hard-code a maximum consecutive tool execution limit (e.g., 5 loops) before mandatory human halt
- Implement circuit breakers that pause workflows on repeated failures
- Monitor API usage spikes in real time with automatic alerts
- Isolate sub-agent boundaries so cascade failures cannot propagate across all agents

---

### ASI09 — Insecure Inter-Agent Communication

**What it is:**  
Multi-agent systems exchange messages across MCP channels, A2A endpoints, RPC interfaces, and shared memory. Without authentication, encryption, and semantic validation, attackers can intercept, inject, replay, or tamper with agent-to-agent instructions.

**Attack patterns:**
- MITM injection: unencrypted agent traffic allows hidden instructions to be inserted in transit
- Descriptor poisoning: fake MCP endpoint advertises spoofed capabilities, routing sensitive data through an attacker-controlled server
- Replay attacks: old delegation messages replayed to trigger unintended actions
- Poisoned routing: agents redirected to communicate with impostors

**Mitigation:**
- Encrypt all agent-to-agent traffic (mutual TLS minimum)
- Sign all payloads — verify sender identity on every message
- Implement anti-replay tokens on delegation messages
- Validate message semantics, not just format, before acting on received instructions

---

### ASI10 — Rogue and Deceptive Agent Behavior

**What it is:**  
A compromised or misaligned agent acts harmfully while appearing to function normally. The agent continues to produce plausible outputs and pass surface-level checks while pursuing attacker-controlled objectives in the background.

**Why it is the hardest threat to catch:**  
Unlike a crash or error, a rogue agent does not announce itself. Detection requires behavioral monitoring across entire action sequences, not just output inspection.

**Mitigation:**
- Monitor for policy violations: accessing off-limits systems, unexpected data egress patterns, unusual tool sequences
- Log complete action graphs — every tool call, every data access, every external request
- Implement anomaly detection on agent behavior baselines
- Apply strict governance and human oversight for any agent with write access to production systems

---

## PART 2: MCP-Specific Security Risks

The Model Context Protocol has become the connective tissue of agentic AI. Its design introduces a distinct attack surface.

---

### MCP-01 — Tool Poisoning via Malicious Descriptions

**What it is:**  
MCP tool descriptions flow directly into the LLM's context window. An attacker crafting a malicious MCP server can embed adversarial instructions inside tool descriptions. When the agent loads the server, its behavior is silently altered without any visible prompt injection.

**Real incident:**  
As of May 2026, at least seven confirmed high- or critical-severity CVEs span MCP-integrated platforms including MCP Inspector, LiteLLM, Cursor IDE, LibreChat, and Windsurf.

**Mitigation:**
- Review all MCP server tool descriptions before loading — treat them as executable code, not documentation
- Only use MCP servers from verified, audited sources
- Sandbox MCP server connections in isolated environments

---

### MCP-02 — Cross-Server Tool Shadowing

**What it is:**  
A malicious MCP server registers tool names that overlap with tools from a trusted server. The agent, unable to distinguish between them, routes calls to the attacker's server instead of the legitimate one.

**Mitigation:**
- Namespace all tool names by their server source
- Implement tool registry with cryptographic signing
- Alert on duplicate tool name registrations across servers

---

### MCP-03 — Rug Pull Attacks

**What it is:**  
A legitimate MCP server is updated post-deployment to swap its tool behavior. The agent continues to trust and use it based on its previous audit, but the tool now performs different (malicious) operations.

**Mitigation:**
- Pin MCP server versions and verify hashes on each load
- Monitor tool behavior consistency over time; alert on behavioral drift
- Treat MCP server updates as requiring re-audit before trust is restored

---

### MCP-04 — Unauthenticated WebSocket Endpoints

**What it is:**  
Local MCP instances exposed via WebSocket without authentication allow any process on the network to connect and issue commands to the agent.

**Real incident:**  
SecurityScorecard found 135,000+ publicly exposed OpenClaw instances in February 2026; 53,000+ were correlated with prior breach activity. CVE-2026-28363 (CVSS 9.9) allowed WebSocket brute-force against local OpenClaw instances.

**Mitigation:**
- Bind MCP WebSocket servers to localhost only, never 0.0.0.0
- Require authentication tokens on all WebSocket connections
- Audit all exposed ports before production deployment

---

### MCP-05 — Log Poisoning via WebSocket

**What it is:**  
Attackers write malicious content to agent log files via WebSocket requests. Since the agent reads its own logs for troubleshooting context, injected log entries become a prompt injection vector that can influence agent decisions.

**Real incident:**  
OpenClaw patched this vulnerability (version 2026.2.13) in February 2026.

**Mitigation:**
- Treat agent log files as untrusted input when read back into context
- Sanitize log content before it re-enters the agent's reasoning pipeline
- Separate operational logs from the agent's context window

---

## PART 3: Multi-Agent System Risks

---

### MA-01 — Cascading Hallucination Attacks

**What it is:**  
A hallucinating planner agent issues subtly incorrect instructions to multiple downstream sub-agents. Each sub-agent acts on the flawed plan, compounding the error. By the time the damage is visible, it has propagated across all systems the agents touch.

**Mitigation:**
- Implement verification layers between planner and executor agents
- Require sub-agents to validate plan feasibility before execution
- Apply isolation boundaries so failures in one agent cannot propagate to others

---

### MA-02 — Agent-as-a-Proxy (MITM) Attacks

**What it is:**  
A compromised agent is used as a proxy to attack downstream services. Legitimate agent credentials and trust relationships are leveraged to bypass security controls on systems the attacker could not reach directly.

The arXiv paper "Bypassing AI Control Protocols via Agent-as-a-Proxy Attacks" (February 2026) formalizes this attack pattern.

**Mitigation:**
- Authenticate downstream service requests at the service boundary, not just at the agent boundary
- Do not grant agents implicit trust to downstream systems beyond what is explicitly scoped
- Monitor for unusual lateral movement patterns in agent traffic

---

### MA-03 — Non-Human Identity (NHI) Governance Gaps

**What it is:**  
Agents authenticate to services using credentials (API keys, OAuth tokens, service accounts). These Non-Human Identities are frequently over-permissioned, poorly rotated, and invisible to traditional identity governance tools that focus on human accounts.

**Scale of the problem:**  
The average enterprise AI agent deployment in 2026 depends on numerous external services, each with its own credential. Most organizations cannot fully enumerate their agent supply chains, let alone audit all NHI credentials.

**Mitigation:**
- Inventory all agent credentials as rigorously as human identities
- Apply automatic rotation policies to all agent API keys and tokens
- Scope NHI permissions to the minimum required per workflow
- Use short-lived credentials (temporary tokens) wherever possible
- Integrate NHI monitoring into your existing IAM tooling

---

## PART 4: Data and Privacy Risks

---

### D-01 — Uncontrolled Data Retrieval and PII Exposure

**What it is:**  
Agents querying large unstructured datasets may inadvertently retrieve and expose PII or intellectual property in response to benign queries from lower-clearance users, if access controls and semantic validation are absent.

**Mitigation:**
- Enforce attribute-based access control on all data sources the agent can query
- Apply output filtering to scrub PII from agent responses before delivery
- Implement semantic validation on retrieval results — not just format, but content sensitivity

---

### D-02 — Shadow AI and Unauthorized Agent Deployment

**What it is:**  
Employees deploy unauthorized AI agents on corporate networks outside IT visibility. These agents access sensitive corporate data with no security review, no audit trail, and no governance controls.

**Scale:**  
Cisco's 2026 survey found 64% of enterprise employees have used AI tools unknown to IT. Among developers specifically, 38% have deployed AI coding agents on corporate machines without IT approval.

**Mitigation:**
- Establish a clear AI agent governance policy with mandatory registration
- Implement network monitoring to detect unauthorized outbound AI API traffic
- Create a fast-track approval process that reduces incentive for shadow deployment
- Educate developers on the risks — most shadow deployments stem from friction, not malice

---

### D-03 — Indirect Data Exfiltration via Side Channels

**What it is:**  
Attackers trick agents into summarizing or reformatting sensitive information in ways that expose it through indirect channels — without the agent ever directly copying or transmitting the data.

**Real incident:**  
The Slack AI incident (August 2024) demonstrated how indirect prompt injection in private channels could trick the corporate AI into summarizing sensitive information from channels the attacker had no access to.

**Mitigation:**
- Implement data egress monitoring on all agent outputs
- Block agents from referencing content from higher-clearance contexts in lower-clearance responses
- Apply information flow controls across agent memory and retrieval boundaries

---

## PART 5: Code Generation and SDLC Risks

---

### C-01 — Insecure Generated Code Shipped Without Review

**What it is:**  
AI coding agents generate code that passes surface-level review but contains subtle security vulnerabilities — insecure authentication, missing input validation, broken access controls — because the agent optimized for functional correctness, not security.

**The "vibe coding" problem:**  
Agents under pressure to solve quickly take shortcuts: hallucinated package names, copy-pasted patterns from insecure training data, missing error handling, hardcoded credentials.

**Mitigation:**
- Enforce SAST (Static Application Security Testing) on all AI-generated code before merge
- Never auto-merge agent-generated pull requests without security scan gates
- Include security requirements explicitly in agent prompts — not just functional requirements
- Treat AI-generated code with the same (or higher) scrutiny as junior developer output

---

### C-02 — Repository-Level Configuration File Exploitation

**What it is:**  
Configuration files (`.cursorrules`, `CLAUDE.md`, `.clinerules`, etc.) now function as part of the execution layer for coding agents. Cloning an untrusted repository and opening it in an agentic IDE can trigger malicious instructions before the developer reviews any code.

**Real incident:**  
CVE-2025-59536 (CVSS 8.7) in Claude Code demonstrated that simply opening an untrusted project could trigger remote code execution and API key exfiltration before any consent dialog appeared.

**Mitigation:**
- Review all agent configuration files before opening any cloned repository in an agentic IDE
- Implement sandboxed repository opening — no agent execution until explicit approval
- Treat `.cursorrules`, `CLAUDE.md`, and similar files as security-sensitive artifacts
- Add automated scanning of these files in CI/CD pipelines

---

### C-03 — Build Pipeline and CI/CD Compromise

**What it is:**  
A compromised coding agent with access to CI/CD systems can modify build scripts, inject malicious dependencies, alter deployment configurations, or introduce backdoors into production artifacts — all within the normal development workflow.

**Real incident:**  
A walkthrough published in 2026 demonstrated how indirect prompt injection against the gemini-cli coding agent escalated into full supply-chain compromise of the developer environment, rippling into the build pipeline from a single poisoned input.

**Mitigation:**
- Restrict coding agent permissions to feature branches only — no direct access to main/release branches
- Require human review for any agent-proposed changes to CI/CD configuration, build scripts, or dependency files
- Sign all build artifacts; verify signatures at deployment
- Separate agent credentials from deployment credentials

---

## PART 6: The "Lethal Trifecta" Framework

Security researcher Simon Willison identified the conditions that make AI agent data theft possible:

```
Private Data + Untrusted Content + External Communication = Exfiltration Risk
```

When all three are present simultaneously, an attacker can steal data through prompt injection alone — no malware, no exploits, no access credentials required.

**Audit your systems against this trifecta:**
- Does your agent have access to private/sensitive data?
- Does your agent process any untrusted content (user input, external documents, web content, emails)?
- Does your agent have any capability to communicate externally (send emails, make HTTP requests, call external APIs)?

If all three answers are yes, you have a critical data exfiltration surface that requires immediate architectural review.

---

## PART 7: General Mitigation Principles

### Principle 1 — Least Privilege Everything
Every agent, tool, and credential should have the minimum permissions required for its specific task. Revoke after completion.

### Principle 2 — Human-in-the-Loop for High-Impact Actions
Any action that is irreversible, destructive, financial, or externally-communicating must require explicit human confirmation before execution. Automate the reversible; require approval for the irreversible.

### Principle 3 — Treat All External Data as Untrusted
Emails, documents, web pages, RAG content, tool outputs — none of these should be trusted as instructions, regardless of their source. Separate data from instructions architecturally.

### Principle 4 — Log Everything, Monitor Everything
Complete action graphs, tool call sequences, data access patterns, and external communications must be logged. Rogue agents don't announce themselves — behavioral forensics is your primary detection mechanism.

### Principle 5 — Cryptographic Provenance
Sign tool manifests, agent identity cards, build artifacts, and MCP server packages. Trust should be verifiable mathematically, not assumed from reputation.

### Principle 6 — Assume Compromise
Design agent systems on the assumption that any single component — a tool, an MCP server, a sub-agent, a memory entry — may already be compromised. Defense in depth across every layer.

### Principle 7 — Hard Limits on Autonomy
Maximum loop counts, maximum chained actions, maximum consecutive failures before halt. Infinite autonomy is infinite attack surface.

---

## References

- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [OWASP Agentic Security Initiative (ASI)](https://genai.owasp.org/initiatives/agentic-security-initiative/)
- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/)
- [Cloud Security Alliance — MCP Security Crisis](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-security-crisis-20260504-csa-styled/)
- [Agentic Zero Trust Research Paper, Cequence (May 2026)](https://www.cequence.ai/wp-content/uploads/2026/05/Agentic-Zero-Trust-Research-Paper-v3.pdf)
- [Prompt Injection Attacks on Agentic Coding Assistants (arXiv 2601.17548)](https://arxiv.org/html/2601.17548v1)
- [Agentic AI Security: Threats, Defenses, Evaluation (arXiv 2510.23883)](https://arxiv.org/pdf/2510.23883)
- [Complete Guide to OWASP Top 10 for Agentic Applications — nhimg.org](https://nhimg.org/complete-guide-to-the-2026-owasp-top-10-risks-for-agentic-applications)
- [Top Agentic AI Security Threats, Stellar Cyber (2026)](https://stellarcyber.ai/learn/agentic-ai-securiry-threats/)
- [Adversa AI — Top Agentic AI Security Resources (May & June 2026)](https://adversa.ai/blog/top-agentic-ai-security-resources-june-2026/)
- [8,000+ MCP Servers Exposed — Medium (February 2026)](https://cikce.medium.com/8-000-mcp-servers-exposed-the-agentic-ai-security-crisis-of-2026-e8cb45f09115)
- [Checkmarx — 11 Emerging AI Security Risks with MCP](https://checkmarx.com/zero-post/11-emerging-ai-security-risks-with-mcp-model-context-protocol/)
