# Sinks and sources - the per-ecosystem injection catalog

The rule this whole file serves: **a sink is only a bug when a SOURCE reaches it without passing a sanitizer
whose grammar matches that sink.** Grep the sink token, then trace *backwards across files* to a source. Free
Semgrep is intrafile-only, so the cross-file backward walk is where the LLM sweep earns its keep.

**The grammar-match insight - the most common false negative.** A sanitizer is class-specific. `z.string()`
(or `typeof x === "string"`) collapses `{$ne:null}` to "not a string, reject" and so stops Mongo
operator-smuggling - but it does nothing for XSS, path traversal, or SSTI: the value is still a fully
attacker-controlled string when it reaches those sinks. Same string, different grammar, different sanitizer.
At each sink, name the interpreter's grammar first, then ask whether the value crossed a sanitizer that speaks
*that* grammar. A validator for the wrong grammar reads as "sanitized" and is exactly what hides the bug.

**This catalog is EXTENSIBLE, not exhaustive.** A project on an ecosystem not listed below gets its catalog
derived at audit time from its own idioms (the sink is whatever reaches an interpreter as code/structure; the
source is whatever crosses a trust boundary). Never skip a stack because it is not in the table - derive it.

---

## Node.js / TypeScript (Express + Next.js)

| | |
|---|---|
| **SOURCES** | Express `req.query` `req.params` `req.body` `req.headers` `req.cookies`. Next.js `searchParams`/`params` props, `await req.json()`, `req.formData()`, **Server Action arguments** (a trust boundary), `headers()`/`cookies()`, route-handler `Request`. Also `process.argv`, WebSocket messages, webhook payloads, voice/LLM tool-call args. |
| **DANGEROUS SINKS** | RCE: `child_process.exec`/`execSync` (spawns `/bin/sh -c`), `spawn`/`execFile` with `{shell:true}`, `eval()`, `new Function()`, `setTimeout`/`setInterval` with a **string**, `vm.runInContext`/`vm.Script`, `require(userInput)` / dynamic `import(userInput)`. NoSQL operator injection: a body object reaching a Mongo/Mongoose filter - `Model.find(req.body)`, `{$ne}`/`{$gt}`/`{$regex}`/`{$where:"...js..."}`/`$expr`, aggregation `$function`/`$accumulator`. Pipeline-update expression injection: a `$`-prefixed user value in an aggregation-pipeline `$set` (a caller saying `"$notes"` is a FIELD PATH). Path traversal: `fs.readFile`/`createReadStream`/`res.sendFile`/`express.static`, `path.join(root,userInput)`. XSS: `res.send(html)`, React `dangerouslySetInnerHTML`, `.innerHTML`/`.outerHTML`/`insertAdjacentHTML`, `document.write`, `href={userInput}` (`javascript:`). Prototype pollution: recursive `_.merge`/`_.defaultsDeep`/`deepmerge`, `_.set` with a user path, hand-rolled merge of parsed JSON carrying `__proto__`/`constructor`/`prototype`. SSRF/redirect: `fetch`/`axios`/`http.request(userUrl)`, `res.redirect(userInput)`. |
| **SAFE PATTERNS** | `execFile`/`spawn` with an **argument array**, `shell:false` (default); allowlist the program. Zod `.parse()` at every boundary, **coerce ids to a primitive** so an object cannot slip in as an operator; never spread a body into a filter; `express-mongo-sanitize`. `$literal`-wrap every user value spliced into a pipeline stage. Files: `path.resolve(root,name)` then assert `resolved.startsWith(root+path.sep)`, or `path.basename()`. JSX auto-escapes; `DOMPurify.sanitize()` for raw HTML; validate URL scheme for hrefs. Proto pollution: `Object.create(null)`/`Map`, reject the three magic keys, `--disable-proto=throw`. |

## Python (Django + Flask)

