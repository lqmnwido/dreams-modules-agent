import { mkdir, readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { resolve, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { UI_DEPENDENCY, DRAFT_DOCUMENTS } from './maintenance.mjs';
const templates = fileURLToPath(new URL('../templates/', import.meta.url));
const slug = /^[a-z][a-z0-9_]*$/;
const javaName = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
export function validate(c) {
  if (!slug.test(c.module) || c.module === 'shell') throw Error('Module must be a lowercase identifier, excluding shell.');
  if (!c.code || /[\r\n|]/.test(c.code)) throw Error('Module code is required and must be one line.');
  if (!javaName.test(c.group) || !javaName.test(c.package)) throw Error('Use lowercase dotted Java group/package names.');
  if (!/^3\.\d+\.\d+$/.test(c.boot)) throw Error('This scaffold supports Spring Boot 3.x; enter your approved exact version.');
  if (!/^(17|21|25)$/.test(c.java)) throw Error('Enter approved Java version: 17, 21 or 25; verify compatibility with your Boot version.');
  if (!Array.isArray(c.submodules) || c.submodules.some(s => !slug.test(s)) || new Set(c.submodules).size !== c.submodules.length) throw Error('Submodules must be unique lowercase identifiers.');
  if (c.submodules.some(s => ['training', 'ui_element', 'ui-element'].includes(s))) throw Error('training and ui-element are reserved references.');
  if (!Number.isInteger(c.port) || c.port < 1024 || c.port > 65535) throw Error('Frontend port must be 1024–65535.');
  return c;
}
export async function plan(config) {
  const c = validate(config);
  const files = new Map();
  const add = (p, text) => files.set(p, Buffer.from(text));
  const mdCell = s => String(s).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
  const answers = c.answers || [];
  const vars = {...c, env: c.module.toUpperCase(), application: c.module.split('_').map(part => part[0].toUpperCase() + part.slice(1)).join('') + 'Application', answer_rows: answers.map(a=>`| ${mdCell(a.question)} | ${mdCell(a.answer || 'TBD')} | TBD | Installer respondent | ${new Date().toISOString().slice(0,10)} | TBD |`).join('\n') || '| Use cases confirmed? | TBD | TBD | TBD | TBD | TBD |'};
  async function render(name) {
    return (await readFile(join(templates,name),'utf8')).replace(/\{\{(\w+)\}\}/g, (_,k)=>vars[k] ?? 'TBD');
  }
  add('AGENTS.md', await render('AGENTS.md'));
  add('.docs/scope.md', await render('docs/scope.md'));
  for (const doc of ['backend','database','frontend','architecture','testing','usermanual']) add(`.docs/${doc}.md`,await render(`docs/${doc}.md`));
  add('.docs/documents/.gitkeep','');
  add('.docs/documents/README.md','# Source documents\n\nPlace SRS, SDS and mockups here (PDF, DOCX, Markdown or images). Keep versioned filenames; register versions/pages/IDs in .docs/PRD.md. Humans maintain sources; AI reads only. Unknown or conflicting requirements need human review.\n');
  add('.docs/PRD.md',`# ${c.module} — maintenance record\n\nRead this first before any change. AI may update this file only after all requested work is finished and a human approves the proposed entry. Unlocked .docs/ drafts may be edited under AGENTS.md; completed, accepted drafts are locked. Sources stay read-only.\n\n- Module: ${c.module} (${c.code}).\n- Entered submodules: ${c.submodules.join(', ') || 'TBD; confirm with the user'}.\n- Source documents: .docs/documents/ (SRS, SDS, mockups); versions and approved requirements need review.\n- Current state: scaffold only; no completed business implementation or verified live behavior.\n\nAfter completed work, keep a brief record of implemented behavior, changed files, important decisions, actual test results/evidence, limitations and next maintenance steps. Do not invent approvals or repeat placeholder tables. Consult .docs/scope.md and task-relevant .docs/ files for the development rules.\n`);
  add('.gitignore','node_modules/\ndist/\ntarget/\n.env\n.env.local\n.env.*.local\n.maintenance-state.json\n');
  add('evidence/.gitkeep','');
  add('module.config.json',JSON.stringify(c,null,2)+'\n');
  add('scripts/maintenance.mjs',await readFile(new URL('./maintenance.mjs',import.meta.url),'utf8'));
  const fe = `${c.module}_fe`, be = `${c.module}_be`;
  add(`${fe}/AGENTS.md`,'# Instructions\n\nRead ../AGENTS.md and ../.docs/PRD.md. Read task-relevant ../.docs/ files. Human review is required before recommendations or changes. AI may edit unlocked ../.docs/ drafts within approved scope. Read all ../.docs/documents/ sources on the first drafting pass; after drafting use completed drafts and PRD, rereading sources only on explicit human request. Completed, accepted drafts are read-only; check ../document-integrity.json before editing. Sources and other Markdown are read-only. Update ../.docs/PRD.md only after completed work and approval of its entry. Follow root AGENTS.md for human review and locking. Work on one explicitly approved submodule at a time, stop for review before the next, follow exact selected ui-element/shared UI references, and run frontend ESLint/Prettier or approved Java lint/formatter checks as applicable. Inspect approved tooling and targets before formatting; never reformat unrelated or locked files.\n');
  add(`${be}/AGENTS.md`, files.get(`${fe}/AGENTS.md`));
  add(`${fe}/README.md`,`# ${c.module} frontend\n\nScaffold only; no approved business screens or Shell route registrations. Read ../AGENTS.md and ../.docs/frontend.md.\n\nFrom workspace root: \`node scripts/maintenance.mjs install\`. Then here: \`npm run serve\` or \`npm run build\`. ui-element/training are reference examples, not automatically exposed. No runtime/browser test has run.\n\nVUE_APP_REMOTE=off is the default in .env and .env.local. Use on only when serving through Shell; restart/rebuild after changing it. Off disables Module Federation; it does not itself create a standalone preview harness. Phase 2 supplies the selected submodule preview.\n`);
  add(`${be}/README.md`,`# ${c.module} backend\n\nScaffold only; no business APIs/tables/migrations. Read ../AGENTS.md and ../.docs/backend.md. PostgreSQL required. Set DB_URL (jdbc:postgresql://...), DB_USERNAME, DB_PASSWORD and KEYCLOAK_ISSUER_URI externally.\n\nJava ${c.java}; Spring Boot ${c.boot}; Maven. Run \`mvn verify\` / \`mvn spring-boot:run\`. No wrapper is included; install approved Maven. API list/roles/MinIO/file policy/deployment details TBD. Flyway enabled; human approval required before migration creation/execution or backend startup. Automatic DDL stays disabled. No compile/API/runtime success is claimed.\n\nSecurity defaults on (API_SECURITY_ENABLED=true); KEYCLOAK_ISSUER_URI configures the backend decoder. After startup/migration approval, local Postman No Auth: \`mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments="--dreams.security.enabled=false"\`. Only the local profile with loopback binding permits bypass; request/method authorization is disabled and no user identity is provided. Restart without the disabling flag to restore auth; unset any API_SECURITY_ENABLED=false environment override. Run \`mvn -Dtest=SecurityConfigTest test\` for filter/guard tests; stub tokens do not prove live SSO.\n`);
  const pkg = {name:`@2enapps/${c.module.replaceAll('_','-')}`,version:'0.1.0',private:true,scripts:{serve:'vue-cli-service serve --mode local',build:'vue-cli-service build'},dependencies:{'@2enapps/ui':UI_DEPENDENCY,vue:'^3.3.4',pinia:'^2.3.1','vue-i18n':'^9.5.0','vue-router':'^4.6.4'},devDependencies:{'@vue/cli-plugin-babel':'~5.0.8','@vue/cli-service':'~5.0.8','@vue/compiler-sfc':'^3.3.4',webpack:'^5.0.0'}};
  add(`${fe}/package.json`,JSON.stringify(pkg,null,2)+'\n');
  add(`${fe}/babel.config.js`,'module.exports = { presets: ["@vue/cli-plugin-babel/preset"] };\n');
  add(`${fe}/src/remote-entry.js`,'export {};\n');
  add(`${fe}/src/metadata.js`,`export const MODULE_METADATA = Object.freeze(${JSON.stringify({remoteName:c.module,displayName:c.module,version:'0.1.0',apiVersion:1,routePrefix:`/${c.module}`}, null, 2)});\n`);
  const exposes = { './metadata': './src/metadata.js', ...Object.fromEntries(c.submodules.map(s => [`./views/${s}/interface`, `./src/views/${s}/interface.vue`])) };
  add(`${fe}/exposes.js`, 'module.exports = ' + JSON.stringify(exposes, null, 2) + ';\n');
  add(`${fe}/public/index.html`,'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>D-ReAMS</title></head><body><div id="app"></div></body></html>\n');
  const envText =`# off: standalone development; on: remote served through Shell.\nVUE_APP_REMOTE=off\nVUE_APP_MODUL=http://localhost:${c.port}\nVUE_APP_MODUL_PORT=${c.port}\nVUE_APP_SHELL=http://localhost:3000\n# Module bucket name; storage provisioning/access must be verified separately.\nVUE_APP_BUCKET_${vars.env}=${c.module}\nUPLOAD_BUCKET_${vars.env}=\n`;
  add(`${fe}/.env`, `# Enable only when serving the module through Shell.\nVUE_APP_REMOTE=off\nVUE_APP_BUCKET_${vars.env}=${c.module}\n`);
  add(`${fe}/.env.example`, envText);
  add(`${fe}/.env.local`, envText);
  add(`${fe}/vue.config.js`, await render('frontend-vue.config.js'));
  async function copyTree(from,to) {
    for (const entry of await readdir(from,{withFileTypes:true})) {
      if (entry.isDirectory()) await copyTree(join(from,entry.name),`${to}/${entry.name}`);
      else if (entry.isFile()) files.set(`${to}/${entry.name}`,await readFile(join(from,entry.name)));
      else throw Error('Template symlinks are not supported.');
    }
  }
  await copyTree(join(templates,'reference/ui-element'),`${fe}/src/views/ui-element`);
  await copyTree(join(templates,'reference/services'),`${fe}/src/services/training`);
  add(`${fe}/src/views/ui-element/README.md`,'# Training reference\n\nCopied from D-ReAMS training. Read only for revision/reference. Contains mock data, legacy raw controls/styles and training-specific integration assumptions. Not approved business code. Default expose map excludes these examples. Review dependencies, UI standard and Shell context before using any example.\n');
  add(`${fe}/src/services/${c.module}/https.js`, await readFile(join(templates, 'frontend-https.js'), 'utf8'));
  add(`${fe}/src/services/${c.module}/hardcode-data.js`, await readFile(join(templates, 'frontend-hardcode-data.js'), 'utf8'));
  add(`${fe}/src/services/${c.module}/upload.js`, await render('frontend-upload.js'));
  add(`${fe}/CRUD-REFERENCE.md`, await readFile(join(templates, 'CRUD-REFERENCE.md'), 'utf8'));
  const javaPath = `${be}/src/main/java/${c.package.replaceAll('.','/')}`;
  for (const folder of ['config','common','entity','repository','security']) add(`${javaPath}/${folder}/.gitkeep`,'');
  for (const s of c.submodules) {
    for (const folder of ['controller','service','form']) add(`${javaPath}/${folder}/${s}/.gitkeep`,'');
    add(`${fe}/src/services/${c.module}/${s}.service.js`, '// WHAT: business functions, confirmed endpoints/payloads and approved fallback selection.\n// HOW: ./https owns fetch, URL/auth, parsing, audit transport and transport errors.\n// No direct fetch or duplicate transport plumbing in this service.\n// import { createModuleClient, returnResponseList, returnResponseDetails } from "./https";\n// Phase 2 uses ./hardcode-data; real API calls remain commented until integration.\nexport {};\n');
    add(`${fe}/src/views/${s}/interface.vue`, `<template>\n  <PageHeader title="${s}" pageTitle="${s}" />\n</template>\n\n<script>\nimport { PageHeader } from '@2enapps/ui';\n\n// Page scaffold only; fields/actions/roles require confirmed use cases.\nexport default {\n  components: {\n    PageHeader\n  }\n};\n</script>\n`);
  }
  add(`${be}/src/test/java/${c.package.replaceAll('.','/')}/.gitkeep`,'');
  add(`${be}/src/main/resources/db/migration/.gitkeep`,'');
  const application = vars.application;
  add(`${javaPath}/${application}.java`,`package ${c.package};\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class ${application} {\n    public static void main(String[] args) {\n        SpringApplication.run(${application}.class, args);\n    }\n}\n`);
  for (const name of ['SecurityConfig', 'MethodSecurityConfig']) {
    add(`${javaPath}/security/${name}.java`, await render(`backend/${name}.java`));
  }
  add(`${be}/src/test/java/${c.package.replaceAll('.', '/')}/security/SecurityConfigTest.java`, await render('backend/SecurityConfigTest.java'));

  const deps = ['spring-boot-starter-web','spring-boot-starter-validation','spring-boot-starter-data-jpa','spring-boot-starter-security','spring-boot-starter-oauth2-resource-server'].map(a=>`    <dependency><groupId>org.springframework.boot</groupId><artifactId>${a}</artifactId></dependency>`).join('\n');
  add(`${be}/pom.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">\n  <modelVersion>4.0.0</modelVersion>\n  <parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>${c.boot}</version><relativePath/></parent>\n  <groupId>${c.group}</groupId><artifactId>${be}</artifactId><version>0.0.1-SNAPSHOT</version>\n  <properties><java.version>${c.java}</java.version></properties>\n  <dependencies>\n${deps}\n    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>\n    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>\n    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>\n    <dependency><groupId>org.springframework.security</groupId><artifactId>spring-security-test</artifactId><scope>test</scope></dependency>\n  </dependencies>\n  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>\n</project>\n`);
  add(`${be}/src/main/resources/application.properties`,`spring.application.name=${c.module}-api\nserver.port=\${SERVER_PORT:8082}\nspring.datasource.url=\${DB_URL}\nspring.datasource.username=\${DB_USERNAME}\nspring.datasource.password=\${DB_PASSWORD}\nspring.datasource.driver-class-name=org.postgresql.Driver\nspring.jpa.hibernate.ddl-auto=none\nspring.sql.init.mode=never\nspring.flyway.enabled=true\ndreams.security.enabled=\${API_SECURITY_ENABLED:true}\ndreams.security.issuer-uri=\${KEYCLOAK_ISSUER_URI:}\n`);
  add(`${be}/src/main/resources/application-local.properties`, '# Local profile alone does not disable authentication.\nserver.address=127.0.0.1\n');
  const hashes = Object.fromEntries([...files].filter(([p])=>p.endsWith('.md') && p !== '.docs/PRD.md' && !DRAFT_DOCUMENTS.includes(p)).map(([p,b])=>[p,createHash('sha256').update(b).digest('hex')]));
  add('document-integrity.json',JSON.stringify(hashes,null,2)+'\n');
  return files;
}
export async function writePlan(root, files) {
  root = resolve(root);
  // Preflight all paths before any mutation; refuse overwrite or symlink parents.
  for (const p of files.keys()) {
    const dest = resolve(root,p);
    if (!dest.startsWith(root + sep)) throw Error(`Unsafe path: ${p}`);
    let cursor = dest;
    while (true) {
      try {
        const stat = await lstat(cursor);
        if (cursor === dest || stat.isSymbolicLink() || !stat.isDirectory()) throw Error(`Refusing existing file/symlink: ${cursor}`);
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      const parent = dirname(cursor); if (parent === cursor) break; cursor = parent;
    }
  }
  for (const [p,bytes] of files) { const dest = join(root,p); await mkdir(dirname(dest),{recursive:true}); await writeFile(dest,bytes,{flag:'wx'}); }
}
