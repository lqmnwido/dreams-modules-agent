# Prompt aliran kerja D-ReAMS — Bahasa Melayu

Gunakan satu prompt pada satu masa. Tukar nama/kod modul, path dan pengisytiharan sumber mengikut modul sebenar; jangan guna peraturan perniagaan M12 untuk modul lain. Kelulusan hanya meliputi proposal konkrit sebelumnya yang telah anda baca. Lihat [guide.md](guide.md) untuk pemasangan, skrip penguncian/pembukaan semula dan commands lint/format bersyarat.

Laksanakan satu submodul dipilih sahaja: backend → frontend → semakan/ujian → review → kelulusan submodul seterusnya. Shared prerequisites mesti terhad dan dijelaskan. Mockup ialah draf keperluan fungsi, bukan visual akhir; ikut contoh ui-element/general-tab-crud tepat menggunakan @2enapps/ui. Frontend menggunakan ESLint/Prettier; Java menggunakan lint/style dan formatter Java yang diluluskan. Perubahan reka bentuk terkunci masih memerlukan pembukaan semula oleh manusia.

### 1. Kenal pasti modul dan sumber rasmi

Prompt:

Baca AGENTS.md, .docs/PRD.md dan module.config.json.

Kenal pasti nama dan kod modul serta dokumen SRS, SDS dan mockup yang tersedia dalam .docs/documents/.

Senaraikan versi dokumen dan folder mockup yang dicadangkan sebagai rujukan rasmi. Minta saya mengesahkan sumber rasmi sebelum semakan kandungan.

Jangan gunakan keperluan modul lain. Jangan anggap SRS tersedia jika failnya tiada.

Jika semakan sumber telah selesai dan direkodkan dengan mencukupi, gunakan hasil tersebut tanpa mengulangi keseluruhan semakan.

Jangan ubah fail, jana kod atau cipta migrasi dahulu.

Penjelasan:
Ejen menentukan modul dan meminta anda mengesahkan sumber yang betul.

### 2. Semak sumber dan sediakan draf skop

Prompt:

Saya mengesahkan sumber rasmi yang dicadangkan dalam jawapan anda yang terakhir dan meluluskan penyediaan draf .docs/scope.md yang belum dikunci.

Baca sumber tersebut jika semakan belum selesai. Jika hasil semakan terdahulu tidak mencukupi, saya membenarkan pembacaan semula bahagian yang diperlukan.

Mockup ialah draf keperluan fungsi, medan dan aliran kerja, bukan spesifikasi visual akhir. Struktur UI pelaksanaan mengikut contoh ui-element yang dipilih dan @2enapps/ui.

Rekodkan submodul, fungsi, aktor, medan, validasi, aliran kerja dan kebenaran akses yang ditetapkan oleh sumber. Sertakan nama fail, versi dan seksyen rujukan.

Jangan tandakan fakta yang jelas dalam sumber sebagai TBD. Jangan mereka-reka peraturan yang tiada.

Bezakan keperluan sumber daripada cadangan anda. Rekodkan konflik dan maklumat yang belum ditentukan.

Simpan hasil semakan dalam draf skop supaya sesi seterusnya tidak perlu mengulangi semakan penuh. Jangan jana kod atau migrasi.

Penjelasan:
Hantar hanya jika anda bersetuju dengan sumber yang dicadangkan. Ejen kemudian menyediakan skop berdasarkan keperluan sebenar.

### 3. Bentangkan keputusan skop yang belum selesai

Prompt:

Semak keputusan yang belum selesai dalam draf skop.

Gabungkan soalan yang berulang. Jangan tanya semula perkara yang sudah jelas dalam sumber atau telah saya sahkan.

Bentangkan maksimum lima keputusan pada satu masa. Untuk setiap keputusan:

- Terangkan soalan dengan bahasa mudah.
- Berikan satu cadangan jawapan yang khusus.
- Jelaskan kesannya kepada pengguna.
- Nyatakan nilai atau maklumat tambahan yang diperlukan.
- Nyatakan kerja yang terhalang dan sama ada fungsi tersebut boleh ditangguhkan.