| | |
|---|---|
| **SOURCES** | Django/DRF `request.GET` `request.POST` `request.FILES` `request.body` `request.data` `request.query_params` `request.headers` `request.COOKIES`. Flask `request.args` `request.form` `request.values` `request.json` `request.files` `request.cookies`. Also `sys.argv`, env, queue payloads. |
| **DANGEROUS SINKS** | RCE cmd: `os.system`, `os.popen`, `subprocess.run/call/Popen(..., shell=True)`. RCE code: `eval`, `exec`, `compile`, `__import__`. Deserialize: `pickle.load/loads`, `yaml.load` **without `SafeLoader`**, `marshal.loads`, `jsonpickle`. SQL: `Model.objects.raw(sql)`, `QuerySet.extra(...)`, `RawSQL()`, `cursor.execute(f"...")` / `%`/`.format`/`+`, SQLAlchemy `text(f"...")`. SSTI: Flask `render_template_string(user)`, `jinja2.Template(user).render()`, `{% autoescape false %}`, `| safe`, `Markup(user)`. Path: `open(user_path)`, `send_file` misuse, `os.path.join(base,user)`. XXE: `xml.etree`/`lxml.etree` on untrusted XML. `mark_safe()` on user content. |
| **SAFE PATTERNS** | `subprocess.run([...], shell=False)`; `shlex.quote()` only if a string is unavoidable; allowlist. `yaml.safe_load`; `json` not pickle; `defusedxml`. ORM `.filter()` or `cursor.execute("... = %s",[val])`, Django `params=`, SQLAlchemy bound params. Jinja autoescape stays ON; never `render_template_string` on user input. Files: `os.path.realpath()` + `os.path.commonpath()` base check, `werkzeug.utils.secure_filename`, Flask `safe_join`. |

## Go

| | |
|---|---|
| **SOURCES** | `r.URL.Query().Get(...)`, `r.FormValue`/`r.PostFormValue`, `mux.Vars(r)`/chi `URLParam`, `r.Header.Get`, `json.NewDecoder(r.Body).Decode`, `r.Cookie`, `os.Args`, `flag`. |
| **DANGEROUS SINKS** | RCE: `exec.Command("sh","-c",userStr)` / any `os/exec` where the command NAME is user-controlled. SQL: `db.Query`/`Exec`/`QueryRow` built with `fmt.Sprintf`/`+`. XSS: `text/template` emitting HTML; `template.HTML(user)`/`template.JS`/`template.URL`; `fmt.Fprintf(w,userStr)`. Path: `os.Open`/`os.ReadFile`/`http.ServeFile` over `filepath.Join(root,userInput)`; `http.Dir`. SSRF: `http.Get(userURL)`. |
| **SAFE PATTERNS** | `exec.Command("prog",arg1,arg2)`, never `sh -c`; allowlist. `database/sql` placeholders (`?`/`$1`) with args; `sqlx.In`. Use **`html/template`** (context-aware escaping); never wrap untrusted data in `template.HTML`. Traversal: `filepath.Clean` + `strings.HasPrefix(cleaned,root)`, or Go 1.24 **`os.Root`/`os.OpenRoot`**. |

## Java / Spring

| | |
|---|---|
| **SOURCES** | `@RequestParam` `@PathVariable` `@RequestBody` `@RequestHeader` `@CookieValue` `@ModelAttribute`; `HttpServletRequest.getParameter/getHeader/getInputStream`; JMS/Kafka listeners. |
| **DANGEROUS SINKS** | RCE: `Runtime.getRuntime().exec(String)`, `ProcessBuilder` invoking `sh -c`, `ScriptEngine.eval`, Groovy `Eval`/`GroovyShell.evaluate`. Deserialize: `ObjectInputStream.readObject`, `XMLDecoder.readObject`, `XStream.fromXML` (default), SnakeYAML `Yaml.load`, Jackson default/polymorphic typing. Expression injection: `SpelExpressionParser().parseExpression(user)` with `StandardEvaluationContext`, OGNL, Thymeleaf/JSP EL. SQL: `Statement.executeQuery("..."+x)`, `EntityManager.createQuery("..."+x)`, `createNativeQuery(str)`, `@Query` concat, JdbcTemplate concat. Path: `new File(base,user)`, `Paths.get(user)`, Zip Slip via `zipEntry.getName()`. XXE: `DocumentBuilderFactory`/`SAXParserFactory`/`XMLInputFactory` unhardened. |
| **SAFE PATTERNS** | `ProcessBuilder` with an arg list, no shell; allowlist. Avoid native/`XMLDecoder` deserialization; else a JEP-290 `ObjectInputFilter` allowlist; SnakeYAML `SafeConstructor`; Jackson without default typing. **`SimpleEvaluationContext`** (not `StandardEvaluationContext`) for any SpEL over data. **`PreparedStatement`** with `?` binds, JPA `setParameter`/named params. Files: `Path.normalize()` + `startsWith(baseDir)`; validate zip-entry targets. Harden XML factories (disable DTDs/external entities). |

