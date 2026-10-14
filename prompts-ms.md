# D-ReAMS — prompt Agile tiga fasa

Gunakan satu prompt pada satu masa. Baca proposal sebenar sebelum menghantar kelulusan. Teks contoh bukan jawapan perniagaan. Fasa 1 tamat dengan pengguna mengunci dokumen; Fasa 2 frontend dahulu, standalone dan sintetik; Fasa 3 backend dan integrasi sebenar. Tiada rekod human review database berasingan. Jangan ubah fail scaffold tanpa kebenaran tepat. Rujuk guide.md dan ARCHITECTURE.md.

## Arahan fasa ringkas

Pasang dengan `node skills.js --codex`, `--claude`, `--opencode`, `--cursor`, `--gemini`, `--copilot`, `--windsurf` atau `--harness NAMA` dari checkout installer. Guna `--list-harnesses` bagi semua path/sumber. Codex menggunakan `$d-documents`, `$d-frontend nama-submodul`, `$d-backend nama-submodul`; Claude Code/OpenCode/Cursor/Cline menggunakan `/d-documents`, `/d-frontend nama-submodul`, `/d-backend nama-submodul`. Rujuk `docs/SKILLS.md` dan `docs/HARNESS-SUPPORT.md` dalam repository tersebut; tools lain mungkin menggunakan skill selector, bukan slash command. Prompt bernombor di bawah kekal alternatif manual; skills tidak memintas locks, penerimaan pengguna atau pelan execution database dikenal pasti.

## 1. Sahkan modul, sumber dan path dokumen

**Prompt:**

```text
Baca AGENTS.md, module.config.json dan .docs/PRD.md. Kenal pasti modul sebenar dan sumber dalam .docs/documents/. Jangan anggap SRS wujud atau guna peraturan modul lain.

Gunakan tiga fasa: dokumentasi dan penguncian pengguna; prototaip frontend standalone bagi semua submodul; backend dan integrasi sebenar. Database tidak memerlukan rekod human review/APPROVED berasingan.

Nama reka bentuk ialah SCOPE.md, ARCHITECTURE.md, DATABASE.md, BACKEND.md dan FRONTEND.md huruf besar. Semak fail lowercase, locks dan arahan sedia ada dahulu. Jika nama atau dasar lama terkunci bercanggah, tanya satu soalan khusus dan nyatakan path terjejas; jangan rename, pintas lock atau ubah kod scaffold sendiri.

Ringkaskan sumber tersedia dan kekaburan sebenar. Boleh teruskan pemeriksaan read-only. Jangan mulakan implementasi.
```

## 2. Fasa 1: baca sumber dan tulis dokumen khusus

**Prompt:**

```text
Saya membenarkan Fasa 1 dokumentasi bagi modul dan sumber yang disahkan. Baca dokumen berkaitan termasuk jadual/rajah DOCX serta fail sokongan mockup.

Tulis dokumen .docs/ yang belum dikunci:
- SCOPE.md: peta lengkap keperluan sumber, submodul, aktor, workflow, keputusan, citations dan pautan yang menghubungkan dokumen khusus.
- DATABASE.md: jadual PostgreSQL modul sendiri, medan/jenis/NULL/default, keys, hubungan, constraints, indexes, audit/removal dan invariants query/transaksi.
- BACKEND.md: controller/service/repository/entity/form mengikut submodul, fungsi/logic, payload API, permissions, errors dan source IDs.
- FRONTEND.md: idea mockup, skrin/medan/tindakan, rujukan general-tab-crud/shared UI tepat, senario dummy prototype dan API dirancang.
- ARCHITECTURE.md: ownership bersama, sempadan MFE/Shell/UI dan struktur folder secara ringkas. Setiap modul ada database berasingan; modul lain melalui API sahaja.

Gunakan ayat mudah dan terus; jangan ulang semua butiran dalam SCOPE.md atau setiap fail. PRD.md ialah maklumat umum sistem/fasa. Kekalkan citations dan beza fakta sumber daripada cadangan. Jangan tinggal fakta sumber sebagai TBD. Tanya peraturan yang benar-benar tiada/bercanggah sebelum reka bentuk bergantung padanya.

Tiada kod, migrasi, perubahan scaffold atau penguncian.
```

## 3. Selesaikan satu kumpulan keputusan

**Prompt:**

