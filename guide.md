# D-ReAMS — panduan Agile mengikut tiga fasa

Aliran baharu: **Fasa 1 dokumen → pengguna lock → Fasa 2 semua prototaip frontend, satu submodul pada satu masa → Fasa 3 backend dan integrasi, satu submodul pada satu masa.**

Gunakan [prompts-ms.md](prompts-ms.md) atau [prompts.md](prompts.md). Setiap nombor prompt sama dalam kedua-dua bahasa. Seni bina bersama berada dalam [ARCHITECTURE.md](ARCHITECTURE.md). Contoh dokumen ringkas tersedia dalam `docs/workflow/` di repository installer; ia bukan dokumen modul yang sudah disemak.

## Guna skills supaya tidak perlu tampal prompt setiap fasa

Dari checkout installer, pilih harness anda:

```bash
cd /home/lqmnwido/Projects/dreams/dreams-modules-agent
node skills.js --codex
# Pilihan lain (tidak perlu jalankan semua):
# node skills.js --claude
# node skills.js --opencode
# node skills.js --cursor
# node skills.js --gemini
# node skills.js --copilot
# node skills.js --windsurf
```

Kemudian buka sesi agent dalam workspace modul dan guna:

| Fasa | Codex | Claude Code / OpenCode / Cursor / Cline |
| --- | --- | --- |
| Dokumentasi dan minta lock | `$d-documents` | `/d-documents` |
| Satu prototaip frontend | `$d-frontend nama-submodul` | `/d-frontend nama-submodul` |
| Satu backend dan integrasi | `$d-backend nama-submodul` | `/d-backend nama-submodul` |

Skill memuat arahan fasa dan references sendiri; prompt panjang di bawah kekal alternatif manual. Pengguna masih menjawab soalan sebenar, mengunci dokumen, menerima interface dan membenarkan execution target database. Skill tidak memasang Playwright MCP/JDK atau menjadikan tool browser tersedia secara automatik.

`--dry-run` memaparkan lokasi tanpa menulis; `--project /path/workspace` memasang dalam projek; `--list-harnesses` menyenaraikan 79 harness serta portable target; `--harness nama` memilih adapter; `--all --dry-run` melihat semua sasaran registry bertarikh sebelum memasang; `--dest /path/skills` untuk harness lain yang menyokong Agent Skills. Lihat `docs/SKILLS.md` dalam repository installer untuk paths, kemas kini `--force` dan had keserasian. Restart sesi jika skill belum muncul. Pemasangan tidak mengubah scaffold, AGENTS projek atau locks.

Senarai penuh berada dalam `docs/HARNESS-SUPPORT.md` repository installer: Cursor, Gemini, Copilot, Windsurf, Cline, Roo, Kilo, Continue, Augment, Amp, Goose, Kiro, Qwen, OpenHands, Zed dan lain-lain. Evidence vendor-docs berbeza daripada registry-only; pemasangan fail bukan bukti semua harness berjalan. Windsurf menggunakan @skill; harness lain mungkin melalui skill selector/natural request, bukan /command. `--all` global melaporkan skip bagi target project-only; guna --project untuk target tersebut. Konfigurasi feature/trust/cloud worker tidak diubah automatik.

## Peraturan terus

- Setiap modul ada database PostgreSQL sendiri; modul lain melalui API pemilik sahaja. MFE remote frontend dan business API ialah dua mekanisme berbeza.
- Shell mengurus menu/navbar/layout/login/SSO/token refresh. UI daripada `@2enapps/ui` Kai; modul tidak mencipta Shell kedua.
- **Tiada human review database berasingan atau jadual APPROVED diperlukan.** Kesempurnaan schema tetap wajib; lock Fasa 1 ialah baseline reka bentuk. Execution database memerlukan sasaran/commands jelas dan kebenaran pelaksanaan, bukan upacara review schema berulang.
- Pengguna mengunci dokumen; agent tidak mengubah manifest atau lock/unlock sendiri.
- Jangan sentuh kod installer/scaffolder atau fail scaffold sedia ada. Jika ciri standalone/metadata/tooling memerlukannya, tunjuk fail/diff tepat dan tanya dahulu.
- Jika tidak faham atau tidak pasti, tanya satu soalan khusus sebelum kerja bergantung padanya. Simpan ID/jawapan; jangan tanya soalan sama, cipta peraturan atau ulang kegagalan tanpa bukti baharu.
- Fixtures dibenarkan **untuk prototaip Fasa 2 sahaja**. Backend/production tidak boleh menggunakan kejayaan dummy atau fallback fixture selepas API gagal.

