import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, readdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { plan, writePlan, validate } from '../lib/scaffold.mjs';
import { checkDocuments, lockDraft, DRAFT_DOCUMENTS, maintain, enforceUi, UI_DEPENDENCY, SHELL_URL } from '../lib/maintenance.mjs';
const config={module:'memorial',code:'MEM',group:'com.dreams',package:'com.dreams.memorial',java:'21',boot:'3.5.0',port:3004,submodules:['feedback','visitors'],answers:[{question:'feedback purpose?',answer:'TBD'}]};
const temp=()=>mkdtemp(join(tmpdir(),'dreams-module-test-'));
test('scaffold includes source folder, split docs, references, submodules and no migrations/domain endpoints', async()=>{
  const root=await temp();const files=await plan(config);await writePlan(root,files);
  for(const path of ['AGENTS.md','.docs/PRD.md','.docs/scope.md','.docs/documents/.gitkeep','.docs/backend.md','.docs/database.md','.docs/frontend.md','.docs/architecture.md','.docs/testing.md','.docs/usermanual.md','memorial_fe/src/views/ui-element/general-crud/list-main.vue','memorial_fe/src/services/training/crud.js','memorial_be/src/main/java/com/dreams/memorial/controller/feedback/.gitkeep']) assert.ok(files.has(path),path);
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
  for(const changes of [{module:'../oops'},{module:'shell'},{submodules:['training']},{submodules:['x','x']},{package:'bad;code'},{boot:'4.0.0'},{port:99999}]) assert.throws(()=>validate({...config,...changes}));
});
test('symlink directory cannot redirect generated files',async t=>{
  if(process.platform==='win32')return t.skip('symlink permission depends on Windows configuration');
  const root=await temp(),other=await temp();await symlink(other,join(root,'.docs'));
  await assert.rejects(writePlan(root,await plan(config)),/Refusing existing/);assert.deepEqual(await readdir(other),[]);
});
test('integrity check detects edited or missing protected Markdown',async()=>{
  const root=await temp();await writePlan(root,await plan(config));await lockDraft(root,'database');await writeFile(join(root,'.docs/database.md'),'changed after locking');
  await assert.rejects(checkDocuments(root),/Protected Markdown changed.*database.md/);
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
  for(const path of ['AGENTS.md','.docs/scope.md','.docs/frontend.md','.docs/testing.md']) {
    const content=files.get(path).toString();
    assert.doesNotMatch(content,/## Traceability|submodule_rows|\| Type \| Total|\| Test type \| Total|\| ID \/ SRS ID|\| Submodule \| IDs \| Service|\| Submodule \| SRS\/use-case IDs/);
  }
  await writeFile(join(root,'.docs/frontend.md'),'Changed by AI');
  await checkDocuments(root);
  await assert.rejects(lockDraft(root,'../AGENTS'),/Choose a draft/);
  await lockDraft(root,'frontend');
  await assert.rejects(lockDraft(root,'frontend'),/already locked/);
  await writeFile(join(root,'.docs/frontend.md'),'Changed after lock');
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
  const fixture = files.get('records_fe/src/services/records/hardcode-data.js').toString();
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
    runInNewContext(source, context);
    return context.module.exports;
  }
  assert.equal(load().configureWebpack.plugins.length, 0);
  assert.equal(load('off').configureWebpack.plugins.length, 0);
  assert.equal(load('off').publicPath, '/');
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
