#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { resolve, join } from 'node:path';
import { plan, writePlan } from '../lib/scaffold.mjs';
import { maintain } from '../lib/maintenance.mjs';
if(process.argv.includes('--help')) {
  console.log('D-ReAMS interactive installer\nUsage: node bin/install.mjs\nRequires Node >=22.12, Git, npm; backend uses approved Java/Maven.\nAsks all questions and confirms before writing. Never overwrites existing files.');
  process.exit(0);
}
if(process.argv.length>2) {console.error('Unknown argument. Use --help or run interactively.');process.exit(1);}
if(!stdin.isTTY) {console.error('Run in an interactive terminal; no files were written.');process.exit(1);}
const rl=createInterface({input:stdin,output:stdout});
async function ask(label,fallback) { const value=(await rl.question(`${label}${fallback!==undefined?` [${fallback}]`:''}: `)).trim(); return value || fallback || ''; }
async function required(label,pattern,fallback) {while(true) {const value=await ask(label,fallback);if(pattern.test(value))return value;console.log('A valid value is required.');}}
const categories=[
  ['Purpose','Problem/outcome, actors, trigger, preconditions, completion criteria'],
  ['Flow','Main/alternative/cancel/recovery flows, statuses/transitions, permissions, duplicates'],
  ['Data','Required/optional fields, formats/limits/defaults, uniqueness/relations/lookups/dates, sensitivity/retention'],
  ['Outputs','Imports/exports/files/QR/certificates/reports'],
  ['Integrations','Systems, notification recipients/events/channels/templates, failure/timeout behavior'],
  ['Acceptance','Positive/negative/edge cases and exact user results/messages']
];
try {
  console.log('D-ReAMS module setup. PostgreSQL is mandatory. Blank use-case answers remain TBD.\nSources: place SRS/SDS/mockups in .docs/documents/ after setup. No source-derived business code or migrations are generated.');
  const module=await required('Module name (lowercase; example memorial)',/^[a-z][a-z0-9_]*$/);
  const code=await required('Module code',/^[^|\r\n]+$/);
  const root=resolve(await ask('Target workspace (contains Shell, frontend and backend)',join(process.cwd(),`${module}-workspace`)));
  const group=await required('Approved Java group (example com.dreams)',/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/);
  const pkg=await required('Approved Java package (example com.dreams.memorial)',/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/);
  const java=await required('Approved Java version (17, 21 or 25; Enter = LTS default)',/^(17|21|25)$/, '25');
  console.log('Boot 3.5 is the long-term enterprise support line (commercial support). Default 3.5.16 supports Java 25; this does not imply free LTS coverage.');
  const boot=await required('Approved exact Spring Boot 3.x version (Enter = reviewed 3.5-line default)',/^3\.\d+\.\d+$/, '3.5.16');
  const port=Number(await ask('Frontend local port','3004'));
  const submodules=(await ask('Confirmed submodule identifiers (comma-separated; blank = TBD)')).split(',').map(s=>s.trim()).filter(Boolean);
  const answers=[];
  for(const submodule of submodules) {
    console.log(`\nUse cases for ${submodule}; cite source IDs in your answers. Answers still require human scope review.`);
    for(const [key,question] of categories) answers.push({question:`${submodule}: ${key}`,answer:await ask(question,'TBD')});
  }
  const config={module,code,group,package:pkg,java,boot,port,submodules,answers};
  const files=await plan(config);
  console.log(`\nPlan: ${root}\n${module}_fe + ${module}_be; ${files.size} files including concise Markdown, AGENTS.md, .docs/PRD.md, .docs/documents and ui-element references.\nMaven dependencies: Web, Validation, JPA, Security, OAuth2 Resource Server, PostgreSQL, Flyway (enabled; migration creation/execution requires human approval), Test.\nFrontend: Vue CLI 5, Vue 3, Pinia, router, i18n, and @2enapps/ui Git develop.\nNo secrets, tables, migrations or business endpoints. Existing files are never overwritten.`);
  const online=(await ask('Clone/check Shell and npm install after scaffolding? (yes/no)','yes')).toLowerCase()==='yes';
  if((await ask('Confirm these scaffold/dependency selections and create files? (yes/no)','yes')).toLowerCase()!=='yes') {console.log('Cancelled; no files written.');}
  else {
    await writePlan(root,files);
    console.log(`Created ${root}. Place sources in .docs/documents/ and review .docs/PRD.md; agents can prepare source-based .docs/ drafts after approval, then humans review and lock them. Scope/schema approval is still pending.`);
    console.log('Skills installer bundled in the workspace. From that directory run node skills.js --opencode (or your harness flag); use --project . for workspace-only installation.');
    if(online) await maintain(root,{install:true});
    else console.log('Network setup deferred. Run node scripts/maintenance.mjs install from the workspace before development.');
  }
} catch(error) {console.error(error.message);process.exitCode=1;} finally {rl.close();}