## 0. Cipta workspace sekali sahaja

Semak alat:

```bash
node --version
npm --version
git --version
java --version
mvn --version
```

Node sekurang-kurangnya 22.12; backend menggunakan Java 25 dan Spring Boot. Semak versi Spring Boot projek sebenar dan JDK yang menyokongnya; jangan tukar target secara senyap.

Jika installer belum ada:

```bash
mkdir -p /home/lqmnwido/Projects/dreams
cd /home/lqmnwido/Projects/dreams
git clone https://github.com/lqmnwido/dreams-modules-agent.git
cd dreams-modules-agent
node bin/install.mjs
```

Jika sudah ada, semak perubahan/branch/remote dahulu:

```bash
cd /home/lqmnwido/Projects/dreams/dreams-modules-agent
git status --short
git branch --show-current
git remote -v
```

Hanya untuk working tree bersih, branch main dan remote betul:

```bash
git fetch origin
git pull --ff-only origin main
node bin/install.mjs
```

Alternatif hosted: laman yang direkodkan dalam repository ialah https://dreams-agents.kohich.site/. Muat turun dan baca skrip sebelum menjalankannya; ketersediaan laman bukan dibuktikan oleh panduan ini.

```bash
curl -fL 'https://dreams-agents.kohich.site/install.sh' -o dreams-agent-install.sh
cat dreams-agent-install.sh
```

Selepas semakan skrip, jalankan `bash dreams-agent-install.sh`. Untuk PowerShell, muat turun `install.ps1` dari laman sama menggunakan Invoke-WebRequest, baca dengan Get-Content, kemudian jalankan mengikut polisi organisasi; jangan memintas polisi.

Isi identiti/package/path modul sebenar, Java 25 dan versi Boot diluluskan. Pilih workspace kekal. Installer tidak perlukan npm install untuk dirinya sendiri; jangan jalankan semula untuk menimpa workspace lama.