## Ruby / Rails

| | |
|---|---|
| **SOURCES** | `params[...]`, `request.body`/`headers`/`cookies`, tampered `session`, `ENV`, `ARGV`, job args. |
| **DANGEROUS SINKS** | RCE cmd: `system`, backticks, `%x[]`, `exec`, `Kernel.spawn`, `IO.popen`, `Open3.*` with a shell string, `Kernel#open("|cmd")`/`URI.open` pipe. Code: `eval`, `instance_eval`/`class_eval`/`module_eval`, `ERB.new(user).result`. Method injection: `send`/`__send__`/`public_send`/`try` with a user method name; `constantize`/`safe_constantize`. Deserialize: `Marshal.load`, `YAML.unsafe_load`, `Oj.load` (default). SQL: interpolated fragments - `where("name = '#{x}'")`, `find_by_sql(str)`, raw `order`/`group`/`select`/`pluck`. XSS: `raw`, `html_safe`, `<%== %>`. Open redirect: `redirect_to params[:url]`. Mass assignment: missing strong params. |
| **SAFE PATTERNS** | `system("prog",arg1,arg2)`; `Shellwords.escape`; allowlist. Never `eval` user input; allowlist `send` targets. `YAML.safe_load`; `JSON.parse` not `Marshal.load`. ActiveRecord parameterized: `where("name = ?",x)`, `where(name: x)`, named binds. ERB auto-escapes; prefer `sanitize` with an allowlist. `redirect_to ..., allow_other_host: false`; `params.require(:x).permit(:a,:b)`. |

## PHP

| | |
|---|---|
| **SOURCES** | `$_GET` `$_POST` `$_REQUEST` `$_COOKIE` `$_FILES` `$_SERVER`, `file_get_contents('php://input')`, `getenv`, `$argv`. |
| **DANGEROUS SINKS** | RCE cmd: `system`, `exec`, `shell_exec`, `passthru`, backticks, `popen`, `proc_open`, `pcntl_exec`. Code: `eval`, `assert(str)`, `create_function`, `preg_replace` `/e`, dynamic `$func()`, `call_user_func*` with a user callable. Object injection: `unserialize($user)` (POP chains), `phar://`. File inclusion: `include`/`require` with a user path; wrappers `data://`/`php://filter`/`phar://`. SQL: `mysqli_query("..."+$x)`, `$pdo->query("..."+$x)`, any concat. Path: `fopen`/`file_get_contents`/`readfile`/`unlink` with a user path. XSS: `echo`/`print` of raw `$_GET`. |
| **SAFE PATTERNS** | Avoid the shell; else `escapeshellarg()` per argument + allowlist. Never `eval`/`create_function` on input. `unserialize($x,['allowed_classes'=>false])` or `json_decode`; `phar.readonly=On`. Includes: strict allowlist / `basename()` to a fixed dir; `allow_url_include=Off`. **PDO prepared statements** with `?` binds. Files: `realpath()` + base-dir prefix, `basename()`. Output: `htmlspecialchars($x,ENT_QUOTES,'UTF-8')`. |

---

## Three traps that look safe but are not

- **`filepath.Join` (Go) and `path.join` (Node) CLEAN but do not CONTAIN.** They normalise `..` away but the
  result can still escape the root. Containment needs an explicit `startsWith(root)` check *after* resolving,
  or `os.Root` (Go 1.24+). Flag these even when the code "sanitizes".
- **Node `vm` is not a security sandbox** (documented as such). `vm.runInContext` on untrusted code is RCE.

## Two version-dependent defaults worth checking

- **Ruby Psych 4 / Ruby 3.1+ made `YAML.load` safe-by-default.** The smell is now a call to `YAML.unsafe_load`
  (or older code that relied on `load` being unsafe).
- **Rails 7 defaults `redirect_to` to `allow_other_host: false`.** An explicit `allow_other_host: true` on a
  user-controlled target is the open-redirect finding.
