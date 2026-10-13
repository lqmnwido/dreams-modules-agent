# Panduan penciptaan modul D-ReAMS hingga selesai

Contoh menggunakan **M12 / memorial**. Untuk modul lain, tukar nama modul, kod, lokasi workspace dan sumber mengikut modul tersebut. Jangan andaikan modul lain mempunyai keputusan perniagaan yang sama.

**Skrip** dijalankan dalam terminal. **Prompt** dihantar kepada agent Codex dalam workspace. Jalankan satu fasa pada satu masa. Semua kelulusan merujuk proposal sebenar yang telah anda baca; jangan hantar kelulusan jika terdapat sasaran atau pilihan yang belum diketahui.

## Peraturan pelaksanaan, UI dan kualiti kod

Pustaka prompt tersedia dalam [prompts.md](prompts.md) (English) dan [prompts-ms.md](prompts-ms.md) (Bahasa Melayu). Nombor prompt pustaka tidak sama dengan nombor langkah panduan kerana panduan merangkumi pemasangan dan skrip terminal.

Panduan ini memerlukan pelaksanaan **satu submodul pada satu masa**. Tentukan submodul semasa terlebih dahulu, kemudian siapkan backend, frontend dan semakannya sebelum menerima kelulusan untuk submodul seterusnya. Jangan anggap kelulusan satu submodul meliputi semua submodul. Infrastruktur bersama yang benar-benar diperlukan boleh dibuat sebagai kebergantungan minimum dan mesti disenaraikan.

**Autoriti UI:** mockup ialah draf untuk mengenal pasti fungsi, medan, tindakan dan aliran kerja. Ia bukan spesifikasi visual akhir. Susunan halaman, komponen, schema borang/jadual, tabs, modal, validation, services dan helpers mesti mengikuti contoh sebenar `src/views/ui-element/` serta corak `training/general-tab-crud` yang dipilih. Gunakan komponen `@2enapps/ui`; jangan reka layout baharu hanya berdasarkan rupa mockup. Petakan setiap skrin kepada fail contoh tepat sebelum implementasi. Jangan salin data demo, API training, kawalan legacy atau gaya yang tidak dibenarkan sebagai kod domain. Jika tiada contoh atau komponen yang memenuhi keperluan, laporkan jurang dan cadangkan penyelesaian sebelum membuat penyimpangan.

**Kualiti kod:** frontend mesti melalui ESLint dan Prettier; Java mesti melalui lint/style checks dan formatter Java yang dikonfigurasi, bukan Prettier frontend. Gunakan konfigurasi repository/shared standards sedia ada. Jika tooling belum ada, agent perlu membentangkan konfigurasi, dependency/plugin dan versi tepat yang dicadangkan; jangan melaporkan check sebagai lulus jika tooling belum tersedia. Jangan disable rules atau exclude kod domain untuk menyembunyikan kegagalan. Format hanya fail berkaitan; jangan reformat seluruh repository, dokumen terkunci, generated files atau vendor code.

Peraturan ini ialah arahan untuk kerja seterusnya. Mengemas kini panduan tidak mengubah reka bentuk terkunci: jika reka bentuk visual terkunci bercanggah dengan autoriti UI di atas, ikut proses revision manusia dalam langkah 18 dahulu.

## 1. Semak alat yang diperlukan

**Skrip:**

```bash
node --version
npm --version
git --version
java --version
mvn --version
```

Installer memerlukan Node.js sekurang-kurangnya `22.12`, npm dan Git. Java/Maven perlu sepadan dengan konfigurasi backend yang dipilih. Akses GitLab syarikat diperlukan untuk dependencies berkaitan.

## 2. Dapatkan installer

