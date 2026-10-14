# D-ReAMS — seni bina bersama

Standard bersama untuk setiap modul. Keperluan perniagaan modul berada dalam SCOPE.md, bukan dalam dokumen ini.

## Sempadan sistem

- Setiap modul mempunyai backend dan **database PostgreSQL sendiri**. Hanya backend/worker modul pemilik dan proses migrasinya boleh mengakses database itu.
- Modul lain mengakses data melalui API modul pemilik. Tiada credentials database dikongsi, cross-database queries/joins/FKs, repository atau entity yang mengakses database modul lain.
- Database berasingan bermaksud database milik modul, bukan sekadar menamakan schema berlainan dalam satu database berkongsi. Penempatan server fizikal ditentukan deployment.
- UI menggunakan Vue MFE. Shell memuat remote frontend melalui Module Federation (`remoteEntry.js`/exposes). API HTTP/REST membawa data perniagaan; ia berbeza daripada remote frontend.
- Shell mengurus side menu, navbar, layout aplikasi, login/logout, SSO, token refresh dan route guards. Modul tidak membina login/SSO atau chrome Shell sendiri.
- `@2enapps/ui` membekalkan komponen, helpers dan styles. Dependency Kai ialah `git+https://kai.2enapps.my/d-reams/frontend/ui.git#develop`.
- Service frontend menggunakan transport modul dan credentials daripada host apabila berintegrasi. Backend tetap mengesahkan token dan kebenaran rekod; menu tersembunyi bukan kawalan keselamatan.

```text
Shell ──Module Federation──> {module}_fe remote
                              │ REST API
                              ▼
                         {module}_be ──> database modul sendiri
                              │ API sahaja
                              ▼
                         backend modul lain ──> database miliknya
```

## Workspace

```text
workspace/
├── AGENTS.md
├── .docs/
│   ├── PRD.md
│   ├── SCOPE.md
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── DATABASE.md
│   ├── FRONTEND.md
│   ├── TESTING.md
│   ├── USERMANUAL.md
│   └── documents/
├── module.config.json
├── document-integrity.json
├── scripts/maintenance.mjs
├── evidence/
├── {module}_fe/
├── {module}_be/
└── shell/
```

## Frontend

```text
{module}_fe/
├── package.json
├── exposes.js                 # satu kontrak federation
├── vue.config.js              # federation/publicPath/singletons
├── .env.local
├── .env.example
├── CRUD-REFERENCE.md
└── src/
    ├── remote-entry.js
    ├── metadata.js
    ├── services/
    │   ├── {module}/
    │   │   ├── http.js
    │   │   └── {submodule}/index.js
    │   └── training/
    └── views/
        ├── {submodule}/interface.vue
        └── ui-element/
```

Shell dimuatkan hanya pada integrasi selepas prototaip standalone diterima. Harness standalone ialah dev/test sahaja; jangan membina Shell kedua. Jika harness memerlukan perubahan scaffold, tanya dahulu; scaffold tidak boleh diubah dalam kerja ini.

## Backend

Contoh package `com.dreams.memorial`; nama dan package sebenar mengikuti konfigurasi modul.

```text
memorial_be/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/dreams/memorial/
    │   │   ├── MemorialApplication.java
    │   │   ├── config/
    │   │   ├── security/
    │   │   ├── common/
    │   │   ├── entity/
    │   │   ├── repository/
    │   │   ├── form/{submodule}/
    │   │   ├── service/{submodule}/
    │   │   └── controller/{submodule}/
    │   └── resources/
    │       ├── application.properties
    │       └── db/migration/   # Flyway; database modul sendiri
    └── test/java/com/dreams/memorial/
```

Spring Boot, Java 25 dan PostgreSQL. Controller → service → repository → entity/database sendiri. Transaksi dalam service; repository untuk data access. Satu entity bagi setiap table; controller/service/form dikelompokkan mengikut submodul. `common/` hanya infrastruktur benar-benar bersama dalam modul.

## Rujukan UI wajib

| Tujuan | Rujukan |
| --- | --- |
| CRUD senarai → details | `src/views/ui-element/general-tab-crud/list-main.vue` |
| Tabs dan anak | `tab.vue`, `details-one.vue` hingga `details-four.vue`, `list-two.vue` hingga `list-five.vue` dalam folder sama |
| Enjin table | `@2enapps/ui` → `components/dynamic-form/generated-form/list-data.vue` |
| Enjin form | `@2enapps/ui` → `components/dynamic-form/generated-form/form-data.vue` |
| Breadcrumb/details | `detailsBreadcrumbMixin` daripada `@2enapps/ui` |

Jangan ganti rujukan utama dengan `general-crud`, screen `training/crud/list` atau screen admin Shell. Baca implementasi semasa; jumlah baris dan warning contoh boleh berubah dan bukan bukti semakan semasa.

Guna komponen UI sedia ada sahaja. Komponen tiada: card shared dengan label tepat `[ component not available ]`; rekod jurangnya dalam FRONTEND.md. Jangan cipta button, input, modal, CSS atau komponen alternatif. Jangan edit library Kai/node_modules untuk menutup jurang ini.

## Kontrak data frontend

- `created()` menyediakan list schema, search schema, stats schema dan stats data.
- `getList(page)` menggunakan `getParams("", page, this)` untuk `qSearch`, `searchObject`, `pageSize`, `pageNo`; jangan bina pagination/filter params sendiri.
- `getMainList(params, viewsType, roleType)` menggunakan `returnResponseList(url, response)`. Kekalkan envelope HTTP `response.data.data`, `pageNo`, `totalItems`, `totalPages` serta alias `res.list`/`res.total` hasil helper.
- View membaca `finalRes.list` dan `finalRes.total`; export boleh membaca `finalRes.data?.data`. Jangan buang envelope asal.
- `detailsBreadcrumbMixin`: `openDetails(id, mode, nama)`, `backToList()` dan `onBreadcrumbScreenChange()`. Jangan cipta `showDetailsForm` atau mekanisme ID/navigation kedua.
- `getDetailsOne(id)` menggunakan `returnResponseDetails`; `saveDetails(id,data)` membezakan tambah/kemas kini melalui ID. Gunakan nama domain tetapi bentuk kontrak sama.
- Tindakan delete/bulk/export/print hanya diaktifkan jika fungsi domain menetapkannya; contoh UI tidak mencipta hak memadam secara automatik.
- Fasa 2 sahaja: fixtures berlabel demo, API sebenar disediakan tetapi dikomen/tidak dipanggil. Fasa 3: server mengurus filter/pagination; fixtures tidak boleh fallback selepas API gagal.

## Metadata selepas semua prototaip diterima

Contoh pengguna untuk V2T; modul lain mesti menggunakan identiti/expose sebenar, bukan menyalin nilai V2T:

```javascript
export const V2T_METADATA = Object.freeze({
  remoteName: "v2t",
  displayName: "V2T",
  version: "0.1.0",
  apiVersion: 1,
  routePrefix: "/v2t",
  defaultExpose: "views/program/senarai-program"
});
```

`src/remote-entry.js`:

```javascript
export {};
```

Padankan metadata, expose keys dan import Shell sebenar. Metadata tidak melaksanakan API, SSO atau permissions. Jika fail scaffold ini sudah ada, jangan timpa; bentangkan diff khusus dan minta kebenaran dahulu.
