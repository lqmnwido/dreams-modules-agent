import { readFile, writeFile, lstat, readdir, rename, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
export const UI_DEPENDENCY = 'git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop';
export const SHELL_URL = 'https://kai.2enapps.my/d-reams/frontend/shell.git';
export const DRAFT_DOCUMENTS = ['scope','architecture','database','backend','frontend','testing','usermanual'].map(name => `.docs/${name.toUpperCase()}.md`);
export const PHASE1_DRAFTS = ['scope', 'architecture', 'database', 'backend', 'frontend'];

async function resolveDraft(root, name) {
  const normalized = String(name).toLowerCase();

  if (!DRAFT_DOCUMENTS.includes(`.docs/${normalized.toUpperCase()}.md`)) {
    throw Error('Choose a draft: scope, architecture, database, backend, frontend, testing or usermanual.');
  }

  const matches = (await readdir(join(root, '.docs')))
    .filter((entry) => entry.toLowerCase() === `${normalized}.md`);

  if (matches.length !== 1) {
    throw Error(matches.length
      ? `Ambiguous draft ${name}: ${matches.join(', ')}. A human must resolve duplicate filenames.`
      : `Missing draft ${name}: expected .docs/${normalized}.md or its uppercase equivalent.`);
  }

  const path = `.docs/${matches[0]}`;
  const info = await lstat(join(root, path));

  if (!info.isFile() || info.isSymbolicLink()) {
    throw Error(`Refusing symlink or non-file document: ${path}`);
  }

  return path;
}

// Human-run finalization only; validate every requested document before writing.
async function lockDrafts(root, names, { uppercase = false } = {}) {
  const manifest = join(root, 'document-integrity.json');

  for (const path of [manifest, join(root, '.docs')]) {
    if ((await lstat(path)).isSymbolicLink()) {
      throw Error('Refusing symlink document directory or manifest.');
    }
  }

  await checkDocuments(root);
  const hashes = JSON.parse(await readFile(manifest, 'utf8'));
  const additions = {};
  const documents = [];

  for (const name of names) {
    const path = await resolveDraft(root, name);
    const alreadyLocked = Object.keys(hashes)
      .some((key) => key.toLowerCase() === path.toLowerCase());

    if (alreadyLocked) {
      throw Error(`${path} is already locked; a human must explicitly reopen it for revision.`);
    }

    const target = uppercase ? `.docs/${name.toUpperCase()}.md` : path;
    documents.push({ path, target });
    additions[target] = createHash('sha256')
      .update(await readFile(join(root, path)))
      .digest('hex');
  }

  const staging = await mkdtemp(join(root, '.document-lock-'));
  const moves = [];

  try {
    for (const { path, target } of documents) {
      if (path === target) {
        continue;
      }

      // A temporary hop also supports case-only renames on insensitive filesystems.
      const staged = join(staging, target.split('/').pop());
      await rename(join(root, path), staged);
      const move = { original: join(root, path), current: staged };
      moves.push(move);
      await rename(staged, join(root, target));
      move.current = join(root, target);
    }

    const stagedManifest = join(staging, 'document-integrity.json');
    await writeFile(stagedManifest, JSON.stringify({ ...hashes, ...additions }, null, 2) + '\n');
    await rename(stagedManifest, manifest);
  } catch (error) {
    const failures = [];

    for (const move of moves.reverse()) {
      try {
        await rename(move.current, move.original);
      } catch (rollbackError) {
        failures.push(`${move.original}: ${rollbackError.message}`);
      }
    }

    if (failures.length) {
      throw Error(`${error.message}. Rename recovery needs human attention; preserve ${staging}. ${failures.join('; ')}`);
    }

    await rm(staging, { recursive: true, force: true });
    throw error;
  }

  try {
    await rm(staging, { recursive: true, force: true });
  } catch (error) {
    console.warn(`Documents are locked; temporary directory cleanup failed: ${staging}: ${error.message}`);
  }

  for (const path of Object.keys(additions)) {
    console.log(`${path} locked. AI must read only; locking does not authorize database execution or deployment.`);
  }
}

export async function lockDraft(root, name) {
  await lockDrafts(root, [name]);
}

export async function lockDocuments(root) {
  await lockDrafts(root, PHASE1_DRAFTS, { uppercase: true });
}
// Human-run reopening only; preserve document contents and unrelated locks.
async function unlockDrafts(root, names) {
  const manifest = join(root, 'document-integrity.json');

  for (const path of [manifest, join(root, '.docs')]) {
    if ((await lstat(path)).isSymbolicLink()) {
      throw Error('Refusing symlink document directory or manifest.');
    }
  }

  const hashes = JSON.parse(await readFile(manifest, 'utf8'));
  const removed = [];

  for (const name of names) {
    const path = await resolveDraft(root, name);
    const keys = Object.keys(hashes)
      .filter((key) => key.toLowerCase() === path.toLowerCase());

    if (keys.length > 1) {
      throw Error(`Ambiguous integrity entries for ${path}. A human must review the manifest.`);
    }

    removed.push(...keys);
  }

  // Selected drafts may already have edits; never hide changes in other locks.
  await verifyDocumentHashes(root, hashes, removed);

  if (!removed.length) {
    console.log('Selected documents are already unlocked.');
    return;
  }

  const updated = { ...hashes };
  for (const path of removed) {
    delete updated[path];
  }

  const staging = await mkdtemp(join(root, '.document-unlock-'));

  try {
    const stagedManifest = join(staging, 'document-integrity.json');
    await writeFile(stagedManifest, JSON.stringify(updated, null, 2) + '\n');
    await rename(stagedManifest, manifest);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }

  for (const path of removed) {
    console.log(`${path} unlocked for revision; content and filename preserved.`);
  }
}

export async function unlockDraft(root, name) {
  await unlockDrafts(root, [name]);
}

export async function unlockDocuments(root) {
  await unlockDrafts(root, PHASE1_DRAFTS);
}

export async function exists(path) { try { await lstat(path); return true; } catch(e) { if(e.code === 'ENOENT') return false; throw e; } }
export async function enforceUi(project) {
  const path = join(project,'package.json');
  const pkg = JSON.parse(await readFile(path,'utf8'));
  pkg.dependencies ||= {};
  pkg.dependencies['@2enapps/ui'] = UI_DEPENDENCY;
  if (pkg.devDependencies) delete pkg.devDependencies['@2enapps/ui'];
  if (pkg.optionalDependencies) delete pkg.optionalDependencies['@2enapps/ui'];
  await writeFile(path, JSON.stringify(pkg,null,2)+'\n');
}
export function run(command,args,cwd,capture=false) {
  return new Promise((accept,reject)=>{
    // On Windows, invoke npm's JS CLI through Node instead of shell-interpolating arguments.
    let executable=command, argv=args;
    if(process.platform === 'win32' && command === 'npm') {
      executable=process.execPath;
      argv=[join(dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),...args];
    }
    const child=spawn(executable,argv,{cwd,stdio:capture?['ignore','pipe','inherit']:'inherit',shell:false});
    let output=''; if(capture) child.stdout.on('data',b=>output+=b);
    child.on('error',reject); child.on('close',code=>code===0?accept(output.trim()):reject(Error(`${command} ${args.join(' ')} failed (${code})`)));
  });
}
export async function checkDocuments(root) {
  const hashes = JSON.parse(await readFile(join(root, 'document-integrity.json'), 'utf8'));
  await verifyDocumentHashes(root, hashes);
}

async function verifyDocumentHashes(root, hashes, ignored = []) {
  const changed=[];
  for(const [p,hash] of Object.entries(hashes)) {
    if (ignored.includes(p) || p === '.docs/PRD.md' || p === 'PRD.md') continue; // The sole AI-editable maintenance record, including older baselines.
    try { if(createHash('sha256').update(await readFile(join(root,p))).digest('hex')!==hash) changed.push(p); }
    catch(e) { if(e.code==='ENOENT') changed.push(p); else throw e; }
  }
  if(changed.length) throw Error(`Protected Markdown changed or missing: ${changed.join(', ')}. A human must review changes and update the integrity baseline; AI must not edit it.`);
}
export async function maintain(root, {install=false, runner=run, today=new Date().toLocaleDateString('en-CA')}={}) {
  const config=JSON.parse(await readFile(join(root,'module.config.json'),'utf8'));
  if(!/^[a-z][a-z0-9_]*$/.test(config.module) || config.module==='shell') throw Error('Invalid module configuration.');
  await checkDocuments(root);
  const shell=join(root,'shell'); const stateFile=join(root,'.maintenance-state.json');
  let state={}; try { state=JSON.parse(await readFile(stateFile,'utf8')); } catch(e) { if(e.code!=='ENOENT') throw e; }
  const fresh=!(await exists(shell));
  if(fresh) await runner('git',['clone','--branch','develop','--single-branch',SHELL_URL,shell],root);
  if ((await lstat(shell)).isSymbolicLink()) throw Error('Refusing symlink Shell directory.');
  if (!(await exists(join(shell,'.git')))) throw Error('Existing shell is not a Git checkout.');
  const origin=await runner('git',['remote','get-url','origin'],shell,true);
  if(origin.replace(/\.git$/,'').replace(/\/$/,'')!==SHELL_URL.replace(/\.git$/,'')) throw Error(`Shell origin does not match ${SHELL_URL}`);
  if(fresh || state.shellCheckedOn!==today) {
    await runner('git',['fetch','origin','develop'],shell);
    const branch=await runner('git',['branch','--show-current'],shell,true);
    const status=await runner('git',['status','--porcelain'],shell,true);
    const head=await runner('git',['rev-parse','HEAD'],shell,true);
    const remote=await runner('git',['rev-parse','origin/develop'],shell,true);
    if(branch!=='develop' || head!==remote) {
      if(status) throw Error('Shell has local changes; review them before switching branch or pulling. No changes were discarded.');
      if(branch!=='develop') await runner('git',['switch','develop'],shell);
      await runner('git',['pull','--ff-only','origin','develop'],shell);
    }
    state={shellCheckedOn:today,branch:'develop',commit:await runner('git',['rev-parse','HEAD'],shell,true),workingTree:await runner('git',['status','--porcelain'],shell,true)||'clean'};
    await writeFile(stateFile,JSON.stringify(state,null,2)+'\n');
  }
  if(await runner('git',['branch','--show-current'],shell,true)!=='develop') throw Error('Shell must be on develop.');
  for(const project of [shell,join(root,`${config.module}_fe`)]) {
    if((await lstat(project)).isSymbolicLink()) throw Error(`Refusing symlink project: ${project}`);
    if((await lstat(join(project,'package.json'))).isSymbolicLink()) throw Error('Refusing symlink package.json.');
    await enforceUi(project);
    await runner('npm',[install ? 'install' : 'update','--legacy-peer-deps'],project);
  }
  await checkDocuments(root);
  console.log('Shell check and dependency maintenance complete; run builds and live tests separately.');
}
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const command = process.argv[2];
  const name = process.argv[3];
  const selectionCommand = command === 'lock' || command === 'unlock';
  const invalidCommand = command && !['install', 'check-docs', 'lock', 'unlock'].includes(command);
  const invalidArguments = selectionCommand ? process.argv.length > 4 : process.argv.length > 3;

  if (invalidCommand || invalidArguments) {
    console.error('Usage: node scripts/maintenance.mjs [install|check-docs|lock [name]|unlock [name]]');
    process.exitCode = 1;
  } else {
    try {
      if (command === 'lock') {
        if (name) {
          await lockDraft(root, name);
        } else {
          await lockDocuments(root);
        }
      } else if (command === 'unlock') {
        if (name) {
          await unlockDraft(root, name);
        } else {
          await unlockDocuments(root);
        }
      } else if (command === 'check-docs') {
        await checkDocuments(root);
        console.log('Protected Markdown unchanged.');
      } else {
        await maintain(root, { install: command === 'install' });
      }
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
