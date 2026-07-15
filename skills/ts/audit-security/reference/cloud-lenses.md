# SEC-CLOUD - cloud / IaC / container / Kubernetes / serverless lens family

The deep counterpart to SEC-SUP7 (Dockerfile) and SEC-SUP8 (IaC), which are deliberately shallow tripwires.
When Dockerfile / `*.tf` / K8s manifest / serverless markers are present, SUP7/SUP8 escalate into this file.
Marker-gated on the same triggers as `trivy config` (see `reference/scanners.md`).

**The governing rule of the family - read first.** A SEC-CLOUD check fires ONLY against a COMMITTED artifact.
No Dockerfile, no `*.tf`/CloudFormation/Pulumi, no K8s manifest, no function code = the check is **N/A**,
confirmed by the marker probe returning nothing, and **said so** - never silently passed, and **never a
finding**. The absence of infrastructure-as-code is not a security finding; it is out of scope, owned by a
cloud-config review / pentest. (The one Low note worth making: infra configured only in a vendor dashboard is
un-audited-by-code and un-reviewable in a PR - an observation, not a vuln.) Most target repos trip this gate,
so the family is cheap-to-skip and loud-when-it-applies.

**The division of labour with trivy / checkov.** `trivy config` and `checkov` already fire on every
single-resource boolean (privileged, runAsNonRoot, drop-ALL, encryption-at-rest, IMDSv1, `0.0.0.0/0`). For
those the LLM lens is **not the detector** - trivy emits the candidate - it is the three things a per-file
linter structurally cannot do: **cross-resource reachability** (which subject reaches cluster-admin; which pod
no NetworkPolicy selects), the **absence of an account/namespace-wide control** (no admission label, no
default-deny, no CloudTrail), and **intent** (is this privileged container the node agent that must be, or app
code that must not). Report a trivy-confirmed boolean as a candidate **re-graded by data-sensitivity and
reachability**; spend the fan-out budget on the cross-resource / absence / code-only checks no config scanner
produces. Each check is tagged **[trivy/checkov]** (they detect it - lens adds intent + severity),
**[cross-resource]** or **[code-only]** (net-new LLM detection), and **[noisy - hold severity]** where it
fires on nearly every naive artifact.

---

## SEC-K8S - Kubernetes workload & cluster manifests

Governing trace for RBAC and NetworkPolicy: the finding spans resources in *different files* - the config
scanner's blind spot.

- **SEC-K8S1. Privileged / host-namespace / hostPath escape** (Baseline PSS; CIS-K8S 5.2). **[trivy/checkov]**
  Probe: grep manifests for `privileged: true`, `hostNetwork|hostPID|hostIPC: true`, `hostPath:`, `hostPort:`
  >0 - in `containers`, `initContainers` AND `ephemeralContainers` (the block the per-container check forgets).
  `privileged` = all caps + all host devices; `hostPID` = read other pods' `/proc` env (their secrets);
  `hostPath: /` or `/var/run/docker.sock` = own the node / the daemon. Correct: none set; a real device need
  met by a specific `capabilities.add` or a CSI driver. Floor: **High**; **Critical** for `privileged`,
  `hostPID`/`hostIPC`, or a `hostPath` on `/`, the docker socket, `/etc`, or a node-credential path. FP-trap
  (the one that matters): a genuine node-agent DaemonSet (CNI, CSI, log shipper, node-exporter, kube-proxy)
  legitimately needs some of these - trivy flags it identically to app code. Separate "infra component that
  must" from "app workload that must not"; hold the former at Low/Info. Do not report every `hostPath` on a
  monitoring agent as Critical.

- **SEC-K8S2. Missing hardened securityContext** (Restricted PSS). **[trivy/checkov, noisy - hold severity]**
  Probe: per container, the five Restricted fields - `runAsNonRoot: true`, `allowPrivilegeEscalation: false`,
  `capabilities.drop: ["ALL"]`, `readOnlyRootFilesystem: true`, `seccompProfile.type: RuntimeDefault`. Grep the
  ABSENCE - default-on-omission is the trap: omit `allowPrivilegeEscalation` -> defaults **true**; omit
  `runAsNonRoot` -> a `USER 0` image runs as root. Floor: **Medium** each; **High** combined (no
  `securityContext` at all) on an internet-facing workload, or when the image's final `USER` is root. Noise:
  report **once per workload** as "not hardened to Restricted PSS," not five findings per container; hold
  Medium unless reachability lifts it.