```text
Bentangkan maksimum lima keputusan benar-benar belum selesai dengan ID kekal, satu cadangan lengkap, kesan pengguna, nilai/bukti tiada dan kerja terhalang. Jangan ulang soalan yang ditetapkan sumber atau sudah saya jawab.

Asingkan bukti provider yang tidak tersedia. Jangan ulang meminta maklumat yang saya sudah nyatakan tiada; teruskan keputusan bebas. Jika tidak faham, tanya sebelum kerja bergantung padanya, bukan selepas mereka peraturan. Tunggu jawapan saya.
```

## 4. Terapkan kumpulan yang dijawab

**Prompt:**

```text
Saya meluluskan cadangan konkrit kumpulan terakhir tepat seperti ditulis. Senaraikan ID diliputi dan terapkan hanya keputusan lengkap secara selaras dalam dokumen belum dikunci.

Jangan infer nilai tiada, kontrak provider atau penerimaan daripada kelulusan. Tanya pilihan pengguna yang masih perlu dan rekod bukti luaran tiada. Bentangkan kumpulan bebas seterusnya atau laporkan keputusan selesai. Tiada kod atau penguncian.
```

## 5. Fasa 1: ringkasan PRD dan pembacaan semula pengesahan

**Prompt:**

```text
Lengkapkan dokumen Fasa 1 dan tulis ringkasan umum fasa/sumber/keputusan dalam PRD.md dalam kebenaran ini.

Kemudian baca semula sumber berkaitan sekali untuk pengesahan seperti diminta. Pastikan setiap fungsi, medan, workflow dan permission sumber diwakili serta dipautkan kepada storan/API/skrin. Betulkan kekurangan dalam draf terbuka; rekod fail/seksyen sebenar disemak semula dan selaraskan PRD.md kepada hasil sebenar.

Jangan ulang semakan sumber tanpa penghujung atau tinggal alternatif bercanggah. Jika belum lengkap, tanya soalan tepat yang masih perlu dan hentikan kerja bergantung padanya. Jangan reka kontrak luar.

Jika lengkap, berhenti dan minta saya mengunci lima dokumen reka bentuk Fasa 1. Jangan mulakan Fasa 2 atau cipta jadual human review database. Tiada kod atau migrasi.
```

## 6. Sahkan lock pengguna dan pilih satu submodul frontend

**Prompt:**

```text
Saya telah mengunci dokumen Fasa 1. Sahkan path dan hash sebenar; jangan bergantung pada kenyataan ini sahaja. Tiada rekod kelulusan database berasingan diperlukan.

Baca SCOPE.md dan FRONTEND.md. Cadangkan satu submodul frontend, skrin, fail rujukan tepat, senario dummy dan kaedah ujian standalone tanpa Shell/backend. Semak komponen @2enapps/ui serta tooling/harness sedia ada sebelum cadang perubahan.

Kenal pasti jika fail scaffold perlu diubah dan tanya sebelum edit. Cadangkan tooling lint/test yang tiada dengan versi/commands tepat, bukan arahan rekaan. Tunggu pilihan submodul; jangan implement semua sekali.
```

## 7. Fasa 2: laksanakan prototaip standalone dipilih

**Prompt:**

```text
Saya meluluskan satu submodul frontend dan pelan terhad tanpa perubahan scaffold yang baru dicadangkan. Nyatakan ID dan implement submodul itu sahaja.

Baca SCOPE.md/FRONTEND.md dan general-tab-crud/list-main.vue, tab.vue serta details/list anak berkaitan. Jangan ganti dengan general-crud, training/crud/list atau screen admin Shell. Guna @2enapps/ui sahaja; semak kod shared terpasang. Jika komponen wajib tiada, biarkan card shared kosong dengan label tepat [ component not available ]. Rekod jurang; jangan cipta button/input/custom component atau patch library UI.

Guna data dummy sintetik untuk prototaip. Sediakan panggilan API sebenar dirancang sebagai kod komen yang tidak aktif; jangan hantar business API requests dahulu. Bezakan dummy mode daripada kejayaan backend sebenar. Kekalkan getParams, envelope/list/total returnResponseList, returnResponseDetails dan detailsBreadcrumbMixin; jangan bina params sendiri atau gandakan navigation state. Hanya tindakan domain disokong.

Guna ESLint dan Prettier, buang import/stub training tidak digunakan dan format fail berubah sahaja. Jalankan standalone tanpa Shell dengan harness dipersetujui. Jangan ubah fail scaffold tanpa kebenaran khusus fail.

Laporkan skrin, pemetaan rujukan/komponen/API, card komponen tiada, perubahan dan hasil lint/format/build sebenar. Berhenti pada submodul ini.
```

