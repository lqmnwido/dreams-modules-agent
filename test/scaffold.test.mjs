import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, readdir, symlink, rename, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { plan, writePlan, validate } from '../lib/scaffold.mjs';
import { checkDocuments, lockDraft, lockDocuments, unlockDraft, unlockDocuments, DRAFT_DOCUMENTS, maintain, enforceUi, UI_DEPENDENCY, SHELL_URL } from '../lib/maintenance.mjs';
const config={module:'memorial',code:'MEM',group:'com.dreams',package:'com.dreams.memorial',java:'21',boot:'3.5.0',port:3004,submodules:['feedback','visitors'],answers:[{question:'feedback purpose?',answer:'TBD'}]};
const temp=()=>mkdtemp(join(tmpdir(),'dreams-module-test-'));
test('scaffold includes source folder, split docs, references, submodules and no migrations/domain endpoints', async()=>{
  const root=await temp();const files=await plan(config);await writePlan(root,files);
  for(const path of ['AGENTS.md','.docs/PRD.md','.docs/SCOPE.md','.docs/documents/.gitkeep','.docs/BACKEND.md','.docs/DATABASE.md','.docs/FRONTEND.md','.docs/ARCHITECTURE.md','.docs/TESTING.md','.docs/USERMANUAL.md','memorial_fe/src/views/ui-element/general-crud/list-main.vue','memorial_fe/src/services/training/crud.js','memorial_be/src/main/java/com/dreams/memorial/controller/feedback/.gitkeep']) assert.ok(files.has(path),path);
  assert.equal(JSON.parse(await readFile(join(root,'memorial_fe/package.json'),'utf8')).dependencies['@2enapps/ui'],UI_DEPENDENCY);
  assert.deepEqual(await readdir(join(root,'memorial_be/src/main/resources/db/migration')),['.gitkeep']);
  assert.match(await readFile(join(root,'memorial_be/src/main/resources/application.properties'),'utf8'),/spring.flyway.enabled=true/);
  assert.ok(![...files.keys()].some(p=>/Controller.java$|\.sql$/.test(p)));
  assert.match(files.get('AGENTS.md').toString(),/Human review — required for all work/);
  assert.match(files.get('AGENTS.md').toString(),/Wait for explicit human approval/);
  assert.match(files.get('AGENTS.md').toString(),/exact scripts\/target database|exact scripts and target database/);
  assert.match(files.get('AGENTS.md').toString(),/AI may update unlocked drafts/);
  assert.match(files.get('AGENTS.md').toString(),/including a prompt that only says "Read AGENTS.md"/);
  for(const path of DRAFT_DOCUMENTS) assert.doesNotMatch(files.get(path).toString(),/Human-maintained; AI reads only|humans maintain this manual|AI presents drafts in chat/);
  assert.match(files.get('memorial_fe/exposes.js').toString(),/metadata/);
  assert.doesNotMatch(files.get('memorial_fe/exposes.js').toString(),/ui-element/);
  for(const [p,b] of files) if(p.endsWith('.md')) assert.doesNotMatch(b.toString(),/\{\{\w+\}\}/,p);
  for (const path of files.keys()) {
    if (path.endsWith('.md')) {
      const basename = path.split('/').pop();
      assert.equal(basename, basename.slice(0, -3).toUpperCase() + '.md', path);
    }
  }
  assert.ok(!files.has('memorial_fe/expose.js'));
  assert.ok(files.has('memorial_be/src/main/java/com/dreams/memorial/common/.gitkeep'));
  assert.match(files.get('memorial_be/src/main/java/com/dreams/memorial/MemorialApplication.java').toString(), /class MemorialApplication/);
  assert.ok(!files.has('memorial_be/src/main/java/com/dreams/memorial/exception/.gitkeep'));
  assert.ok(files.has('memorial_fe/.env.local'));
  assert.ok(files.has('memorial_fe/CRUD-REFERENCE.md'));
  assert.match(files.get('memorial_fe/src/metadata.js').toString(), /"routePrefix":\s*"\/memorial"/);
  for (const submodule of config.submodules) {
    assert.ok(files.has(`memorial_fe/src/services/memorial/${submodule}.service.js`));
    assert.ok(!files.has(`memorial_fe/src/services/memorial/${submodule}/index.js`));
    assert.ok(files.has(`memorial_fe/src/services/memorial/${submodule}/hardcode-data.js`));
    assert.ok(!files.has('memorial_fe/src/services/memorial/hardcode-data.js'));
    assert.match(files.get(`memorial_fe/src/services/memorial/${submodule}.service.js`).toString(), /from "\.\/https"/);
    assert.ok(files.has(`memorial_fe/src/views/${submodule}/interface.vue`));
    assert.ok(!files.has(`memorial_fe/src/services/${submodule}/.gitkeep`));
    assert.match(files.get(`memorial_fe/src/views/${submodule}/interface.vue`).toString(), /PageHeader/);
    assert.ok(files.get('memorial_fe/exposes.js').toString().includes(`./views/${submodule}/interface`));
  }
  await checkDocuments(root);
});
test('preflight refuses existing files without writing other files', async()=>{
  const root=await temp();await mkdir(join(root,'.docs'));await writeFile(join(root,'.docs/PRD.md'),'human requirements');
  await assert.rejects(writePlan(root,await plan(config)),/Refusing existing/);
  assert.deepEqual(await readdir(root),['.docs']);assert.deepEqual(await readdir(join(root,'.docs')),['PRD.md']);assert.equal(await readFile(join(root,'.docs/PRD.md'),'utf8'),'human requirements');
});
test('rejects traversal, reserved submodules, duplicates and invalid technical inputs',()=>{
  for(const changes of [{module:'../oops'},{module:'shell'},{submodules:['training']},{submodules:['x','x']},{package:'bad;code'},{boot:'5.0.0'},{port:99999}]) assert.throws(()=>validate({...config,...changes}));
});
test('symlink directory cannot redirect generated files',async t=>{
  if(process.platform==='win32')return t.skip('symlink permission depends on Windows configuration');
  const root=await temp(),other=await temp();await symlink(other,join(root,'.docs'));
  await assert.rejects(writePlan(root,await plan(config)),/Refusing existing/);assert.deepEqual(await readdir(other),[]);
});
test('integrity check detects edited or missing protected Markdown',async()=>{
  const root=await temp();await writePlan(root,await plan(config));await lockDraft(root,'database');await writeFile(join(root,'.docs/DATABASE.md'),'changed after locking');
  await assert.rejects(checkDocuments(root),/Protected Markdown changed.*DATABASE.md/);
});
test('dependency correction replaces alternate dependency locations',async()=>{
  const root=await temp();await writeFile(join(root,'package.json'),JSON.stringify({devDependencies:{'@2enapps/ui':'file:../ui'},optionalDependencies:{'@2enapps/ui':'wrong'}}));
  await enforceUi(root);const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));assert.equal(pkg.dependencies['@2enapps/ui'],UI_DEPENDENCY);assert.equal(pkg.devDependencies['@2enapps/ui'],undefined);assert.equal(pkg.optionalDependencies['@2enapps/ui'],undefined);
});
async function fixture() {
  const root=await temp();await writePlan(root,await plan(config));await mkdir(join(root,'shell/.git'),{recursive:true});await writeFile(join(root,'shell/package.json'),JSON.stringify({dependencies:{'@2enapps/ui':'file:../ui'}}));return root;
}
function runnerFixture(root,{dirty=false,remote='head',failNpm=false}={}) {
  const calls=[];const runner=async(command,args,cwd)=>{
    calls.push([command,args,cwd]);
    if(command==='npm') {assert.equal(JSON.parse(await readFile(join(cwd,'package.json'),'utf8')).dependencies['@2enapps/ui'],UI_DEPENDENCY);if(failNpm)throw Error('npm failed');return '';}
    if(args[0]==='clone') {await mkdir(join(root,'shell/.git'),{recursive:true});await writeFile(join(root,'shell/package.json'),'{}');}
    if(args[0]==='remote')return SHELL_URL;
    if(args[0]==='branch')return 'develop';
    if(args[0]==='status')return dirty?' M source.js':'';
    if(args[0]==='rev-parse')return args[1]==='HEAD'?'head':remote;
    return '';
  };return {calls,runner};
}
test('setup installs only; daily maintenance updates; correct UI before each install/update',async()=>{
  const root=await fixture(),f=runnerFixture(root);
  await maintain(root,{runner:f.runner,today:'2026-10-12',install:true});
  assert.equal(f.calls.filter(([c])=>c==='npm').length,2);
  assert.ok(!f.calls.some(([c,a])=>c==='npm'&&a[0]==='update'));
  await maintain(root,{runner:f.runner,today:'2026-10-12'});
  assert.equal(f.calls.filter(([,a])=>a[0]==='fetch').length,1);
  assert.equal(f.calls.filter(([c,a])=>c==='npm'&&a[0]==='update').length,2);
  assert.equal(f.calls.filter(([c,a])=>c==='npm'&&a[0]==='install').length,2);
  for(const [command,args] of f.calls) {
    if(command==='npm') assert.deepEqual(args,[args[0],'--legacy-peer-deps']);
  }
  await maintain(root,{runner:f.runner,today:'2026-10-13'});
  assert.equal(f.calls.filter(([,a])=>a[0]==='fetch').length,2);await checkDocuments(root);
});
test('clone missing Shell and stop before pull when local changes exist',async()=>{
  const root=await temp();await writePlan(root,await plan(config));const f=runnerFixture(root);
  await maintain(root,{runner:f.runner,today:'2026-10-12'});assert.ok(f.calls.some(([,a])=>a[0]==='clone'));
  const dirty=runnerFixture(root,{dirty:true,remote:'new'});
  await assert.rejects(maintain(root,{runner:dirty.runner,today:'2026-10-13'}),/local changes/);
  assert.ok(!dirty.calls.some(([,a])=>a[0]==='pull'));assert.ok(!dirty.calls.some(([c])=>c==='npm'));
});
test('npm failures propagate and are never reported as complete',async()=>{
  const root=await fixture(),f=runnerFixture(root,{failNpm:true});await assert.rejects(maintain(root,{runner:f.runner,today:'2026-10-12'}),/npm failed/);
});
test('noninteractive CLI fails before writing; help requires no setup',()=>{
  const cli=new URL('../bin/install.mjs',import.meta.url);
  const result=spawnSync(process.execPath,[cli.pathname],{encoding:'utf8'});assert.equal(result.status,1);assert.match(result.stderr,/no files were written/);
  const help=spawnSync(process.execPath,[cli.pathname,'--help'],{encoding:'utf8'});assert.equal(help.status,0);assert.match(help.stdout,/interactive/);
});
test('module transport takes credentials from host and preserves response metadata', async()=>{
  const files=await plan(config);
  const source=files.get('memorial_fe/src/services/memorial/https.js').toString().replace('import { useHostAdapter } from "@2enapps/ui";', 'const useHostAdapter = () => ({ getAuthHeaders: async () => ({ Authorization: "Bearer test-token", authId: "test-actor" }) });');
  const {createModuleClient, returnResponseList, returnResponseDetails}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  const originalFetch=globalThis.fetch,requests=[];
  globalThis.fetch=async(url,options)=>{requests.push({url,options});return new Response(JSON.stringify({data:[{id:1}],totalItems:1}),{headers:{'Content-Type':'application/json'}});};
  try {
    const client=createModuleClient({baseURL:'https://example.test/api'});
    const result=await client.get('/records');
    assert.equal(requests[0].url,'https://example.test/api/records');
    assert.equal(requests[0].options.headers.Authorization,'Bearer test-token');
    assert.ok(!requests[0].url.includes('authId'));
    assert.equal(result.data.totalItems,1);assert.equal(result.status,200);
    assert.equal(result.config.url,requests[0].url);
    const wrapped = await returnResponseList('/records', result);
    assert.equal(wrapped, result);
    assert.deepEqual(wrapped.list, [{ id: 1 }]);
    assert.equal(wrapped.total, 1);
    assert.equal(wrapped.data.totalItems, 1);
    assert.equal(await returnResponseDetails('/records/1', result), result);
    await assert.rejects(createModuleClient({}).get('/records'),/confirmed environment/);
    assert.equal(requests.length,1);
    globalThis.fetch=async()=>new Response(JSON.stringify({message:'Forbidden'}),{status:403,headers:{'Content-Type':'application/json'}});
    await assert.rejects(client.get('/records'),error=>error.status===403&&error.response.data.message==='Forbidden');
  } finally {globalThis.fetch=originalFetch;}
});