- **SEC-K8S3. Namespace runs no admission gate - Pod Security Admission label absent** (CIS-K8S 5.2.1).
  **[cross-resource / absence]** Probe: for each `kind: Namespace`, grep `labels` for
  `pod-security.kubernetes.io/enforce`. Absent = nothing stops a future privileged pod, so every K8S1/K8S2
  finding is unenforced by the platform. Correct: `enforce: restricted` (or `baseline` with justification) on
  every app namespace, or a documented Kyverno/Gatekeeper policy. Floor: **Medium** (High if privileged
  workloads already live in it). FP-trap: enforcement may be a `kind: ClusterPolicy`/`ConstraintTemplate` in
  another file - grep before reporting; absence of the label is not absence of admission control.

- **SEC-K8S4. Over-broad RBAC - cluster-admin, wildcard verbs/resources, subject-reachability** (CIS-K8S 5.1;
  the flagship net-new check). **[cross-resource]** trivy/checkov lint one Role in isolation; the real question
  spans three resources in three files: `RoleBinding`/`ClusterRoleBinding` -> `ClusterRole` -> the
  `ServiceAccount` a pod mounts. Probe: (1) grep `ClusterRole`/`Role` for `verbs: ["*"]`, `resources: ["*"]`,
  `apiGroups: ["*"]`; (2) grep every binding for `roleRef.name: cluster-admin` or a wildcard role and note its
  `subjects`; (3) trace each subject to the workload that mounts it. The finding IS the trace: "SA `default` /
  ns `app` -> bound to `cluster-admin` -> mounted by internet-facing Deployment `web` = any RCE in `web` owns
  the cluster." Watch `secrets` and `*` (read every secret), `pods/exec` (shell any pod),
  `escalate`/`bind`/`impersonate` (privilege-grant primitives), and bindings to
  `system:authenticated`/`system:anonymous` (everyone). Floor: **High**; **Critical** when the subject is
  reachable from an internet-facing/untrusted-input workload, or the verb is `*`/`secrets`/`escalate`/
  `impersonate`. FP-trap: a `*` ClusterRole bound to NO active subject (or only a human SSO group) is latent =
  Medium; platform controllers (cert-manager, ingress, CNI) hold broad roles by design - grade by whether the
  subject is attacker-reachable, not the role's breadth.

- **SEC-K8S5. automountServiceAccountToken defaults true** (CIS-K8S 5.1.5/5.1.6). **[trivy/checkov +
  cross-resource]** Probe: grep for `automountServiceAccountToken: false`; its absence means the pod carries a
  mounted kube-API token even if it never calls the API - and (via K8S4) that token IS the RBAC the SA holds,
  handed to any process or injection in the container. Floor: **Medium** (High when the SA's RBAC is
  non-trivial - the token is then a cluster credential). FP-trap: an operator/controller that genuinely calls
  the API needs it - flag the default on plain app pods.

- **SEC-K8S6. Secret-as-env, and no default-deny NetworkPolicy** (two absence checks). **[cross-resource /
  absence]** (a) grep `valueFrom.secretKeyRef` / `envFrom.secretRef` - an env secret is readable by every
  process, leaks into crash dumps, `kubectl describe`, child-process env, and a `hostPID` neighbour's `/proc`.
  Correct: mount the Secret as a read-only volume, or External Secrets / CSI Secrets Store. Floor:
  **Low/Medium** (the "secrets mounted, not env" rule). (b) grep the namespace for any `NetworkPolicy` with a
  default-deny (`podSelector: {}` + `policyTypes: [Ingress, Egress]`); absence = flat network, any compromised
  pod reaches every other pod and the API server. Floor: **Medium** (High for a namespace holding PII or the
  DB). FP-trap: the CNI must support NetworkPolicy (Calico/Cilium yes, some managed defaults no) - same result,
  different fix; note it.

- **SEC-K8S7. Missing resource limits - node-level DoS** (CIS-K8S 5.7). **[trivy/checkov, noisy - hold
  severity]** Probe: containers lacking `resources.limits.memory|cpu`, and no namespace
  `ResourceQuota`/`LimitRange`. No memory/PID limit = one leak or fork-bomb OOMs the node and every co-located
  pod. Floor: **Low**; **Medium** in a multi-tenant namespace (noisy-neighbour -> tenant DoS). Noise: fires on
  nearly every manifest - Low, once per workload, never let it crowd out K8S4.