## 8. Fasa 2: uji dan tunjuk interface

**Prompt:**

```text
Bagi prototaip semasa, jalankan white-box tests logic yang dilaksanakan dan black-box tests melalui Playwright MCP dalam browser yang kelihatan. Liputi happy/negative/edge, validasi/boundaries, carian/reset, paging, tabs/breadcrumbs, tindakan disokong serta console/network errors. Sahkan tiada kebergantungan Shell/business API dan card komponen tiada jelas.

Guna senario fixture sintetik; jangan dakwa bukti API, SSO atau authorization sebenar. Simpan screenshots/traces/results dalam evidence/ dan kemas kini TESTING.md terbuka dengan bukti prototaip sahaja. Jika tooling/browser tiada, tandakan Blocked, bukan Pass.

Betulkan kecacatan dalam skop submodul dibenarkan, ulang semakan terjejas dan tunjuk interface untuk review saya. Tanya jika tidak pasti; jangan ulang kegagalan tanpa diagnosis baharu. Berhenti sebelum submodul seterusnya.
```

## 9. Terima interface dan cadangkan prototaip seterusnya

**Prompt:**

```text
Saya menerima interface submodul semasa yang ditunjukkan dengan batasan prototaip yang disenaraikan. Rekod penerimaan ini dan rujukan bukti dalam PRD.md; jangan dakwa siap production.

Cadangkan satu submodul frontend seterusnya dan tunggu kebenaran. Ulang kitaran bina/uji/review pengguna Fasa 2. Jika semua interface diterima, laporkan dan sediakan pelan metadata sahaja; jangan mulakan backend atau integrasi Shell secara automatik.
```

## 10. Muktamad metadata MFE selepas semua interface diterima

**Prompt:**

```text
Sahkan setiap submodul Fasa 2 mempunyai penerimaan pengguna atau status belum selesai yang jelas. Guna identiti modul/skrin lalai sebenar untuk sediakan metadata.js, remote-entry.js dengan export {}; dan expose keys sepadan. Ikut contoh metadata ARCHITECTURE.md; jangan salin identiti V2T kepada modul lain.

Jika fail ini sudah wujud sebagai scaffold, tunjuk diff tepat dan minta kebenaran sebelum mengubahnya. Prompt ini tidak membenarkan edit scaffold. Jangan tambah routes/menu Shell atau sambung SSO dahulu. Semak nama/import federation secara statik, kemas kini PRD.md dengan status sebenar Fasa 2 dan berhenti untuk kebenaran Fasa 3.
```

## 11. Fasa 3: pilih satu submodul backend

**Prompt:**

```text
Baca SCOPE.md, BACKEND.md, DATABASE.md dan kontrak frontend diterima. Sahkan lock reka bentuk Fasa 1; database tidak memerlukan rekod reviewer/APPROVED berasingan.

Ikut corak projek/modul sedia ada sebelum convention framework; jangan install tool scaffold yang menyusun semula repo tanpa approval. Guna PostgreSQL + Spring Data JPA serta JUnit 5 + Mockito + Spring Boot Test. Rancang @WebMvcTest, @DataJpaTest dan @SpringBootTest dengan commands Maven/Gradle sebenar serta database ujian terasing. Rujuk docs/BACKEND-PATTERNS.md dan docs/DATABASE-PATTERNS.md dalam bahan rujukan berkaitan.

Cadangkan satu submodul backend dengan fungsi, classes, endpoint/forms, tables/indexes milik modul, dependencies migrasi, roles dan tests. Guna Java 25, Spring Boot dan PostgreSQL. Tiada akses database silang modul; dependencies melalui API.

Semak formatter/lint Java dan cadang tools/versi yang tiada (contohnya Checkstyle dan Spotless standard pasukan). Jangan dakwa ada formatter universal Spring Boot atau turunkan sasaran Java. Kenal pasti kontrak luaran yang tiada dan tanya sebelum implementasi bergantung padanya. Jangan sentuh fail scaffold. Tunggu pilihan.
```