Jika dependencies workspace belum dipasang:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace
node scripts/maintenance.mjs install
node scripts/maintenance.mjs check-docs
```

Ganti path contoh dengan workspace sebenar. `install` ialah initial npm install; `node scripts/maintenance.mjs` ialah maintenance Shell/npm update kemudian, bukan langkah initial tambahan wajib. Jangan buat dependency update tanpa skop dibenarkan.

## Keserasian huruf besar tanpa mengubah scaffold

Struktur sasaran menggunakan `.docs/SCOPE.md`, `ARCHITECTURE.md`, `DATABASE.md`, `BACKEND.md`, `FRONTEND.md`, `TESTING.md`, `USERMANUAL.md`, dengan `.docs/PRD.md` sebagai rekod umum.

**Installer/maintenance sedia ada belum diubah:** ia menghasilkan draf lowercase dan `lock-doc` hanya menerima lowercase. Pada Linux, fail tersebut berbeza. Jangan jalankan `lock-doc scope` lalu mendakwa `SCOPE.md` sudah dikunci.

Mulakan Prompt 1 untuk menyemak nama sebenar. Bagi workspace baharu, pengguna mesti menetapkan nama kanonik uppercase dan kebenaran penciptaan/penamaan sebelum Fasa 1. Bagi workspace lama dengan hash/design terkunci, jangan auto-rename, padam rekod lama atau simpan dua sumber kebenaran; minta keputusan pemindahan khusus. Panduan ini tidak mengubah mana-mana workspace lama atau kelulusan terdahulu.

## Fasa 1 — baca sumber, hasilkan dokumen, sahkan dan lock

Letakkan sumber sebenar dalam `.docs/documents/`. Jangan andaikan SRS wujud. Dated ZIP/mockup hanya rujukan sejarah jika pengguna menetapkannya begitu.

| Dokumen | Kandungan utama |
| --- | --- |
| PRD.md | Maklumat umum sistem, status fasa/submodul, keputusan penting, versi dan pautan evidence |
| SCOPE.md | Semua keperluan sumber yang relevan: submodul, fungsi, aktor, workflow, peraturan, keputusan dan citations; router ke spesifikasi khusus |
| ARCHITECTURE.md | Struktur bersama dan sempadan ownership/database/API/MFE/Shell/UI |
| DATABASE.md | Jadual/kolum/types/null/default/keys/constraints/indexes/audit/deletion sebenar modul |
| BACKEND.md | Controller/service/entity/repository/form, logic, request/response, permissions/errors/transaksi |
| FRONTEND.md | Idea mockup, skrin/fields/actions, rujukan UI tepat, senario dummy dan API dirancang |
| TESTING.md | Pelan kemudian serta bukti ujian sebenar, dipisahkan mengikut fasa/submodul |
| USERMANUAL.md | Arahan berdasarkan fungsi disahkan; dilengkapkan kemudian |

Jangan salin semua sumber verbatim atau semua butiran ke setiap fail. Ayat ringkas, tetapi payload, storage dan permissions wajib tetap konkrit. Pautkan SCOPE.md kepada seksyen khusus; jangan jadikan SCOPE.md salinan DATABASE/BACKEND/FRONTEND.

**Prompt 1–4:** kenal pasti modul/path/sumber, baca sumber, hasilkan dokumen dan selesaikan soalan benar-benar belum dijawab dalam kumpulan maksimum lima.

**Prompt 5:** lengkapkan ringkasan PRD, kemudian baca semula sumber berkaitan sekali untuk pengesahan. Rekod fail/seksyen diperiksa, betulkan kekurangan dan ringkaskan hasil sebenar. Selepas selesai, agent berhenti dan meminta pengguna lock lima reka bentuk. Jangan mulakan frontend dahulu.

### Skrip penguncian uppercase — pengguna sahaja

Gunakan hanya selepas Fasa 1 disahkan lengkap, path kanonik uppercase dipersetujui, tiada dokumen bersaing dan pengguna menerima dokumen. Skrip ini merekod hash sahaja, tidak menukar kandungan, mencipta migrasi atau memberi kebenaran database execution. Ia bukan perubahan kepada skrip scaffold.

Semak dahulu:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace
node scripts/maintenance.mjs check-docs
```

Jika berjaya, pengguna menjalankan:

```bash
node --input-type=module <<'NODE'
import { readFile, writeFile, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { checkDocuments } from './scripts/maintenance.mjs';

await checkDocuments(process.cwd());
const manifestPath = 'document-integrity.json';
if ((await lstat(manifestPath)).isSymbolicLink() || (await lstat('.docs')).isSymbolicLink()) {
  throw new Error('Manifest/.docs symlink: berhenti untuk semakan.');
}
const hashes = JSON.parse(await readFile(manifestPath, 'utf8'));
const documents = [
  '.docs/SCOPE.md', '.docs/ARCHITECTURE.md', '.docs/DATABASE.md',
  '.docs/BACKEND.md', '.docs/FRONTEND.md'
];
const additions = {};
for (const path of documents) {
  const legacy = path.replace(/([^/]+)\.md$/, name => name.toLowerCase());
  try {
    await lstat(legacy);
    throw new Error(`Fail lowercase ${legacy} masih wujud; selesaikan pemindahan dahulu.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (Object.hasOwn(hashes, path) || Object.hasOwn(hashes, legacy)) {
    throw new Error(`${path} atau path lama masih dikunci; jangan timpa baseline.`);
  }
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error(`${path}: bukan fail biasa.`);
  additions[path] = createHash('sha256').update(await readFile(path)).digest('hex');
}
await writeFile(manifestPath, JSON.stringify({ ...hashes, ...additions }, null, 2) + '\n');
for (const path of documents) console.log(`${path}: locked`);
NODE