Tunggu jawapan saya sebelum membentangkan kumpulan seterusnya.

Penjelasan:
Anda menjawab soalan dalam kumpulan kecil.

### 4. Sahkan satu kumpulan keputusan skop

Prompt:

Saya meluluskan cadangan dalam kumpulan keputusan skop yang anda bentangkan dalam jawapan terakhir, tepat seperti yang ditulis.

Jika sesuatu cadangan masih memerlukan nilai khusus atau maklumat luar, tanya saya secara langsung sebelum menandakannya selesai.

Kemas kini keputusan yang telah lengkap dalam .docs/scope.md yang belum dikunci. Jangan tandakan perkara yang belum dijawab sebagai diluluskan.

Kemudian bentangkan kumpulan seterusnya, atau laporkan bahawa semua keputusan skop yang menghalang kerja telah selesai.

Penjelasan:
Gunakan hanya jika anda bersetuju dengan seluruh kumpulan. Jika tidak, jawab soalan tersebut secara individu. Ulang sehingga selesai.

### 5. Semak kesediaan skop

Prompt:

Semak sama ada .docs/scope.md sudah bersedia untuk reka bentuk dan pelaksanaan.

Pastikan submodul, fungsi, aktor, medan, validasi, aliran kerja dan kebenaran akses adalah konkrit.

Kenal pasti keputusan belum selesai yang menghalang kerja. Cadangkan penyelesaian tanpa mereka-reka jawapan.

Jika masih ada halangan, berhenti dan minta keputusan saya. Jika tiada, bentangkan skop lengkap untuk penerimaan saya.

Jangan kunci dokumen atau rekodkan penerimaan bagi pihak saya.

Penjelasan:
Teruskan hanya apabila tiada keputusan skop yang menghalang reka bentuk.

### 6. Sediakan reka bentuk teknikal

Prompt:

Saya menerima skop yang lengkap dan meluluskan penyediaan draf teknikal yang belum dikunci:

- .docs/architecture.md
- .docs/database.md
- .docs/backend.md
- .docs/frontend.md

Sediakan reka bentuk konkrit:

Architecture:
Sempadan modul, integrasi Shell, SSO, konfigurasi dan deployment.

Database:
Jadual PostgreSQL sebenar, kolum, jenis data, nullability, default, primary key, foreign key, hubungan, constraints, indexes, audit dan peraturan pemadaman.

Backend:
Controller, service, form, endpoint REST, medan request/response, validasi, ralat, transaksi dan kebenaran akses.

Frontend:
Skrin, medan, tindakan, service, exposes.js dan route Shell menggunakan @2enapps/ui serta contoh ui-element/general-tab-crud yang tepat. Nyatakan fail rujukan dan pemetaan komponen, schema, helpers serta layout setiap skrin. Mockup bukan visual akhir.

Tangani pagination, pencegahan N+1, kemas kini serentak dan kegagalan integrasi.

Gunakan skop lengkap dan rujukan yang telah direkodkan. Jangan gantikan reka bentuk sebenar dengan prinsip umum sahaja.

Bentangkan cadangan yang masih memerlukan keputusan secara berasingan. Jangan jana kod atau migrasi.

Penjelasan:
Ejen menyediakan reka bentuk sebenar untuk database, API dan skrin.

### 7. Semak keselarasan reka bentuk

Prompt:

Semak scope, architecture, database, backend dan frontend sebagai satu reka bentuk.

Untuk setiap fungsi yang termasuk dalam skop, pastikan:

- Data mempunyai tempat simpanan yang konkrit.
- Request, response dan kebenaran API ditentukan.
- Skrin dan service menggunakan API yang sepadan.
- Setiap skrin mengikuti fail contoh ui-element tepat dan komponen shared yang dipilih.
- Medan, validasi, status dan ralat adalah konsisten.
- Hubungan data, indexes dan transaksi adalah selaras.

Asingkan pembetulan konkrit daripada keputusan yang belum selesai. Terangkan masalah dengan mudah dan cadangkan penyelesaian khusus.