## 12. Fasa 3: implement satu backend dan cipta migrasinya

**Prompt:**

```text
Saya membenarkan satu submodul backend dan pelan terhad yang baru dicadangkan. Nyatakan ID. Implement controller/service/form/entity/repository sebenar, validasi, role/object access, transaksi, paging/filter/sort, errors, concurrency dan audit mengikut BACKEND.md/DATABASE.md.

Terapkan standard database: snake_case/unquoted identifiers; id BIGINT GENERATED ALWAYS AS IDENTITY atau corak SERIAL dibenarkan; NUMERIC/TIMESTAMPTZ; CREATE TYPE enums; nama idx_/uniq_/fk_ serta FK actions jelas. Tanya sebelum menukar definisi UUID/catalog/API/locking terkunci yang bercanggah.

Guna semula queries/indexes dan semak relationships/batching/page-size/timeouts. Elak N+1; eager/join/batch loading bersasar, partial/expression indexes dan cache berskop hanya jika sesuai. Guna keyset/cursor untuk hasil besar hanya dengan kontrak API/UI serasi dipersetujui. Transaksi pendek; advisory coordination jika selamat, kekalkan row locks yang perlu. EXPLAIN (ANALYZE, BUFFERS) pada sasaran dibenarkan sahaja kerana ia execute query.

Setiap migrasi perlu bukti forward pada data representatif dan rollback/recovery diuji. Sahkan sokongan Flyway undo atau uji compensating/restore procedure; jangan reka automatic rollback. Production read-only kecuali dibenarkan jelas; tiada destructive/DROP tanpa approval serta backup disahkan, dan tiada modify/delete data senyap.

Cipta migrasi Flyway bagi database modul sendiri daripada reka bentuk terkunci. Tiada human review skema berasingan diperlukan. Jangan reka kolum/peraturan tiada atau cipta tables modul lain. Jelaskan prerequisite tables; tanya jika skop perlu diperluas. Jangan tulis semula migrasi dijalankan.

Kekalkan Flyway aktif, Hibernate generation none, SQL initialization never dan bearer authentication aktif secara default. Kekalkan bypass local sahaja tanpa menganggap bypass tests bukti keselamatan sebenar.

Guna Java 25, lint/style dan format Java diluluskan, fail berubah sahaja. Jalankan non-database checks/build/tests. Tiada placeholders, dummy production responses, hidden TODOs, unused code, swallowed exceptions atau service besar campur submodul. Jangan reka kontrak provider.

Jangan execute migrasi atau startup terhadap database sehingga pelan sasaran/execution dibenarkan. Jangan ubah scaffold atau fail terkunci. Laporkan fungsi/fail/results sebenar dan berhenti sebelum submodul lain.
```

## 13. Sediakan pelan execution database dan API tests tepat

**Prompt:**

```text
Sediakan pelan execution submodul semasa dalam TESTING.md terbuka: nama/checksum migrasi, environment/host/port/database/schema/roles sasaran, commands, startup, akaun/services, recovery dan bukti dijangka. Sasarkan database modul ini sahaja. Jangan dedah secrets.

Sertakan commands sebenar JUnit 5/Mockito unit, @WebMvcTest controller, @DataJpaTest PostgreSQL repository dan @SpringBootTest integration (mvn test atau wrapper Maven/Gradle sedia ada serta integration profiles). Sertakan migration/rollback tests data representatif dan performance/locking checks terbatas; jangan anggap H2 atau production sebagai sasaran ujian.

Sertakan happy path endpoint, setiap medan/boundary, role/object scope, rekod missing/conflict/duplicate/concurrent, pagination/sort/filter/empty, integration failure/timeouts, kontrak response/error, SQL injection, mass assignment, IDOR, upload dan audit. Sertakan commands build/lint/format/dependency/security scan yang disokong projek.

Jadual human review skema berasingan tidak diperlukan; execution masih memerlukan sasaran dikenal pasti. Jangan jalankan pelan atau dakwa semakan belum dijalankan lulus.
```

## 14. Jalankan pelan dikenal pasti dan uji backend

**Prompt:**