---

## SEC-IAC - cloud resource posture beyond SUP8 (Terraform / CloudFormation / Pulumi / CDK)

SUP8 covers the four loud ones (`0.0.0.0/0`, public bucket, IAM `*`, default creds). trivy/checkov fire on
essentially all the booleans below (AVD-AWS-* / CKV_AWS-*); the lens re-grades by data-sensitivity and reasons
across resources they check in isolation.

- **SEC-IAC1. Encryption at rest off / customer data unencrypted** (CIS-AWS 2). **[trivy/checkov]** Probe: S3
  `server_side_encryption_configuration`, EBS `encrypted`, RDS `storage_encrypted`, EFS/DynamoDB/SQS/SNS/
  Redshift/ElastiCache flags, snapshot `kms_key_id`. Floor: **Medium**; **High** (E5) when the store holds PII
  / call recordings / payment data. Noise: on a scratch/log bucket, Low - grade by what is IN the store (which
  trivy cannot see).

- **SEC-IAC2. Logging / audit trail disabled** (CIS-AWS 3; the SOC 2 checkpoint in IaC form). **[trivy/checkov]**
  Probe: no `aws_cloudtrail` (or `is_multi_region_trail=false`, `enable_log_file_validation=false`); VPC
  `aws_flow_log` absent; S3/RDS/ELB/CloudFront access logs off; GuardDuty/Config disabled. No CloudTrail = the
  "who/what/when" audit invariant, gone at the infra layer. Floor: **Medium** (High for account-wide CloudTrail
  - its absence blinds the whole account).

- **SEC-IAC3. Public snapshot / AMI / shared resource** (exfil-by-config). **[trivy/checkov - frequently
  under-graded]** Probe: RDS/EBS snapshot `shared_accounts=["all"]` or `public=true`; `aws_ami_launch_permission`
  to `all`; ECR/S3 policy wildcard principal; RDS `publicly_accessible=true`. A public snapshot is the whole
  database handed to the internet. Floor: **Critical** if it holds data (a generic "resource is public" rule
  mis-grades this Medium - override up).

- **SEC-IAC4. S3 no versioning / no MFA-delete / no object-lock** (CIS-AWS 2.1). **[checkov; trivy partial,
  noisy]** Probe: `versioning` disabled, `mfa_delete` off, no `object_lock_configuration` on a
  backup/compliance bucket - no ransomware/recovery floor. Floor: **Low/Medium** (Medium for the only copy of
  customer data); Low on ephemeral buckets.

- **SEC-IAC5. Security group over-broad by PORT** (CIS-AWS 5; the depth SUP8 gestures at). **[checkov per-port;
  trivy catch-all + cross-resource]** SUP8 flags `0.0.0.0/0`; the depth grades by port and by what is behind
  it: `0.0.0.0/0` on 22/3389 or 3306/5432/6379/27017/9200 = **Critical**; on 443/80 to a public ALB =
  expected/Info. Net-new: an SG referencing another over-broad SG (transitive exposure, checked per-rule and
  missed), and egress `0.0.0.0/0` on a workload that should have none (exfil / SSRF amplifier). Floor: graded
  by port.

- **SEC-IAC6. IMDSv1 allowed - the SSRF->credentials multiplier** (ties SEC-WEB2). **[trivy/checkov]** Probe:
  `metadata_options` absent or `http_tokens="optional"` on `aws_instance`/launch template; ECS task not
  enforcing IMDSv2. IMDSv1 is an unauthenticated GET to `169.254.169.254` - any app SSRF becomes
  instance-credential theft. Correct: `http_tokens="required"`, `http_put_response_hop_limit=1`. Floor:
  **High** (direct amplifier of the SSRF class already hunted).