Jangan nyatakan reka bentuk bersedia untuk pelaksanaan jika kontrak penting masih belum ditentukan. Jangan jana kod atau migrasi.

Penjelasan:
Ini mengesan percanggahan sebelum kod ditulis.

### 8. Bentangkan keputusan teknikal

Prompt:

Gabungkan pembetulan dan cadangan teknikal daripada semakan anda.

Buang perkara berulang dan kenal pasti perkara yang telah diluluskan.

Bentangkan maksimum lima keputusan belum selesai pada satu masa. Berikan satu cadangan khusus, kesannya dan maklumat tambahan yang diperlukan.

Bezakan maklumat yang diperlukan sebelum pelaksanaan daripada konfigurasi persekitaran yang boleh diberikan sebelum ujian integrasi.

Tunggu jawapan saya. Jangan minta saya menerima atau mengunci reka bentuk yang belum lengkap.

Penjelasan:
Ejen membantu anda membuat keputusan teknikal dalam kumpulan kecil.

### 9. Luluskan pembetulan atau keputusan teknikal

Prompt:

Saya meluluskan pembetulan konkrit dan cadangan dalam jawapan anda yang terakhir, tepat seperti yang ditulis.

Terapkan keputusan tersebut secara konsisten pada draf scope, architecture, database, backend dan frontend yang belum dikunci.

Jika masih ada nilai atau pilihan yang belum dijawab, tanya saya sebelum menandakannya selesai.

Jangan mereka-reka kelulusan atau konfigurasi luar.

Bentangkan kumpulan seterusnya, atau laporkan bahawa semua halangan pelaksanaan telah selesai. Jangan jana kod, migrasi atau kunci dokumen.

Penjelasan:
Gunakan selepas membaca dan bersetuju dengan cadangan tersebut. Ulang jika masih ada keputusan lain.

### 10. Muktamadkan reka bentuk

Prompt:

Saya meluluskan pemuktamadan draf reka bentuk berdasarkan keputusan yang telah saya sahkan secara jelas.

Tetapkan jadual, constraints, indexes, payload API, kebenaran, status dan pemetaan frontend untuk skop pelaksanaan yang dipersetujui.

Buang alternatif lama dan definisi yang bercanggah. Nyatakan perkara yang benar-benar belum selesai.

Kekalkan rujukan sumber dan bezakan keperluan sumber daripada cadangan yang diluluskan.

Jika seksyen kelulusan manusia belum wujud, tambah reviewer, role, decision, reviewed schema revision, date dan approval scope yang kosong dengan decision PENDING. Jika sudah diisi manusia, kekalkan semua nilai tepat seperti sedia ada; jangan reset kelulusan. Betulkan penerangan yang bercanggah tanpa mengubah jadual manusia.

Jalankan semakan keselarasan terakhir. Jika ada halangan, terangkan dan berhenti. Jika tiada, nyatakan revision schema yang dimuktamadkan.

Jangan jana kod, migrasi atau kunci dokumen.

Penjelasan:
Hasilnya ialah satu reka bentuk yang lengkap untuk semakan manusia.

### 11. Terangkan cara merekodkan kelulusan database

Prompt:

Pastikan draf database mempunyai schema konkrit dan lengkap untuk penciptaan migrasi.

Jika belum lengkap, terangkan perkara yang masih diperlukan dan berhenti.

Jika lengkap, nyatakan revision tepat dan tunjukkan seksyen kelulusan manusia. Kenal pasti teks contoh atau medan tidak lengkap. Jika menggunakan fingerprint, asingkan kandungan skema daripada seksyen kelulusan yang boleh diisi manusia.

Terangkan nilai sebenar yang perlu saya isi sendiri: reviewer, role sebenar, decision, revision tepat yang disemak, tarikh semakan sebenar dan approval scope. Jangan cadangkan menyalin teks arahan contoh ke dalam medan.

Bezakan kelulusan mencipta migrasi daripada kelulusan menjalankannya.