```text
Saya membenarkan fail/checksum migrasi, database sasaran, startup dan commands ujian tepat dalam pelan lengkap terakhir. Jika sasaran/prasyarat tidak diketahui atau fail berubah, tanya sebelum execution.

Jalankan pelan itu sahaja. Uji API dan keselamatan sebenar dengan identiti ujian sebenar yang sesuai; tiada dummy production responses. Laporkan kegagalan/provider tiada dengan jujur; tiada fallback berjaya. Simpan bukti dan laporkan Pass/Fail/Blocked/Not run, scan findings dan critical warnings. Betulkan dalam skop sahaja; tanya jika reka bentuk/scaffold perlu berubah. Berhenti pada submodul dipilih.
```

## 15. Ganti data prototaip dan integrasi frontend dipilih

**Prompt:**

```text
Saya membenarkan frontend submodul semasa disambung kepada API sebenar yang diuji. Aktifkan API calls disediakan dan buang/nyahaktif fixtures sintetik daripada production paths. Kekalkan kontrak getParams, returnResponseList/Details dan breadcrumbs. Backend mengurus pagination/filtering; jangan tinggal parseQuery/applyFilters demo sebagai logic production.

Jalankan ESLint/Prettier/build dan Playwright frontend/API sebenar bagi submodul ini. Tiada fallback fixture apabila HTTP gagal. Tunjuk loading, empty, validation, forbidden, conflict dan integration errors sebenar. Komponen shared tiada kekal dilabel, bukan direka atau dikira siap.

Jangan sambung Shell atau edit scaffold tanpa kebenaran berasingan. Laporkan bukti dan berhenti untuk penerimaan submodul sebelum kitaran backend seterusnya.
```

## 16. Terima satu submodul berintegrasi dan cadangkan seterusnya

**Prompt:**

```text
Saya menerima submodul berintegrasi yang baru ditunjukkan dengan status ujian/batasan disenaraikan. Kemas kini PRD.md dengan implementasi/bukti sebenar dan cadangkan satu submodul backend seterusnya. Tunggu kebenaran; ulang Fasa 3 bagi setiap submodul.

Selepas semua submodul, sediakan pelan berasingan Shell MFE/SSO/menu/routes dan cross-submodule tests. Tunjuk fail tepat; minta kebenaran sebelum sentuh scaffold/konfigurasi Shell sedia ada. Jangan deploy automatik.
```

## 17. Hasilkan README backend dan dokumentasi pengguna akhir

**Prompt:**

```text
Kemas kini README backend yang dibenarkan supaya sepadan implementasi sebenar: tujuan/skop, submodul, architecture/packages, prerequisites/setup/run, nama env tanpa secrets, arahan database sendiri/Flyway, matriks Keycloak role/access dan senarai API dilaksanakan lengkap (submodul, method, path, fungsi, request/response form, role, source ID sebenar). Jangan reka SRS ID atau senarai endpoint belum siap sebagai tersedia. Jika README terkunci, minta dibuka dahulu.

Lengkapkan TESTING.md dengan hasil white-box/API/browser/security/dependency/lint/format/build sebenar. Tulis USERMANUAL.md daripada tingkah laku/screenshots sebenar mengikut role/submodul. Bezakan screenshots prototaip daripada live dan senaraikan batasan komponen tiada.

Kemas kini PRD.md dengan ringkasan umum sistem/fasa akhir dan pautan bukti. Serahkan untuk penerimaan pengguna; minta pengguna mengunci TESTING.md dan USERMANUAL.md lengkap. Jangan kunci sendiri atau deploy.
```

## 18. Sediakan deployment secara berasingan

**Prompt:**

```text
Sediakan, jangan jalankan, pelan deployment dengan artifact/commit tepat, environment/server, database modul sendiri, migrasi/checksum, env/secret references, konfigurasi Shell/remote/API, commands, backups/recovery dan health/security checks. Kenal pasti maklumat tiada sekali dan tanya sebelum kerja bergantung padanya.

Jangan deploy atau execute perubahan production sehingga pelan lengkap dikenal pasti dibenarkan secara jelas. Pastikan fixtures prototaip tidak aktif dan komponen belum selesai didokumentasi.
```

Baca Module Code daripada medan code dalam module.config.json dan tentukan folder sebenar .docs/documents/mockup/{module code}/ sebelum membaca mockup. Jangan ganti dengan nama modul atau folder modul lain; tanya jika tiada atau tidak jelas.