test('PRD and unlocked drafts are editable; completed drafts are protected; placeholder tables stay absent', async()=>{
  const root=await temp(),files=await plan(config);await writePlan(root,files);
  const hashes=JSON.parse(files.get('document-integrity.json').toString());
  assert.equal(hashes['.docs/PRD.md'],undefined);
  assert.ok(![...files.keys()].some(p=>p==='AGENT.md'||p==='PRD.md'||p.startsWith('.doc/')||p.startsWith('doc/')));
  assert.ok(hashes['AGENTS.md']);
  for(const path of DRAFT_DOCUMENTS) assert.equal(hashes[path],undefined);
  await writeFile(join(root,'.docs/PRD.md'),'Completed requested work. Actual results and maintenance notes.');
  await checkDocuments(root);
  for(const path of ['AGENTS.md','.docs/SCOPE.md','.docs/FRONTEND.md','.docs/TESTING.md']) {
    const content=files.get(path).toString();
    assert.doesNotMatch(content,/## Traceability|submodule_rows|\| Type \| Total|\| Test type \| Total|\| ID \/ SRS ID|\| Submodule \| IDs \| Service|\| Submodule \| SRS\/use-case IDs/);
  }
  await writeFile(join(root,'.docs/FRONTEND.md'),'Changed by AI');
  await checkDocuments(root);
  await assert.rejects(lockDraft(root,'../AGENTS'),/Choose a draft/);
  await lockDraft(root,'frontend');
  await assert.rejects(lockDraft(root,'frontend'),/already locked/);
  await writeFile(join(root,'.docs/FRONTEND.md'),'Changed after lock');
  await assert.rejects(checkDocuments(root),/Protected Markdown changed/);
});

test('generated backend keeps security on by default and includes local-only bypass verification',async()=>{
  const files=await plan(config);
  const props=files.get('memorial_be/src/main/resources/application.properties').toString();
  assert.match(props,/dreams.security.enabled=\$\{API_SECURITY_ENABLED:true\}/);
  assert.match(props,/dreams.security.issuer-uri=\$\{KEYCLOAK_ISSUER_URI:\}/);
  const local=files.get('memorial_be/src/main/resources/application-local.properties').toString();
  assert.match(local,/server.address=127.0.0.1/);
  assert.doesNotMatch(local,/enabled=false/);
  const security=files.get('memorial_be/src/main/java/com/dreams/memorial/security/SecurityConfig.java').toString();
  assert.doesNotMatch(security,/\{\{package\}\}/);
  assert.ok(files.has('memorial_be/src/main/java/com/dreams/memorial/security/MethodSecurityConfig.java'));
  assert.ok(files.has('memorial_be/src/test/java/com/dreams/memorial/security/SecurityConfigTest.java'));
  assert.match(files.get('memorial_be/pom.xml').toString(),/spring-security-test/);
});


test('module fixture and upload examples use the actual module bucket without wiring live calls', async () => {
  const files = await plan({ ...config, module: 'records', package: 'com.dreams.records' });
  for (const name of ['.env', '.env.local', '.env.example']) {
    assert.match(files.get(`records_fe/${name}`).toString(), /^VUE_APP_BUCKET_RECORDS=records$/m);
  }
  const fixture = files.get('records_fe/src/services/records/feedback/hardcode-data.js').toString();
  const upload = files.get('records_fe/src/services/records/upload.js').toString();
  assert.match(upload, /process\.env\.VUE_APP_BUCKET_RECORDS/);
  assert.doesNotMatch(upload, /VUE_APP_BUCKET_V2T|upload-asr|\{\{env\}\}/);
  assert.match(upload, /size: 5/);
  assert.match(upload, /getUploadClient, uploadAttach/);
  for (const source of [fixture, upload]) {
    const checked = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
    assert.equal(checked.status, 0, checked.stderr);
  }
  const { createDemoDocuments } = await import(`data:text/javascript;base64,${Buffer.from(fixture).toString('base64')}`);
  const first = createDemoDocuments();
  first[0].namaDokumen = 'Changed locally';
  assert.equal(createDemoDocuments()[0].namaDokumen, 'Example document A');
  assert.equal(first[0].dirDokumen, null);
  const page = files.get('records_fe/src/views/feedback/interface.vue').toString();
  assert.doesNotMatch(page, /upload|hardcode-data/);
  assert.doesNotMatch(files.get('records_fe/exposes.js').toString(), /upload|hardcode-data/);
});


test('remote mode defaults off and enables federation only for explicit on', async () => {
  const files = await plan(config);
  for (const name of ['.env', '.env.local', '.env.example']) {
    assert.match(files.get(`memorial_fe/${name}`).toString(), /^VUE_APP_REMOTE=off$/m);
    assert.match(files.get(`memorial_fe/${name}`).toString(), /^VUE_APP_BUCKET_MEMORIAL=memorial$/m);
  }
  const source = files.get('memorial_fe/vue.config.js').toString();
  function load(mode) {
    const context = {
      module: { exports: {} },
      __dirname: '/example/memorial_fe',
      process: { env: mode === undefined ? {} : { VUE_APP_REMOTE: mode } },
      require(name) {
        if (name === 'path') return { resolve: (...parts) => parts.join('/') };
        if (name === './exposes') return { './metadata': './src/metadata.js' };
        if (name === 'webpack') {
          return { container: { ModuleFederationPlugin: class {
            constructor(options) { this.options = options; }
          } } };
        }
        throw new Error(`Unexpected dependency: ${name}`);
      }
    };
    context.require.resolve = (name) => `/dependencies/${name}`;
    runInNewContext(source, context);
    return context.module.exports;
  }
  assert.equal(load().configureWebpack.plugins.length, 0);
  assert.equal(load('off').configureWebpack.plugins.length, 0);
  assert.equal(load('off').publicPath, '/');
  function selectedEntry(configuration) {
    let entry;
    const aliases = { set() {} };
    configuration.chainWebpack({
      resolve: { alias: aliases, symlinks() {} },
      entryPoints: { clear() {} },
      entry() { return { add(value) { entry = value; } }; },
      optimization: { splitChunks() {} }
    });
    return entry;
  }
  assert.equal(selectedEntry(load('off')), './src/main.js');
  assert.equal(selectedEntry(load('on')), './src/remote-entry.js');
  assert.ok(files.has('memorial_fe/src/main.js'));
  assert.ok(files.has('memorial_fe/src/standalone-routes.js'));
  assert.ok(![...files.keys()].some((path) => path.includes('/preview/')));
  const remote = load('on');
  assert.equal(remote.configureWebpack.plugins.length, 1);
  assert.equal(remote.configureWebpack.plugins[0].options.filename, 'remoteEntry.js');
  assert.equal(remote.configureWebpack.plugins[0].options.remotes.shell, 'shell@http://localhost:3000/remoteEntry.js');
  assert.throws(() => load('true'), /VUE_APP_REMOTE must be off or on/);
});


test('workspace skill installer is self-contained and works outside the bootstrap checkout', async () => {
  const root = await temp();
  await writePlan(root, await plan(config));
  const launcher = join(root, 'skills.js');
  const outside = await temp();
  const list = spawnSync(process.execPath, [launcher, '--list'], { cwd: outside, encoding: 'utf8' });
  assert.equal(list.status, 0, list.stderr);
  for (const skill of ['d-documents', 'd-frontend', 'd-backend', 'd-testing', 'd-manual']) {
    assert.ok(list.stdout.includes(skill));
  }
  const installed = spawnSync(process.execPath, [launcher, '--opencode', '--project', root], { cwd: outside, encoding: 'utf8' });
  assert.equal(installed.status, 0, installed.stderr);
  const names = await readdir(join(root, '.opencode/skills'));
  assert.equal(names.length, 5);
  for (const name of names) {
    assert.ok((await readFile(join(root, '.opencode/commands', `${name}.md`), 'utf8')).includes(name));
  }
  const repeat = spawnSync(process.execPath, [launcher, '--opencode', '--project', root], { cwd: outside, encoding: 'utf8' });
  assert.equal(repeat.status, 0, repeat.stderr);
  assert.match(repeat.stdout, /unchanged:/);
  await checkDocuments(root);
});


test('Phase 1 lock command resolves actual casing and locks exactly the five designs', async () => {
  const root = await temp();
  await writePlan(root, await plan(config));
  for (const name of ['scope', 'architecture', 'database', 'backend', 'frontend']) {
    await rename(join(root, `.docs/${name.toUpperCase()}.md`), join(root, `.docs/${name}.md`));
  }
  const result = spawnSync(process.execPath, [join(root, 'scripts/maintenance.mjs'), 'lock'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const hashes = JSON.parse(await readFile(join(root, 'document-integrity.json'), 'utf8'));
  for (const name of ['SCOPE', 'ARCHITECTURE', 'DATABASE', 'BACKEND', 'FRONTEND']) {
    assert.ok(hashes[`.docs/${name}.md`]);
  }
  assert.equal(hashes['.docs/TESTING.md'], undefined);
  assert.equal(hashes['.docs/USERMANUAL.md'], undefined);
  assert.equal(hashes['.docs/PRD.md'], undefined);
  await checkDocuments(root);
});

test('locking rejects duplicate casing and missing documents without partial baseline changes', async () => {
  const root = await temp();
  await writePlan(root, await plan(config));
  const manifest = join(root, 'document-integrity.json');
  const before = await readFile(manifest, 'utf8');
  await unlink(join(root, '.docs/FRONTEND.md'));
  await assert.rejects(lockDocuments(root), /Missing draft frontend/);
  assert.equal(await readFile(manifest, 'utf8'), before);
  await writeFile(join(root, '.docs/FRONTEND.md'), 'Restored draft');
  await writeFile(join(root, '.docs/scope.md'), 'Duplicate');
  await assert.rejects(lockDocuments(root), /Ambiguous draft scope/);
  assert.equal(await readFile(manifest, 'utf8'), before);
  await unlink(join(root, '.docs/scope.md'));
  await lockDraft(root, 'scope');
  await assert.rejects(lockDraft(root, 'SCOPE'), /already locked/);
  const locked = await readFile(manifest, 'utf8');
  await assert.rejects(lockDocuments(root), /already locked/);
  assert.equal(await readFile(manifest, 'utf8'), locked);
});


test('Phase 1 completion uppercases all five filenames without changing content and locks uppercase paths', async () => {
  const root = await temp();
  const files = await plan(config);
  await writePlan(root, files);
  for (const name of ['scope', 'architecture', 'database', 'frontend']) {
    await rename(join(root, `.docs/${name.toUpperCase()}.md`), join(root, `.docs/${name}.md`));
  }
  await lockDocuments(root);
  const names = await readdir(join(root, '.docs'));
  const hashes = JSON.parse(await readFile(join(root, 'document-integrity.json'), 'utf8'));

  for (const name of ['scope', 'architecture', 'database', 'backend', 'frontend']) {
    const target = `.docs/${name.toUpperCase()}.md`;
    assert.ok(names.includes(`${name.toUpperCase()}.md`));
    assert.ok(!names.includes(`${name}.md`));
    assert.equal(await readFile(join(root, target), 'utf8'), files.get(`.docs/${name.toUpperCase()}.md`).toString());
    assert.ok(hashes[target]);
    assert.equal(hashes[`.docs/${name}.md`], undefined);
  }

  assert.ok(!(await readdir(root)).some((name) => name.startsWith('.document-lock-')));
  await checkDocuments(root);
  await writeFile(join(root, '.docs/SCOPE.md'), 'Changed after locking');
  await assert.rejects(checkDocuments(root), /Protected Markdown changed.*SCOPE.md/);
});


test('unlock reopens selected drafts without changing content or unrelated locks', async () => {
  const root = await temp();
  await writePlan(root, await plan(config));
  await lockDocuments(root);
  const manifest = join(root, 'document-integrity.json');
  const before = JSON.parse(await readFile(manifest, 'utf8'));
  const selected = join(root, '.docs/SCOPE.md');
  await writeFile(selected, 'User-authorized revision');
  const cli = spawnSync(process.execPath, [join(root, 'scripts/maintenance.mjs'), 'unlock', 'scope'], { encoding: 'utf8' });
  assert.equal(cli.status, 0, cli.stderr);
  const after = JSON.parse(await readFile(manifest, 'utf8'));
  delete before['.docs/SCOPE.md'];
  assert.deepEqual(after, before);
  assert.equal(await readFile(selected, 'utf8'), 'User-authorized revision');
  await checkDocuments(root);
  await unlockDraft(root, 'scope');
  await unlockDocuments(root);
  const final = JSON.parse(await readFile(manifest, 'utf8'));
  assert.ok(final['AGENTS.md']);
  for (const name of ['SCOPE', 'ARCHITECTURE', 'DATABASE', 'BACKEND', 'FRONTEND']) {
    assert.equal(final[`.docs/${name}.md`], undefined);
  }
  await lockDocuments(root);
  await checkDocuments(root);
});

test('unlock refuses unrelated integrity violations and invalid selections', async () => {
  const root = await temp();
  await writePlan(root, await plan(config));
  await lockDocuments(root);
  const manifest = join(root, 'document-integrity.json');
  const original = await readFile(manifest, 'utf8');
  await assert.rejects(unlockDraft(root, '../AGENTS'), /Choose a draft/);
  await writeFile(join(root, 'AGENTS.md'), 'Unexpected protected change');
  await assert.rejects(unlockDocuments(root), /Protected Markdown changed.*AGENTS.md/);
  assert.equal(await readFile(manifest, 'utf8'), original);
});


test('standalone bootstrap initializes Pinia before UI and mounts with blocked external services', async () => {
  const files = await plan(config);
  let source = files.get('memorial_fe/src/main.js').toString();
  const events = [];
  let adapter;
  const app = {
    use(plugin, options) {
      if (options?.hostAdapter) adapter = options.hostAdapter;
      events.push('use');
      return app;
    },
    mount(target) { events.push(target); }
  };
  globalThis.__dreamsStandaloneTest = {
    createApp: () => app,
    h: () => null,
    createPinia: () => ({}),
    setActivePinia: () => events.push('pinia'),
    createI18n: () => ({}),
    createRouter: () => ({ async isReady() { events.push('router-ready'); } }),
    createWebHashHistory: () => ({}),
    RouterView: {},
    routes: [{}],
    loadUi() { events.push('ui'); return { default: {} }; }
  };
  source = source.replace(/^import .*;\n/gm, '');
  source = 'const { createApp, h, createPinia, setActivePinia, createI18n, createRouter, createWebHashHistory, RouterView, routes, loadUi } = globalThis.__dreamsStandaloneTest;\n' + source;
  source = source.replace('await import("@2enapps/ui")', 'await loadUi()');
  source = source.replace('await import("@2enapps/ui/styles.css");', '');
  try {
    const module = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
    await module.standaloneReady;
    assert.ok(events.indexOf('pinia') < events.indexOf('ui'));
    assert.ok(events.indexOf('router-ready') < events.indexOf('#app'));
    assert.throws(() => adapter.getAuthHeaders(), /External services are disabled/);
    assert.throws(() => adapter.uploadAttachment(), /External services are disabled/);
    assert.equal(adapter.getUploadClient(), null);
  } finally {
    delete globalThis.__dreamsStandaloneTest;
  }
});


test('Java 25 Boot 4 scaffold includes modular MVC, OAuth2 and Flyway starters', async () => {
  const files = await plan({ ...config, java: '25', boot: '4.1.1' });
  const pom = files.get('memorial_be/pom.xml').toString();
  assert.match(pom, /<version>4\.1\.1<\/version>/);
  assert.match(pom, /<java.version>25<\/java.version>/);
  for (const artifact of ['spring-boot-starter-webmvc', 'spring-boot-starter-security-oauth2-resource-server', 'spring-boot-starter-flyway']) {
    assert.ok(pom.includes(`<artifactId>${artifact}</artifactId>`), artifact);
  }
  assert.doesNotMatch(pom, /<artifactId>spring-boot-starter-web<\/artifactId>|<artifactId>spring-boot-starter-oauth2-resource-server<\/artifactId>/);
  const properties = files.get('memorial_be/src/main/resources/application.properties').toString();
  assert.match(properties, /spring.flyway.enabled=true/);
  assert.match(properties, /spring.jpa.hibernate.ddl-auto=none/);
  assert.match(properties, /spring.sql.init.mode=never/);
  assert.match(properties, /API_SECURITY_ENABLED:true/);
});