Jangan isi APPROVED bagi pihak saya. Jangan cipta atau jalankan migrasi.

Penjelasan:
Anda menyemak schema dan mengisi rekod kelulusan dengan maklumat sebenar. Prompt sahaja tidak merekodkan kelulusan.

### 12. Sahkan kelulusan dan berikan arahan mengunci

Prompt:

Saya menerima reka bentuk yang dimuktamadkan.

Sahkan bahawa:

- Tiada keputusan belum selesai yang menghalang skop pelaksanaan.
- Kontrak database, API dan frontend adalah konkrit dan konsisten.
- Kelulusan database mengandungi nama/peranan sebenar, keputusan, revision tepat, tarikh dan skop; bukan teks contoh.
- Revision yang diluluskan sepadan dengan skema semasa; tiada perubahan skema selepas kelulusan tanpa review baharu.

Jangan anggap APPROVED sahaja mencukupi. Asingkan halangan skema daripada kebergantungan provider/deployment.

Jika mana-mana semakan gagal, terangkan dan jangan cadangkan penguncian.

Jika semua lulus, berikan arahan untuk mengunci scope, architecture, database, backend dan frontend. Jangan jalankan arahan tersebut sendiri.

Penjelasan:
Jalankan arahan penguncian sendiri selepas semua semakan lulus.

### 13. Pilih satu submodul dan tooling

Prompt:

Sebelum implementasi, cadangkan urutan submodul daripada reka bentuk diterima dan satu submodul untuk dimulakan. Nyatakan ID, fungsi, tables, endpoints, skrin dan shared prerequisites minimum.

Semak konfigurasi frontend ESLint/Prettier serta lint/style dan formatter Java. Gunakan standard sedia ada. Jika belum tersedia, cadangkan versi dependency/plugin tepat, konfigurasi, sasaran fail dan commands check/fix untuk kelulusan; jangan install dahulu. Java menggunakan formatter Java, bukan Prettier frontend.

Baca contoh ui-element/general-tab-crud tepat dan bentangkan pemetaan skrin → fail rujukan → komponen/helper shared → API. Mockup ialah draf fungsi, bukan visual akhir. Jangan salin dummy data, raw controls legacy atau CSS tidak diluluskan.

Tunggu pilihan submodul dan kelulusan tooling saya. Jangan implement semua submodul, cipta migrasi atau ubah dokumen terkunci.

Penjelasan: Pilih satu unit pelaksanaan dan tooling sebelum kod.

### 14. Laksanakan backend

Prompt:

Saya meluluskan backend satu submodul dan tooling yang anda cadangkan dalam respons terakhir. Nyatakan ID submodul; kelulusan ini tidak meliputi submodul lain.

Sahkan locks/hashes, kesediaan submodul dan rekod kelulusan skema terlebih dahulu.

Laksanakan controllers, endpoints, forms/DTO, validasi, authorization, services, repositories, transaksi, audit dan outbox submodul tersebut sahaja. Hadkan shared infrastructure kepada prerequisites yang disenaraikan; jangan implement submodul lain di situ.

Cipta migrasi hanya dalam skop kelulusan skema. Jelaskan dependencies FK; jika penciptaan seluruh skema diperlukan sebagai prerequisite, bentangkan pelan lebih luas itu dahulu. Jangan tulis semula migrasi yang telah dijalankan.

Kekalkan Flyway aktif, Hibernate generation dan SQL initialization dimatikan, bearer authentication aktif secara default serta bypass local sahaja yang diluluskan. Jangan reka kontrak provider atau adapter berjaya palsu.

Kekalkan sasaran Java diluluskan. Gunakan lint/style dan formatter Java diluluskan, format fail berubah yang dibenarkan sahaja, kemudian jalankan format check, lint/style check, compile dan ujian bermakna tanpa database/migrasi. Jangan guna Prettier frontend untuk Java atau disable rules untuk menyembunyikan failures.

Jangan jalankan migrasi atau startup terhadap database. Jangan ubah dokumen terkunci; nyatakan jika revision diperlukan.