Pilih **satu** kaedah di bawah. Laman yang dirujuk oleh README terkini ialah [D-ReAMS Modules Agent](https://dreams-agents.kohich.site/), dengan arahan pemasangan serta pustaka prompt English / Bahasa Melayu. Panduan ini diselaraskan dengan kod installer tempatan revision `184f171`; laman dan muat turun hosted belum diuji dalam semakan ini.

### Pilihan A — Git clone, tanpa curl

Jika belum mempunyai installer:

```bash
mkdir -p /home/lqmnwido/Projects/dreams
cd /home/lqmnwido/Projects/dreams

git clone https://github.com/lqmnwido/dreams-modules-agent.git
cd dreams-modules-agent

node bin/install.mjs
```

Jika installer sudah tersedia dan anda mahu mengambil versi terkini, semak dahulu:

```bash
cd /home/lqmnwido/Projects/dreams/dreams-modules-agent

git status --short
git branch --show-current
git remote -v
```

Untuk working tree bersih pada `main` dengan remote GitHub yang betul:

```bash
git fetch origin
git pull --ff-only origin main
node bin/install.mjs
```

Jika terdapat perubahan tempatan, branch lain atau pull gagal, berhenti dan semak dahulu. Jangan reset, stash atau timpa perubahan secara automatik.

Jika tidak memerlukan kemas kini installer:

```bash
node /home/lqmnwido/Projects/dreams/dreams-modules-agent/bin/install.mjs
```

### Pilihan B — Skrip hosted Linux/macOS

Muat turun skrip sahaja dahulu:

```bash
curl -fL 'https://dreams-agents.kohich.site/install.sh' -o dreams-agent-install.sh
```

Baca kandungannya sebelum menjalankan:

```bash
cat dreams-agent-install.sh
```

Selepas menyemak skrip:

```bash
bash dreams-agent-install.sh
```

### Pilihan C — Skrip hosted Windows PowerShell

Muat turun dan baca skrip:

```powershell
Invoke-WebRequest -Uri 'https://dreams-agents.kohich.site/install.ps1' -OutFile 'dreams-agent-install.ps1'
Get-Content .\dreams-agent-install.ps1
```

Selepas menyemak skrip:

```powershell
.\dreams-agent-install.ps1
```

Jika polisi organisasi menyekat skrip PowerShell, gunakan kaedah Git clone yang dibenarkan; jangan ubah execution policy untuk memintas sekatan. Contoh path Linux dalam langkah seterusnya perlu diganti dengan lokasi workspace Windows sebenar.

Skrip hosted mengambil branch `main` ke direktori sementara dan menjalankan soalan installer. Ia tidak memasang Node/Git/npm atau memerlukan administrator. Pilih lokasi workspace kekal secara jelas semasa menjawab soalan; jangan gunakan direktori sementara sebagai workspace projek.

Installer sendiri tidak memerlukan `npm install`. Untuk pemasangan yang boleh diulang dengan versi sama, gunakan kaedah Git dengan commit atau tag yang telah disemak; kaedah hosted menggunakan `main` yang boleh berubah. Mengemas kini installer tidak menaik taraf workspace yang telah dihasilkan secara automatik.

Isi soalan interaktif berdasarkan modul sebenar:

| Soalan              | Contoh M12                                           |
| ------------------- | ---------------------------------------------------- |
| Module name         | `memorial`                                           |
| Module code         | `MEM`                                                |
| Target workspace    | `/home/lqmnwido/Projects/dreams/memorial-workspace`  |
| Java group          | `com.dreams`                                         |
| Java package        | `com.dreams.memorial`                                |
| Java version        | Versi yang anda luluskan dan akan gunakan            |
| Spring Boot version | Versi tepat yang diluluskan                          |
| Frontend port       | `3004`, jika belum digunakan                         |
| Submodules          | Isi jika telah diketahui; kosong jika belum disahkan |

Arahan AGENTS.md terkini bagi workspace baharu menetapkan satu submodul pada satu masa, pemetaan contoh UI tepat dan semakan lint/format. Workspace lama tidak berubah hanya dengan git pull installer; perubahan arahan atau reka bentuk terkunci memerlukan proses revision yang dibenarkan.

Baca ringkasan sebelum mengesahkan penciptaan fail. **Jangan jalankan installer semula untuk menimpa workspace sedia ada.**

## 3. Pasang dependencies workspace

Jika anda memilih pemasangan dependencies semasa installer dan ia berjaya, langkah ini tidak perlu diulang.

Jika pemasangan ditangguhkan atau belum selesai:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace

node scripts/maintenance.mjs install
node scripts/maintenance.mjs check-docs
```

Arahan `install` menjalankan pemasangan awal. Arahan maintenance biasa berikut digunakan kemudian apabila anda memang mahu penyelenggaraan dependencies:

```bash
node scripts/maintenance.mjs
```

Jangan jalankan maintenance biasa sebagai pengganti pemasangan awal. Semak output sebenar; kegagalan rangkaian atau akses dependencies tidak bermaksud pemasangan telah selesai.

## 4. Letakkan dokumen sumber

Letakkan SDS, SRS jika wujud, dan mockup dalam:

```text
memorial-workspace/.docs/documents/
```

Contoh:

```text
.docs/documents/
├── dokumen-SDS.docx
└── mockup/
    └── m12/
```

Gunakan file manager atau arahan salinan dengan lokasi sumber sebenar. Jangan reka nama atau lokasi sumber.

## 5. Pulihkan keperluan dan sediakan skop

**Prompt:**

```text
Baca AGENTS.md dan .docs/PRD.md untuk M12.

Saya meluluskan penyempurnaan .docs/scope.md yang belum dikunci.

Semak sumber yang dibekalkan. Jika dapatan semakan terdahulu tidak mencukupi, saya membenarkan pembacaan semula sumber yang diperlukan sahaja.

Untuk M12, gunakan SDS yang dibekalkan dan .docs/documents/mockup/m12/ sebagai mockup autoritatif bagi dapatan fungsi, medan dan aliran kerja. Mockup ialah draf, bukan spesifikasi visual akhir; struktur UI pelaksanaan mengikuti contoh ui-element dan @2enapps/ui yang dipilih. Tiada SRS berasingan. Folder bertarikh dan ZIP ialah rujukan sejarah.

Dokumentasikan submodul, fungsi, aktor, medan, aliran kerja, validasi dan kebenaran akses sebenar. Nyatakan nama fail dan seksyen sumber.

Jangan biarkan fakta sumber sebagai TBD. Bezakan keperluan sumber daripada cadangan bagi peraturan yang bercanggah atau tidak dinyatakan.

Simpan dapatan dan rujukan dalam draf skop.

Jangan tulis kod, cipta migrasi atau kunci dokumen.
```

Untuk modul lain, ganti perenggan sumber dengan keadaan sebenar modul itu.

## 6. Bentangkan keputusan skop

**Prompt:**

```text
Gabungkan keputusan skop yang belum selesai.

Buang pendua dan kenal pasti perkara yang sudah ditetapkan oleh sumber atau disahkan oleh saya.

Bentangkan maksimum lima keputusan pada satu masa. Bagi setiap keputusan:
- Berikan ID yang kekal.
- Terangkan soalan dengan mudah.
- Berikan satu cadangan jawapan lengkap.
- Terangkan kesan kepada pengguna.
- Nyatakan nilai atau bukti luaran yang masih diperlukan.
- Nyatakan kerja yang terhalang.

Asingkan keputusan dasar daripada kontrak provider dan nilai deployment.

Jangan ulang permintaan maklumat yang telah saya nyatakan tidak tersedia. Teruskan keputusan bebas yang lain.

Tunggu jawapan saya sebelum kumpulan seterusnya.
```

## 7. Luluskan kumpulan keputusan skop

**Prompt, hanya jika anda bersetuju:**

```text
Saya meluluskan cadangan dalam kumpulan keputusan skop terakhir anda, tepat seperti yang ditulis.

Nyatakan ID yang diliputi kelulusan ini.

Terapkan keputusan yang telah selesai dalam .docs/scope.md.

Kelulusan tidak membekalkan nilai atau kontrak yang masih tiada. Kekalkan perkara tersebut sebagai belum selesai.

Jangan tangguhkan fungsi tanpa persetujuan saya.

Bentangkan kumpulan bebas seterusnya, atau laporkan semua keputusan dasar yang menghalang reka bentuk telah selesai.

Jangan tulis kod, cipta migrasi atau kunci dokumen.
```

Ulang langkah 6–7 sehingga selesai. Jika tidak bersetuju dengan seluruh kumpulan, berikan jawapan khusus mengikut ID.

## 8. Semak kesediaan skop

**Prompt:**

```text
Semak kesediaan .docs/scope.md untuk reka bentuk teknikal.

Pastikan fungsi, aktor, medan, aliran kerja, validasi dan kebenaran akses adalah konkrit.

Asingkan:
- Keputusan dasar yang menghalang reka bentuk.
- Kontrak luaran yang menghalang pelaksanaan.
- Nilai persekitaran yang diperlukan kemudian.
- Fungsi yang saya tangguhkan secara jelas.

Jika keputusan dasar masih menghalang reka bentuk, bentangkan penyelesaiannya dan tunggu jawapan.

Jika skop bersedia, serahkan untuk penerimaan saya.

Jangan kunci dokumen atau mereka-reka rekod penerimaan.
```

## 9. Sediakan reka bentuk teknikal

**Prompt selepas menerima skop:**

```text
Saya menerima skop lengkap dan meluluskan penyediaan:
- .docs/architecture.md
- .docs/database.md
- .docs/backend.md
- .docs/frontend.md

Sediakan reka bentuk konkrit.

Architecture:
Sempadan modul, Shell, SSO, konfigurasi dan deployment.

Database:
Jadual PostgreSQL, kolum, jenis, NULL, defaults, PK/FK, hubungan, constraints, indexes, audit dan deletion rules.

Backend:
Controller, service, form, DTO, endpoint REST, request/response, validasi, errors, transactions dan permissions.

Frontend:
Skrin, medan, tindakan, services, exposes.js dan route Shell menggunakan @2enapps/ui serta corak training. Bagi setiap skrin, nyatakan fail contoh ui-element/general-tab-crud tepat dan pemetaan komponen, schema, helpers serta layout. Mockup menentukan keperluan fungsi; ia tidak menentukan reka bentuk visual akhir. Jangan invent layout baharu jika contoh yang sesuai tersedia.

Tangani pagination, N+1, concurrency, duplicates dan integration failures.

Gunakan skop dan rujukan sumber yang disimpan.

Bezakan reka bentuk disahkan daripada cadangan bersyarat.

Jangan tulis kod, cipta migrasi atau kunci dokumen.
```

## 10. Semak keselarasan reka bentuk

**Prompt:**

```text
Semak kelima-lima draf bersama-sama.

Bagi setiap fungsi:
- Pastikan data mempunyai storan.
- Pastikan API mempunyai request, response dan permissions.
- Pastikan frontend menggunakan API dan medan tersebut.
- Selaraskan validasi, status, errors, transaksi dan indexes.

Semak juga penciptaan draf, penjanaan nombor rujukan dan perubahan medan yang mempengaruhi nombor tersebut.

Asingkan pembetulan konkrit, keputusan belum dijawab dan bukti luaran yang tiada.

Berikan ID serta cadangan khusus.

Jangan nyatakan sedia untuk pelaksanaan selagi kontrak wajib belum selesai.

Jangan tulis kod atau cipta migrasi.
```

## 11. Selesaikan keputusan teknikal

**Prompt untuk membentangkan kumpulan:**

```text
Bentangkan maksimum lima keputusan teknikal yang belum selesai.

Buang pendua dan keputusan yang sudah diluluskan.

Berikan ID, penjelasan mudah, cadangan lengkap, kesan pengguna dan halangan kerja.

Asingkan kontrak provider yang tidak tersedia daripada pilihan yang boleh saya jawab.

Semak kod Shell atau shared services yang dibenarkan jika membantu. Jangan anggap kod pengguna API membuktikan kontrak provider.

Jangan minta penerimaan atau penguncian reka bentuk yang belum lengkap.
```

**Prompt kelulusan:**

```text
Saya meluluskan pembetulan dan cadangan dalam proposal terakhir anda, tepat seperti yang ditulis.

Nyatakan ID yang diluluskan dan terapkan secara selaras dalam lima draf yang belum dikunci.

Tanya saya jika masih ada pilihan atau nilai yang diperlukan. Jangan mereka-reka kontrak, konfigurasi atau kelulusan manusia.

Bentangkan kumpulan bebas seterusnya.

Jangan tulis kod, cipta migrasi atau kunci dokumen.
```

Ulang sehingga keputusan berkaitan selesai.

## 12. Muktamadkan reka bentuk

**Prompt:**

```text
Muktamadkan lima draf menggunakan keputusan yang telah saya sahkan sahaja.

Buang alternatif yang digantikan dan penerangan bercanggah. Kekalkan sumber serta beza antara fakta sumber dan cadangan diluluskan.

Pastikan database.md mempunyai seksyen kelulusan manusia dengan:
reviewer, role, decision, reviewed schema revision, date dan approval scope.

Jika seksyen belum wujud, tambah medan kosong dengan decision PENDING.
Jika sudah mengandungi catatan manusia, kekalkan catatan tersebut tepat seperti sedia ada.

Jangan nyatakan medan kosong jika sudah diisi.

Jalankan semakan akhir. Asingkan halangan skema daripada kebergantungan pelaksanaan dan deployment.

Jika skema lengkap, nyatakan revision tepat yang diserahkan untuk semakan.

Jangan tulis kod, cipta migrasi atau kunci dokumen.
```

## 13. Semak dan isi kelulusan database sendiri

**Prompt:**

```text
Sahkan sama ada skema lengkap dan konkrit untuk penciptaan migrasi.

Jika belum lengkap, nyatakan perkara yang masih diperlukan dan berhenti.

Jika lengkap:
- Nyatakan revision skema tepat.
- Tunjukkan seksyen kelulusan.
- Kenal pasti medan kosong atau teks contoh.
- Terangkan nilai sebenar yang perlu saya isi sendiri.

Bezakan kelulusan penciptaan migrasi daripada pelaksanaannya.

Jika menggunakan fingerprint, tentukan kandungan skema yang diliputi dan asingkan rekod kelulusan supaya pengisian kelulusan tidak dianggap perubahan skema.

Jangan edit rekod kelulusan atau cipta migrasi.
```

Selepas membaca skema, buka `.docs/database.md` dalam editor dan isi sendiri:

| Medan                    | Nilai yang perlu anda isi                                              |
| ------------------------ | ---------------------------------------------------------------------- |
| Reviewer                 | Nama sebenar                                                           |
| Role                     | Kapasiti atau jawatan sebenar semasa semakan                           |
| Decision                 | Keputusan sebenar, contohnya `APPROVED`                                |
| Reviewed schema revision | Revision tepat yang disemak                                            |
| Date                     | Tarikh sebenar semakan                                                 |
| Approval scope           | Contohnya penciptaan fail migrasi sahaja; pelaksanaan belum diluluskan |

**Simpan fail. Jangan salin teks arahan contoh sebagai nilai.**

## 14. Sahkan sebelum penguncian

**Prompt:**

```text
Saya telah menyimpan rekod kelulusan manusia dan menerima reka bentuk yang diserahkan.

Sahkan:
- Skema dan keputusan wajib lengkap.
- Lima draf selaras.
- Kelulusan mengandungi nilai sebenar.
- Revision yang diluluskan sepadan dengan skema semasa.
- Tiada perubahan skema selepas kelulusan tanpa semakan baharu.

Asingkan kebergantungan provider yang masih menghalang fungsi tertentu.

Jika syarat penguncian tidak dipenuhi, jelaskan dan berhenti.
Jika dipenuhi, berikan arahan penguncian.

Jangan edit rekod kelulusan atau jalankan penguncian sendiri.
```

## 15. Kunci lima dokumen

**Hanya selepas semakan lulus, jalankan:**

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace

node scripts/maintenance.mjs check-docs
```

Selepas semakan berjaya:

```bash
node scripts/maintenance.mjs lock-doc scope
node scripts/maintenance.mjs lock-doc architecture
node scripts/maintenance.mjs lock-doc database
node scripts/maintenance.mjs lock-doc backend
node scripts/maintenance.mjs lock-doc frontend
node scripts/maintenance.mjs check-docs
```

Berhenti jika mana-mana arahan gagal. Lock tidak memberikan kelulusan database atau migrasi secara automatik. Jangan ulang lock pada dokumen yang sudah dikunci.

## 16. Pilih satu submodul dan laksanakan backend

### 16A. Tetapkan submodul semasa dan tooling

**Prompt:**

```text
Sediakan urutan pelaksanaan satu submodul pada satu masa daripada reka bentuk diterima dan dikunci.

Senaraikan submodul serta dependencies dan cadangkan satu submodul untuk dimulakan. Bagi submodul tersebut, senaraikan fungsi, tables, endpoints dan skrin yang termasuk serta shared infrastructure minimum yang diperlukan.

Semak tooling sedia ada:
- Frontend: ESLint dan Prettier.
- Java: Checkstyle atau lint/style tool standard repository, serta formatter Java seperti Spotless dengan formatter yang dipersetujui.

Jika tooling belum ada, cadangkan konfigurasi, versi dependency/plugin tepat dan commands check/fix. Gunakan standard pasukan yang tersedia; jangan pilih versi secara tekaan.

Nyatakan fail contoh ui-element/general-tab-crud tepat bagi setiap skrin submodul pertama. Mockup ialah draf fungsi, bukan visual akhir.

Jangan mulakan kod. Tunggu saya memilih submodul dan meluluskan tooling yang perlu ditambah.
```

### 16B. Luluskan dan laksanakan backend submodul dipilih

Hantar selepas agent menamakan **satu** submodul dan anda bersetuju. Jika anda mahu submodul lain, nyatakan IDnya secara jelas dalam jawapan.

**Prompt:**

```text
Saya meluluskan satu submodul yang anda cadangkan dalam respons terakhir serta konfigurasi tooling yang anda bentangkan.

Nyatakan semula ID submodul semasa. Kelulusan ini tidak meliputi pelaksanaan submodul lain.

Sahkan locks, hashes, kesediaan fungsi dan kelulusan skema dahulu.

Laksanakan backend submodul semasa sahaja: controllers, REST endpoints, forms, DTO, validation, authorization, services, repositories, transactions, audit dan outbox yang berkaitan.

Laksanakan shared infrastructure minimum yang diperlukan dan senaraikan penggunaannya. Jangan implement endpoint atau workflow submodul lain secara senyap.

Cipta migrasi hanya dalam skop skema diluluskan. Jelaskan dependencies FK dan sempadan migration. Jika skema penuh perlu diwujudkan sebagai prasyarat, bentangkan pilihan itu dahulu; jangan anggap kelulusan submodul ini membenarkan semua perubahan sekali gus.

Kekalkan Flyway aktif, Hibernate schema generation none dan SQL initialization never. Kekalkan bearer authentication serta pintasan local sahaja yang diluluskan.

Jangan reka kontrak provider yang belum tersedia. Laporkan adapter terhalang.

Pastikan JDK sepadan dengan sasaran projek. Jangan turunkan sasaran tanpa kelulusan.

Ikut konfigurasi lint/style dan formatter Java yang diluluskan. Format fail Java berkaitan, kemudian jalankan formatter check, lint/style check, kompilasi dan ujian bermakna yang tidak menyambung database atau menjalankan migrasi. Jangan format Java menggunakan Prettier frontend.

Jangan jalankan migrasi atau startup menggunakan database. Jangan ubah dokumen terkunci.

Laporkan checklist fungsi submodul semasa, fail berubah, commands dan hasil sebenar, serta baki kerja.

Berhenti selepas submodul ini. Jangan teruskan submodul lain tanpa kelulusan saya.
```

## 17. Laksanakan frontend submodul yang sama

**Prompt:**

```text
Saya meluluskan frontend untuk submodul semasa yang backendnya baru dilaksanakan sahaja. Nyatakan IDnya sebelum bekerja.

Ikut reka bentuk diterima dan dikunci. Jika reka bentuk bercanggah dengan arahan UI, jelaskan revision yang diperlukan sebelum mengedit kod.

Baca fail contoh ui-element/general-tab-crud tepat yang telah dipilih. Ikut struktur komponen, schema borang/jadual, tabs, modal, services dan helpers contoh tersebut. Gunakan @2enapps/ui. Jangan reka layout alternatif atau custom styling hanya untuk meniru mockup.

Mockup ialah draf keperluan fungsi, medan, tindakan dan aliran kerja. Jangan anggap ia spesifikasi visual akhir. Jangan salin dummy data atau training API ke fungsi domain.

Laksanakan skrin dan services submodul semasa sahaja. Sambungkan kepada kontrak backend sebenar. Senaraikan pemetaan skrin → fail contoh → komponen shared → endpoint.

Padankan exposes.js dengan import dan route Shell. Shell mengurus SSO dan pembaharuan token.

Sertakan loading, empty, validation, success, forbidden, errors dan version conflicts. Jangan gunakan kejayaan palsu.

Ikut konfigurasi ESLint dan Prettier yang diluluskan. Format fail berkaitan dan jalankan lint, format check serta build. Jangan disable rules atau reformat fail tidak berkaitan.

Jika contoh atau komponen tidak menyokong sesuatu interaction, laporkan jurang dan cadangkan penyelesaian sebelum membuat penyimpangan.

Jangan ubah dokumen terkunci atau jalankan startup/ujian integrasi tanpa pelan diluluskan.

Laporkan checklist skrin submodul semasa, mapping kepada contoh, fail berubah, commands check dan hasil sebenar serta baki integrasi.

Berhenti selepas submodul ini. Jangan teruskan submodul lain tanpa kelulusan saya.
```

### Commands lint dan format

Agent mesti menyediakan commands sebenar daripada package.json dan pom.xml. Contoh di bawah **hanya digunakan jika scripts/plugins tersebut telah dikonfigurasi dan diluluskan**; ia bukan bukti bahawa workspace semasa sudah mempunyai tooling tersebut.

Frontend, dari direktori frontend modul:

```bash
npm run lint
npm run format:check
npm run build
```

Jika pembetulan formatting diperlukan dan script wujud:

```bash
npm run format
npm run format:check
npm run lint
```

Script format/fix mesti dihadkan kepada fail berkaitan atau dilaksanakan sebelum terdapat perubahan luar skop; jangan menerima reformat seluruh repository secara automatik. Agent perlu menjelaskan sasaran script tersebut.

Java, dari direktori backend, jika Spotless dan Checkstyle telah dikonfigurasi:

```bash
mvn spotless:check
mvn checkstyle:check
mvn -DskipTests compile
```

Untuk pembetulan format Java yang disasarkan mengikut konfigurasi formatter:

```bash
mvn spotless:apply
mvn spotless:check
mvn checkstyle:check
```

Pastikan `spotless:apply` menyasarkan fail yang dibenarkan sahaja sebelum menjalankannya. Jika repository menggunakan formatter/linter lain atau Maven wrapper, gunakan commands sebenar tersebut. Ujian dengan database dan startup kekal memerlukan pelan pelaksanaan diluluskan.

### Semakan dan kelulusan submodul seterusnya

Selepas backend/frontend submodul semasa siap, gunakan langkah 19–21 untuk pelan dan ujian submodul itu. Jika runtime checks belum dapat dijalankan, rekodkan Blocked dan minta keputusan sebelum meneruskan; jangan dakwa submodul selesai sepenuhnya.

**Prompt penerimaan dan sambungan, hanya selepas membaca laporan:**

```text
Saya menerima hasil submodul yang baru diserahkan dengan status dan batasan yang telah dinyatakan.

Ringkaskan checklist fungsi, skrin, lint, formatting, build dan tests. Kekalkan perbezaan Pass, Fail, Blocked dan Not run.

Cadangkan satu submodul seterusnya dan dependencies minimum. Tunggu kelulusan saya sebelum implementasi.
```

Ulang langkah 16B–17 serta semakan/ujian bagi setiap submodul. Jangan tunggu semua submodul siap untuk membuat lint/format checks. Infrastruktur dan migrasi yang telah dilaksanakan tidak ditulis semula pada pusingan seterusnya. Selepas semua submodul selesai, jalankan semakan integrasi merentas submodul melalui pelan yang diluluskan sebelum manual dan penerimaan akhir.

## 18. Jika reka bentuk terkunci perlu dibetulkan

Gunakan langkah ini **hanya apabila pembetulan tertentu telah dicadangkan dan anda meluluskannya**.

**Prompt dahulu:**

```text
Jelaskan pembetulan reka bentuk yang diperlukan.

Nyatakan dokumen tepat yang perlu dibuka, perubahan yang dicadangkan dan sama ada skema atau kelulusan terdahulu terjejas.

Berikan arahan membuka dokumen tersebut sahaja. Jangan ubah manifest sendiri.
```

Contoh skrip berikut membuka **scope, backend dan frontend sahaja**. Gunakan hanya jika itulah dokumen yang diluluskan untuk dibuka:

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace

node scripts/maintenance.mjs check-docs
```

Selepas semakan berjaya:

```bash
node --input-type=module <<'NODE'
import { readFile, writeFile } from 'node:fs/promises';

const path = 'document-integrity.json';
const hashes = JSON.parse(await readFile(path, 'utf8'));
const documents = [
  '.docs/scope.md',
  '.docs/backend.md',
  '.docs/frontend.md'
];

for (const document of documents) {
  if (!Object.hasOwn(hashes, document)) {
    throw new Error(`${document} tidak dikunci; manifest tidak diubah.`);
  }
}

for (const document of documents) {
  delete hashes[document];
}

await writeFile(path, JSON.stringify(hashes, null, 2) + '\n');

for (const document of documents) {
  console.log(`${document}: dibuka semula`);
}
NODE

node scripts/maintenance.mjs check-docs
```

**Prompt selepas membuka:**

```text
Saya telah membuka dokumen yang dipersetujui dan meluluskan pembetulan khusus dalam proposal terakhir anda.

Sahkan dokumen terbuka, terapkan pembetulan dan semak keselarasan.

Kekalkan dokumen lain serta rekod kelulusan manusia.

Jika skema berubah, nyatakan revision baharu untuk semakan manusia; jangan anggap kelulusan lama meliputinya.

Berikan arahan penguncian semula selepas semakan lulus. Jangan jalankan sendiri.
```

Selepas pembetulan diterima, kunci semula dokumen yang dibuka menggunakan `lock-doc`.

## 19. Sediakan pelan migrasi, startup dan ujian

**Prompt:**

```text
Saya meluluskan penyediaan .docs/testing.md yang belum dikunci.

Untuk pusingan semasa, fokus submodul yang dipilih dan dependenciesnya. Selepas semua submodul siap, sediakan pusingan integrasi merentas submodul. Jangan implement submodul lain dalam fasa ujian.

Bandingkan migrasi dengan skema diluluskan. Sahkan lint frontend, Prettier, lint/style Java dan formatter Java telah dijalankan; sertakan commands serta hasil sebenar.

Bentangkan:
- Fail migrasi tepat dan checksum.
- Environment, database host, port, name dan schema.
- Database roles.
- Arahan migration dan startup.
- Arahan backend/API serta Playwright tests.
- Akaun, permissions dan services diperlukan.
- Hasil dijangka dan lokasi evidence.
- Langkah pemulihan.

Liputi workflows, validation, object access, duplicates, concurrency dan integration failures.

Kenal pasti prasyarat belum tersedia.
Jangan dedahkan credentials.

Jangan jalankan migrasi, startup atau pelan ujian ini lagi.
Jangan tandakan ujian belum dijalankan sebagai lulus.
```

Arahan Maven, frontend, Shell dan Flyway mesti ditentukan daripada projek serta sasaran sebenar—bukan diteka dalam panduan ini.

## 20. Luluskan dan jalankan pelan sebenar

**Prompt selepas menyemak sasaran dan arahan:**

```text
Saya meluluskan fail migrasi, checksum, environment, database sasaran, startup dan test commands dalam pelan terakhir anda.

Kelulusan hanya meliputi pelan tersebut.

Semak checksum dan sasaran sebelum pelaksanaan.
Jika fail berubah atau prasyarat belum selesai, berhenti dan jelaskan.

Jika lengkap, jalankan hanya pelan diluluskan.

Simpan bukti dalam evidence/.
Laporkan Pass, Fail, Blocked dan Not run dengan tepat.

Jangan deploy atau ubah reka bentuk terkunci.
```

## 21. Cadangkan dan laksanakan pembetulan ujian

**Prompt cadangan:**

```text
Semak failed tests dan runtime evidence.

Nyatakan punca, fungsi dan fail terjejas, pembetulan konkrit serta ujian semula.

Nyatakan sama ada reka bentuk atau skema berubah.

Bentangkan pembetulan sebelum mengedit.
Jangan unlock sendiri atau tulis semula migrasi yang telah dijalankan.
```

**Prompt kelulusan:**

```text
Saya meluluskan pembetulan khusus dalam proposal terakhir anda.

Laksanakan pembetulan tersebut sahaja dan ulang semakan berkaitan yang diluluskan.

Jika dokumen terkunci atau skema perlu berubah, berhenti untuk proses revision dan kelulusan dahulu.

Jangan jalankan migrasi baharu tanpa kelulusan execution.

Jalankan semula lint, format check, build dan ujian terjejas bagi bahasa/fail yang berubah. Jangan teruskan submodul lain dalam pembetulan ini.

Simpan bukti dan laporkan baki isu.
```

Ulang sehingga semakan wajib lulus atau batasan diterima secara jelas.

## 22. Sediakan manual pengguna

**Prompt:**

```text
Saya meluluskan penyediaan .docs/usermanual.md daripada pelaksanaan yang disahkan.

Susun mengikut peranan dan submodul.
Terangkan navigation, fields, actions, statuses, uploads/downloads dan mesej lazim.

Gunakan screenshots sebenar daripada aplikasi berjalan yang dibenarkan. Lindungi maklumat sensitif.

Jangan gambarkan fungsi belum siap atau belum disahkan sebagai tersedia.

Serahkan manual, keputusan ujian akhir dan batasan untuk semakan.
Jangan deploy.
```

## 23. Terima dan kunci testing serta manual

**Prompt selepas membaca dokumen:**

```text
Saya menerima testing.md dan usermanual.md yang diserahkan.

Sahkan kedua-duanya menggambarkan bukti serta fungsi sebenar, termasuk batasan.

Jika sesuai dikunci, berikan arahan penguncian.
Jangan jalankan sendiri.
```

**Selepas semakan lulus, jalankan:**

```bash
cd /home/lqmnwido/Projects/dreams/memorial-workspace

node scripts/maintenance.mjs lock-doc testing
node scripts/maintenance.mjs lock-doc usermanual
node scripts/maintenance.mjs check-docs
```

## 24. Sediakan rekod PRD

**Prompt:**

```text
Sediakan cadangan entri .docs/PRD.md:
- Fungsi siap.
- Keputusan disahkan.
- Sumber dan versi.
- Revision skema diluluskan.
- Fail berubah.
- Bukti lint, formatting, build dan ujian bagi setiap submodul.
- Penerimaan dan locks.
- Kecacatan, batasan dan next steps.

Bezakan design, implementation dan runtime verification.

Future agents perlu menggunakan rekod serta draf lengkap tanpa mengulang source review kecuali revision dibenarkan memerlukannya.

Tunjukkan entri sebelum menulis.
Jangan reka kelulusan.
```

**Prompt selepas bersetuju:**

```text
Saya meluluskan entri PRD dalam respons terakhir anda.

Tulis entri tersebut tepat seperti diluluskan ke .docs/PRD.md.

Laporkan status akhir dan outstanding work.
Jangan deploy.
```

## 25. Jika mahu deployment

Pembangunan selesai tidak bermaksud deployment telah diluluskan.

**Prompt pelan deployment:**

```text
Sediakan pelan deployment untuk versi aplikasi yang telah disahkan.

Nyatakan:
- Commit atau artifact tepat.
- Environment dan server sasaran.
- Konfigurasi serta secret references.
- Database target dan migrasi tambahan jika ada.
- Build, release dan startup commands.
- Integrasi Shell/remote/API.
- Backup, recovery dan rollback.
- Health checks dan ujian selepas deployment.
- Risiko serta prasyarat belum selesai.

Jangan deploy, ubah server atau jalankan migrasi.
Bentangkan pelan untuk kelulusan saya dahulu.
```

**Prompt pelaksanaan selepas pelan lengkap dan disemak:**

```text
Saya meluluskan pelan deployment terakhir anda untuk artifact, environment, server, database dan commands yang dinyatakan.

Jika mana-mana sasaran, artifact atau prerequisite berubah, berhenti sebelum pelaksanaan.

Jalankan hanya pelan yang diluluskan.
Simpan deployment evidence dan laporkan health checks, failures serta recovery yang dilakukan.

Jangan tambah perubahan atau sasaran lain.
```

Jika semua deployment checks lulus, minta agent mencadangkan kemas kini PRD dan luluskan entri tersebut sebelum ditulis.