- **SEC-IAC7. KMS key policy / rotation** (CIS-AWS 3). **[checkov; principal-graph is the lens's]** Probe:
  `enable_key_rotation=false`; a key policy with `Principal:"*"` or broad `kms:*` to the whole account (the key
  that encrypts everything, usable by everyone = encryption theatre). Floor: **Medium** (High when it protects
  crown-jewel data with an account-wide policy).

- **SEC-IAC8. Weak TLS on LB / no WAF on public entry** (CIS-AWS 4). **[trivy/checkov, noisy - hold severity]**
  Probe: ALB/NLB/CloudFront `ssl_policy` allowing TLS 1.0/1.1; an HTTP listener with no redirect; a public
  ALB/API-GW with no `aws_wafv2_web_acl_association`. Floor: weak TLS **Low** (Med only fronting auth/PII);
  **missing WAF is Info/Low** - the noisiest cloud check there is, a recommendation, never a ship-blocker.

---

## SEC-FN - serverless functions (Lambda / Cloud Functions / Azure Functions)

The half that matters is code trivy/checkov never see: FN3 is pure LLM dataflow.

- **SEC-FN1. Over-broad execution role - one RCE, whole account** (least-privilege, per-function). **[checkov
  per-statement; intent is the lens's]** Probe: the function's role - `Action:"*"`, `Resource:"*"`,
  `dynamodb:*`/`s3:*`/`iam:*` on `*`, or one role shared across many functions. The role is ambient credentials
  in the runtime; any handler code-exec (or poisoned dep) inherits it. Correct: one role per function, scoped
  to the exact tables/buckets/queues it names - read the handler, list its AWS calls, diff against the grant.
  Floor: **High**; **Critical** for `iam:*`/`sts:AssumeRole`/`*` on `*`.

- **SEC-FN2. Secrets in function env vars** (ties SEC-SEC5/6). **[trivy/checkov obvious; "is it a secret" is
  the lens's]** Probe: `environment { variables }` holding a key/token/password/connection-string, not an
  ARN/SSM path. Lambda env is visible in the console, `GetFunctionConfiguration` (a read-only role sees it),
  and CloudTrail. Correct: store in Secrets Manager/SSM, keep only the reference in env, fetch at cold start.
  Floor: **High**. FP-trap: a feature flag or public endpoint in env is fine - flag secrets, not all env.

- **SEC-FN3. Event-source injection - the handler trusts the trigger payload** (LLM-only; no config scanner
  sees this). **[code-only]** Probe: the handler body - an event field (`event.Records[].s3.object.key`,
  `event.body`, `event.queryStringParameters`, an SNS message) reaching a sink (DynamoDB/SQL query, `exec`,
  SSRF `fetch`, a downstream `invoke`, HTML). The trigger payload is attacker-influenceable (an S3 key an
  uploader chose; an SNS message a public topic accepted) yet handlers treat it as trusted "internal" data.
  Same backward taint walk as SEC-INJ/SEC-WEB2, serverless source. Floor: per the sink's class (Critical ->
  SQL/exec, High -> SSRF/downstream-invoke). This is the reason the lens exists for serverless.

- **SEC-FN4. No timeout / concurrency bound - denial-of-wallet** (ties SEC-BL4). **[checkov partial; cost
  reasoning is the lens's]** Probe: `timeout` at platform max (900s) on a seconds-long function; no
  `reserved_concurrent_executions`; a public function URL / API-GW route with no throttle. An unbounded
  publicly-triggerable function is metered spend an attacker controls - the cloud analogue of the SMS/LLM
  cost-DoS already hunted. Floor: **Medium** (High when the trigger is unauthenticated and calls a paid
  downstream).

---

## SEC-IMG - container image hardening beyond the Dockerfile (opt-in `trivy image`)

SUP7 covers the Dockerfile TEXT. This is the built IMAGE - reachable only with the `--images` opt-in in
`scanners.md`; **N/A unless a built tag / image reference is available.**

- **SEC-IMG1. Base-image CVEs** (`trivy image`, opt-in). **[trivy image is the detector]** Probe:
  `trivy image --ignore-unfixed <ref>`; report only FIXED, HIGH/CRITICAL CVEs. Floor: CVSS x exposure. FP-trap
  (house policy): NEVER report unfixed base-OS CVEs you do not control - `--ignore-unfixed` is mandatory or you
  train the reader to ignore trivy.

- **SEC-IMG2. USER root in the FINAL stage - the multi-stage trap** (CIS-Docker 4.1). **[trivy config partial;
  final-stage reasoning is the lens's]** SUP7 checks "a `USER` exists"; the depth checks it is in the LAST
  `FROM` and non-zero. `USER node` in the builder + nothing in the runtime stage ships as **root** - the USER
  the naive check found is on the thrown-away stage. Grep the final `FROM` onward. Correct: `USER 1000`
  (numeric, so K8s `runAsNonRoot` can verify it) in the final stage. Floor: **Medium** (High internet-facing).
  FP-trap: a `gcr.io/distroless/*:nonroot` final stage is already non-root - do not flag it for lacking an
  explicit USER.

- **SEC-IMG3. Unpinned / untrusted base - no digest, no multi-stage** (CIS-Docker 4.2). **[trivy/checkov
  partial, noisy]** Probe: `FROM image:tag` with no `@sha256:` digest (a mutable tag, repointable - the
  container equivalent of SUP3); an unknown registry; no multi-stage split, so compilers/`curl`/package
  managers ship in runtime and become the attacker's toolkit. Correct: `FROM base@sha256:...`, official
  registry, multi-stage. Floor: **Low/Medium**. FP-trap: digest-pinning disables base-image auto-bumps - a
  hygiene trade-off, keep it Low unless the registry is untrusted.

- **SEC-IMG4. No HEALTHCHECK / runtime capability posture + docker-socket mount** (CIS-Docker 4.6, 5.x).
  **[trivy config partial, noisy on HEALTHCHECK]** Probe: no `HEALTHCHECK` (availability hygiene); in
  `compose.yml` - `privileged: true`, `cap_add`, `security_opt` missing `no-new-privileges`, no `read_only`,
  and a mount of `/var/run/docker.sock`. Floor: HEALTHCHECK **Low** (never block); **High** for a `docker.sock`
  mount (host takeover - same as K8S1's hostPath on the socket). FP-trap: the socket-mount is the real finding
  inside this check, not the missing HEALTHCHECK.

---

## Secrets-management POSTURE - extends SEC-SEC5, do not fork a new family

The cloud posture questions belong on the existing secrets lens (`SEC-SEC5` in `reference/lenses.md`),
cross-referenced from here, gated on infra markers:

- **Manager vs env vs committed.** Best: a real manager (Secrets Manager / SSM / Vault / External Secrets) by
  ARN. Worse: plaintext in Lambda/K8s env (SEC-FN2, SEC-K8S6). Worst: committed to IaC -
  `aws_db_instance.password="..."`, a `*.tfvars` in git, a K8s `Secret` with literal `stringData:`. gitleaks
  catches the high-entropy ones; the lens catches the structured `password =` assignment gitleaks' regex
  misses. Floor: committed live credential = **Critical**.
- **Rotation.** KMS `enable_key_rotation` (IAC7); Secrets Manager `rotation_rules` absent; a long-lived static
  `aws_iam_access_key` instead of a role - the credential that outlives the employee who made it. Floor:
  **Medium** (High for a broad long-lived key).
- **Least privilege on the store.** The secret is encrypted, but who can READ it? `secretsmanager:GetSecretValue`
  on `*`, a KMS policy the whole account can decrypt (IAC7), a K8s SA with cluster-wide `get secrets` (K8S4).
  Floor: **High** when a broad principal can read a crown-jewel secret.

---

## Consolidated noise-control (hold severity - do NOT let these crowd out real findings)

Report each once, at the floor stated, never inflated:
- **SEC-K8S2** missing securityContext fields - fires on every naive manifest; one finding per workload, Medium.
- **SEC-K8S7** missing resource limits - availability hygiene, Low.
- **SEC-IAC8** missing WAF - Info/Low, a recommendation, never a ship-blocker; weak TLS Low unless fronting
  auth/PII.
- **SEC-IAC4** S3 versioning/MFA-delete - Low on ephemeral buckets.
- **SEC-IMG3** unpinned digest - Low; a hygiene/reproducibility trade-off, not a vuln.
- **SEC-IMG4** missing HEALTHCHECK - Low, never block.
- **Node-agent DaemonSets (K8S1)** and **platform controllers (K8S4)** - the biggest false-positive source in
  the family; hold at Low/Info when the privileged/broad-RBAC workload is genuinely an infra component, not app
  code.

**Family-wide honesty line, printed whenever it applies:** *"No committed infra artifact found (deploy is
dashboard-configured); the SEC-CLOUD family is N/A, not clean - it arms the moment a Dockerfile / manifest /
`*.tf` / function is committed."*