Laporkan checklist fungsi submodul, fail berubah/baharu, commands dan hasil lint/format/build/tests sebenar serta blockers. Berhenti untuk review; jangan teruskan submodul seterusnya.

Penjelasan: Laksanakan satu backend submodul dengan semakan Java dan tanpa migration execution.

### 15. Laksanakan frontend

Prompt:

Saya meluluskan frontend submodul semasa yang backendnya baru diserahkan sahaja. Nyatakan ID sebelum bekerja.

Gunakan reka bentuk diterima dan dikunci. Baca contoh ui-element/general-tab-crud tepat dan ikut struktur halaman/komponen, schema, tabs, modals, validasi, services/helpers dan styles shared menggunakan @2enapps/ui.

Mockup ialah draf fungsi, bukan visual akhir. Jangan reka layout atau CSS untuk menirunya atau salin dummy data/training API. Jika contoh/komponen tidak menyokong interaction wajib, bentangkan pengecualian khusus sebelum menyimpang. Jika reka bentuk terkunci bercanggah, minta revision dahulu.

Laksanakan skrin/services submodul semasa sahaja dengan REST sebenar. Padankan exposes.js dan import/routes Shell; Shell mengurus SSO dan refresh. Sediakan loading, empty, success, validation, forbidden, errors dan version conflicts tanpa kejayaan palsu.

Gunakan ESLint/Prettier diluluskan. Format fail berubah yang dibenarkan sahaja dan jalankan lint, format check dan build. Semak sasaran script sebelum fix/write; jangan reformat seluruh repository atau disable rules.

Laporkan pemetaan skrin → fail contoh → komponen/helper shared → API, checklist skrin/fungsi, fail, commands/results dan integration blockers. Jangan startup atau integration tests tanpa pelan diluluskan. Berhenti; jangan implement submodul lain.

Selepas semakan/ujian dan review submodul semasa, cadangkan submodul seterusnya dan tunggu kelulusan. Ulang kitaran backend/frontend/tests bagi setiap submodul; bukti runtime tiada kekal Blocked/Not run. Selepas semua submodul, sediakan cross-submodule integration tests.

Penjelasan: Ikut contoh shared UI tepat untuk satu submodul dan berhenti bagi review.

### 16. Sediakan pelan pelaksanaan dan ujian

Prompt:

Saya meluluskan penyediaan .docs/testing.md yang belum dikunci.

Sediakan ujian backend/API dan frontend/Playwright secara berasingan. Liputi fungsi, permissions, object access, validasi, workflow, duplikasi, concurrency dan kegagalan integrasi.

Fokus pelan ini pada submodul semasa dan dependenciesnya. Selepas semua submodul siap, sediakan pusingan integrasi merentas submodul.

Bandingkan fail migrasi dengan schema diluluskan. Sertakan hasil sebenar ESLint/Prettier frontend serta lint/formatter/build Java dan tooling yang masih tiada.

Bentangkan fail migrasi tepat serta checksum, environment, host/port/nama/schema database, arahan startup/ujian, akaun, service, hasil dijangka, lokasi bukti dan langkah pemulihan.

Jangan jalankan migrasi, hidupkan aplikasi atau jalankan ujian dahulu. Nyatakan prasyarat yang belum dijawab.

Penjelasan:
Anda menerima pelan sebenar sebelum database disentuh.

### 17. Luluskan dan jalankan pelan

Prompt:

Saya meluluskan fail migrasi, checksum, environment, target database, arahan startup dan arahan ujian tepat dalam pelan yang anda bentangkan dalam jawapan terakhir.

Jika pelan masih mempunyai target tidak diketahui atau prasyarat belum dijawab, berhenti dan minta saya menyelesaikannya sebelum pelaksanaan.

Jika lengkap, jalankan pelan yang diluluskan sahaja. Simpan bukti sebenar dalam evidence/.

Laporkan ujian lulus, gagal, terhalang dan belum dijalankan dengan tepat. Jangan deploy atau ubah reka bentuk yang dikunci.