node scripts/maintenance.mjs check-docs
```

Tiada automasi membuka lock dalam panduan ini. Perubahan selepas lock memerlukan pengguna membuka dokumen terjejas sahaja dan mengarahkan revision secara jelas. Agent tidak boleh mengubah manifest.

## Fasa 2 — frontend dahulu, satu submodul pada satu masa

Selepas pengguna lock dan bersedia meneruskan, gunakan **Prompt 6** untuk verify hashes, baca SCOPE/FRONTEND dan pilih satu submodul. **Prompt 7** membina prototaip; **Prompt 8** menguji dan menunjukkannya; **Prompt 9** merekod penerimaan interface dan mencadangkan submodul seterusnya. Ulang 6–9 sehingga semua interface diterima. Jangan mulakan backend sepanjang pusingan ini.

### UI dan service mesti mengikut contoh tepat

Rujuk `general-tab-crud/list-main.vue` sebagai utama. Baca `tab.vue`, `details-one.vue`..`details-four.vue`, `list-two.vue`..`list-five.vue` apabila berkaitan. Jangan tukar kepada general-crud, training/crud/list atau admin Shell sebagai rujukan lengkap. Rujuk enjin `list-data.vue` dan `form-data.vue` dalam @2enapps/ui untuk behaviour sebenar. Jangan edit node_modules/library.

| Feature | Gunakan |
| --- | --- |
| List/search/dashboard initialization | getSchemaList, getSchemaFormCarian, initStatsSchema, loadDashboardStats |
| Paging/filter params | getParams("", page, this), qSearch dan searchObject |
| Service list envelope | returnResponseList; kekalkan data.data, pageNo, totalItems, totalPages serta list/total aliases |
| List decoration | assignSchemaToListData melalui listCondition |
| Details/breadcrumb | detailsBreadcrumbMixin, openDetails, backToList, onBreadcrumbScreenChange |
| Form validation | standardValidation dan customValidator contoh |
| Cards/search/notifications | StatCardGrid, ComponentCarian dan store/helpers contoh |
| Bulk/print/export/dynamic columns/tabs | schema/event wiring sebenar contoh, hanya fungsi domain yang diperlukan |

Reset carian mengosongkan qSearch dan searchObject. Breadcrumb label menggunakan nama rekod. Export masih boleh membaca finalRes.data?.data; jangan buang envelope ketika menambah aliases. Tidak semua modul memerlukan enam tabs atau delete: guna struktur contoh bagi fungsi sebenar, jangan cipta use case daripada demo.

Komponen tidak tersedia selepas semakan library: gunakan card shared, kosongkan kawasan itu dan label tepat **`[ component not available ]`**. Jangan cipta button/input/modal/chart baru atau CSS sendiri. Rekod jurang; jangan menyembunyikan label atau mengisytiharkan interaction itu siap.

### Dummy dan API standby

Gunakan fixtures sintetik domain dalam service modul, bukan data peribadi sebenar atau salinan fixture training yang tidak berkaitan. API call sebenar yang dirancang disediakan sebagai komen tidak aktif; jangan reka endpoint yang belum didokumenkan. Imports tidak digunakan dibuang/dikomen agar lint lulus. Dummy CRUD/mesej mesti jelas prototaip, bukan bukti backend disimpan. Tiada business API/Shell/SSO sebenar semasa review standalone.

Dummy service mengekalkan bentuk service sebenar supaya penggantian kemudian tidak menukar view. Filter/paging demo konsisten dengan fixtures; pilihan dropdown berdasarkan data demo relevan. Production nanti menggunakan server paging/filtering, bukan parseQuery/applyFilters demo.

### Standalone, lint dan ujian

Gunakan harness dev-only sedia ada tanpa Shell. Jika belum ada dan memerlukan edit scaffold, agent bertanya dahulu sebelum mengedit. Harness boleh menyediakan plugin/store/i18n demo yang diperlukan, bukan login/Shell production kedua.

Commands berikut hanya jika scripts sudah wujud dan sasaran failnya telah disemak:

```bash
npm run lint
npm run format:check
npm run build
```

Jika tooling belum ada, cadangkan konfigurasi/versi tepat dahulu. Jangan reka npm scripts atau run format seluruh repository. Fix hanya fail dibenarkan, ulang check.

White-box menguji logic/state/service fixture sebenar; Playwright MCP visible browser menguji behaviour black-box. Liputi happy/negative/edge, validasi, navigation, paging/search/reset, console/network errors. Browser tests sahaja bukan white-box. Paparkan UI dan screenshot sebenar untuk review pengguna. Tooling/browser unavailable ialah Blocked, bukan Pass. Simpan evidence mengikut fasa/submodul.

### Selepas semua prototaip diterima

**Prompt 10:** sediakan metadata dan federation contract sebenar mengikut ARCHITECTURE.md. remote-entry.js mengandungi `export {};`. Jika fail ini sudah scaffold, minta kebenaran khusus fail sebelum perubahan. Jangan sambung Shell secara automatik. Update PRD dengan status prototype/UI accepted, bukan production complete.

## Fasa 3 — backend, Flyway dan API sebenar

**Prompt 11–12:** baca SCOPE/BACKEND/DATABASE, pilih satu submodul, implement dengan Spring Boot Java 25, own PostgreSQL database dan Flyway. Database tidak perlu jadual kelulusan manusia. Jangan reka schema yang tiada atau mengubah locked design tanpa reopening. Dependencies module lain hanya API.

Backend docs/implementation perlu mempunyai kontrak berikut; isi nilai sebenar, bukan placeholders:

| Bahagian | Kandungan |
| --- | --- |
| Controller | Class, method HTTP, endpoint, fungsi, request/response form, role, source ID |
| Entity | Satu entity/table, hubungan, audit/soft delete, notes |
| Repository | Signature query, tujuan, pagination, index berkaitan |
| Service | Satu service/submodul; function/input/output/rules/transaction/source ID |
| Form | Field, validation, entity/service mapping, sensitive flag |
| Errors | Condition, status HTTP, code, message dan logging |

Gunakan ID sumber sebenar; SDS/UC jika tiada SRS. Contoh findAllByFlagAktif hanya sesuai jika field flagAktif sebenar wujud; jangan cipta kolum untuk meniru contoh.

### Database implementation dan corak backend

Rujuk [DATABASE-PATTERNS.md](docs/DATABASE-PATTERNS.md) dan [BACKEND-PATTERNS.md](docs/BACKEND-PATTERNS.md). Ikut corak projek/modul sedia ada dahulu, bukan restructure repo mengikut tutorial framework. Jangan install framework scaffolding tools tanpa approval.

Database: snake_case/unquoted, PK id BIGINT GENERATED ALWAYS AS IDENTITY (SERIAL alternatif corak projek), NUMERIC, TIMESTAMPTZ, CREATE TYPE bagi enum tertutup, nama idx_/uniq_/fk_ dan FK ON DELETE/UPDATE jelas. Rekod standard ini semasa Fasa 1. Jangan auto-convert schema UUID, katalog dinamik atau kontrak pagination terkunci; minta revision khusus jika bercanggah.

Sebelum query, semak query/index/relationship sedia ada, batching, page-size limits dan timeouts. Elak N+1, gunakan eager/join/batch fetch bersasar. Keyset/cursor untuk hasil besar mesti serasi kontrak API/UI; getParams/pageNo tidak boleh ditukar senyap. Caching memerlukan keys berskop, TTL/invalidation dan ketepatan permissions. Partial/expression indexes berdasarkan query sebenar, bukan tambahan rawak.

Semua schema changes melalui Flyway dan migrasi baharu. Setiap migrasi diuji forward dan rollback/recovery pada data representatif non-production. Sahkan Flyway edition/undo support; jika tiada, gunakan compensating migration atau backup/restore yang diuji, bukan down command rekaan. Production read-only kecuali mutation khusus dibenarkan; DROP/destructive change perlu approval dan backup disahkan. Jangan modify/delete data senyap.

Guna EXPLAIN (ANALYZE, BUFFERS) bagi slow-query diagnosis pada sasaran dibenarkan; ia execute query. Transaksi pendek dan atomic. Advisory locks untuk coordination jika selamat dengan keys/order/timeouts jelas; jangan buang row locks yang masih diperlukan untuk correctness/queue claims.

### Testing backend mengikut scope

Stack: PostgreSQL + Spring Data JPA; JUnit 5 + Mockito + Spring Boot Test. Service unit tests menggunakan Mockito; controller @WebMvcTest; repository @DataJpaTest pada PostgreSQL; integration @SpringBootTest. Jangan tukar kepada H2 secara senyap atau jalankan context/Flyway tests ke database tidak dikenal pasti.

Gunakan build system sedia ada. Dari folder backend, commands berikut ialah alternatif, bukan semua wajib dijalankan:

```bash
# Maven project dengan Maven dipasang:
mvn test
# Jika Maven wrapper sudah wujud:
./mvnw test
# Untuk projek Gradle yang memang mempunyai wrapper:
./gradlew test
```

Jangan tambah Gradle kepada projek Maven atau cipta wrapper tanpa keperluan/approval. Integration tests mungkin memerlukan verify/profile khusus; baca plugin/profil sebenar dan semak test discovery/reports. Startup/database-backed tests hanya melalui pelan execution dibenarkan. Unit mocks tidak membuktikan provider/database sebenar.

### Java lint/format dan keselamatan

Ikut standard pasukan/projek sebenar. Cadangan seperti Checkstyle dan Spotless mesti mempunyai versi/formatter/settings jelas; tiada formatter universal Spring Boot yang boleh diandaikan. Prettier frontend tidak digunakan untuk Java.

Hanya jika plugins dikonfigurasi:

```bash
mvn spotless:check
mvn checkstyle:check
mvn -DskipTests compile
```

Format/fix Java menyasarkan fail berubah sahaja, kemudian ulang check/build/tests. Jangan run startup/Flyway kerana sekadar ingin format kod.

Semak setiap endpoint: happy path, setiap field/boundary, role/object permissions, missing/conflict/duplicates/concurrency, pagination/sort/filter/empty, integration errors/timeouts dan consistent payload/errors. Uji SQL injection, mass assignment, IDOR, upload, audit dan logs tanpa secrets/PII. Review dependency/security scans, critical warnings dan architecture boundaries. Repositories data sahaja; services transactions; tiada giant service campur submodul, dummy backend responses, hidden TODOs atau unused code.

### Execution bukan human review schema

**Prompt 13** menyediakan pelan exact scripts/checksums, target environment/database/roles, startup/tests/recovery/evidence. **Prompt 14** memberi kebenaran pelaksanaan pelan tepat selepas pengguna memastikan sasaran betul. Jangan connect ke database yang tidak dikenal pasti; jangan jalankan migrasi production melalui andaian. Flyway enabled tidak bermaksud semua pending migration boleh terus dijalankan. Jangan rewrite executed migrations.

### Sambung API sebenar dan kemudian Shell

**Prompt 15** menggantikan fixtures dengan API sebenar bagi submodul backend yang diuji. Kekalkan service contract/UI examples, buang fixture production fallback dan ulang frontend/API tests. **Prompt 16** menerima submodul dan mencadangkan satu backend seterusnya; ulang 11–16.

Selepas semua submodul, sediakan pelan Shell MFE/SSO/menu/routes dan cross-submodule tests. Paparkan exact diffs dan minta kebenaran file-specific bagi scaffold/Shell config. Jangan buat login baru atau sambung database dari browser. Tests standalone tidak membuktikan federation, SSO atau backend authorization.

## Penutupan

**Prompt 17:** hasilkan README backend sebenar: tujuan/skop, submodul, package structure, prerequisites/setup/run, env tanpa secrets, own-database/migration instructions, Keycloak access matrix dan API list lengkap. README terkunci perlu reopening dahulu. Lengkapkan TESTING/USERMANUAL daripada bukti sebenar dan PRD ringkasan umum. Pengguna menerima dan mengunci dokumen akhir melalui prosedur serasi uppercase; agent tidak lock.

**Prompt 18:** deployment ialah pelan dan kebenaran berasingan. Jangan deploy hanya kerana kod/tests selesai. Catat missing components/integrations sebagai batasan sebenar, bukan siap.

## Bukti minimum, bukan dakwaan

Setiap laporan: phase/submodule, fungsi/skrin, fail berubah, commands, hasil Pass/Fail/Blocked/Not run, screenshot/trace/log paths, batasan dan keputusan seterusnya. Jangan isi test result sebelum ujian dijalankan. Jangan menyalin angka baris/warning rujukan lama sebagai bukti semakan hari ini.

Baca Module Code daripada module.config.json (medan code). Mockup mesti daripada .docs/documents/mockup/{module code}/, contohnya M12 → folder m12 yang benar-benar wujud. Jika kod/folder tiada atau tidak jelas, tanya pengguna; jangan guna mockup modul lain.