Penjelasan:
Hantar hanya selepas memastikan pelan menggunakan database dan arahan yang betul.

### 18. Cadangkan pembetulan kecacatan

Prompt:

Semak ujian gagal dan bukti runtime sebenar.

Untuk setiap kecacatan, terangkan punca, fail terlibat, cadangan pembetulan dan sama ada reka bentuk yang diterima perlu berubah.

Bentangkan pembetulan untuk kelulusan sebelum mengubah fail.

Jika draf yang dikunci perlu disemak semula, nyatakan dokumen tersebut dan cara saya membukanya semula. Jangan buka kunci sendiri.

Penjelasan:
Ejen mencadangkan pembetulan berdasarkan bukti.

### 19. Terapkan pembetulan dan uji semula

Prompt:

Saya meluluskan pembetulan khusus dalam cadangan anda yang terakhir.

Laksanakan pembetulan tersebut dan jalankan semula semakan yang terjejas. Jangan tambah perubahan yang tidak berkaitan.

Jika pembetulan memerlukan dokumen dikunci dibuka semula, tunggu sehingga saya membukanya.

Jika skema berubah, dapatkan review/kelulusan terhadap revision baharu sebelum migrasi baharu; execution memerlukan kelulusan berasingan. Jangan tulis semula migrasi dilaksanakan.

Ulang lint, format check, build dan ujian terjejas bagi fail/bahasa berubah. Jangan implement submodul lain. Simpan bukti sebenar dan laporkan kegagalan, ujian terhalang serta batasan.

Penjelasan:
Ulang Prompt 18–19 sehingga semakan wajib lulus atau anda menerima risiko yang masih ada secara jelas.

### 20. Sediakan manual pengguna

Prompt:

Saya meluluskan penyediaan .docs/usermanual.md berdasarkan pelaksanaan yang telah disahkan.

Susun mengikut role dan submodul. Terangkan navigasi, medan, tindakan, status, upload/download dan mesej biasa.

Gunakan screenshot sebenar daripada aplikasi yang berjalan dan sembunyikan maklumat sensitif.

Jangan terangkan fungsi belum dilaksanakan sebagai tersedia.

Bentangkan manual, keputusan pengesahan terakhir dan batasan untuk penerimaan saya. Jangan deploy.

Penjelasan:
Manual mesti menggambarkan aplikasi sebenar yang telah diuji.

### 21. Cadangkan rekod penyelenggaraan PRD

Prompt:

Sediakan cadangan kemas kini .docs/PRD.md yang ringkas.

Sertakan:

- Fungsi yang selesai.
- Keputusan penting yang disahkan.
- Versi sumber dan mockup rasmi yang disemak.
- Fail yang berubah.
- Bukti lint, formatting, build dan tests sebenar bagi setiap submodul.
- Kecacatan, batasan dan langkah seterusnya.
- Status penyediaan serta penerimaan draf.

Ejen seterusnya perlu menggunakan PRD dan draf lengkap tanpa membaca semula sumber asal, kecuali saya meminta semakan.

Tunjukkan cadangan sebelum menulisnya. Jangan mereka-reka kelulusan atau penerimaan manusia.

Penjelasan:
PRD menjadi rekod ringkas untuk penyelenggaraan seterusnya.

### 22. Simpan rekod yang diluluskan dan tamatkan kerja

Prompt:

Saya meluluskan cadangan rekod PRD dalam jawapan anda yang terakhir. Tulis rekod tersebut dalam .docs/PRD.md.

Sahkan penerimaan manusia sebenar terhadap testing dan usermanual sebelum memberi arahan penguncian. Jika penerimaan tiada, nyatakannya. Jangan jalankan penguncian sendiri. Berikan arahan untuk draf yang diterima sahaja. Laporkan baki kerja dan penerimaan manusia yang masih diperlukan.

Jangan deploy. Deployment memerlukan pelan dan kelulusan berasingan.

Penjelasan:
Ejen menyimpan rekod yang diluluskan. Anda mengunci draf terakhir selepas menerimanya.
