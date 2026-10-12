# Rujukan CRUD

Dokumen ini menunjukkan programmer mana satu fail yang perlu rujuk bila membina
screen CRUD baharu, dan mana fail yang perlu diedit bila mengubah
komponen dia sendiri.

Rujukan ini wujud sebab `ui` menyediakan enjin, tetapi tiada satu
screen pun yang menunjukkan cara tertibkan enjin tu dari hujung ke
hujung. `general-tab-crud` ialah satu-satunya yang menunjukkan semua
sekaligus.

---

## 1. Rujukan mana

| Nak buat apa | Rujuk |
| --- | --- |
| Screen CRUD baharu (senarai → details) | `views/ui-element/general-tab-crud/list-main.vue` |
| Ubah behaviour table (bulk, print, laporan, upload) | `@2enapps/ui` → `components/dynamic-form/generated-form/list-data.vue` |
| Ubah behaviour borang (input, validasi) | `@2enapps/ui` → `components/dynamic-form/generated-form/form-data.vue` |
| Senarai → details dalam satu klik | `detailsBreadcrumbMixin` daripada `@2enapps/ui` |

Jangan rujuk screen lain. `general-crud` (yang tiada tab),
`training/crud/list`, dan 10 screen `shell/src/views/admin/` semua
lebih nipis — hanya aliran tertentu sahaja, bukan semuanya.

---

## 2. Fail dalam `general-tab-crud/`

| Fail | Baris | Peranan |
| --- | --- | --- |
| `list-main.vue` | 781 | **Rujukan utama.** Senarai + carian + dashboard + tab |
| `tab.vue` | 248 | Pembungkus tab; memuat 6 sub-screen |
| `details-one.vue` | 862 | Details dengan borang paling lengkap |
| `details-two.vue` | 419 | Details ringkas |
| `details-three.vue` | 262 | Details jenis display sahaja |
| `details-four.vue` | 217 | Details untuk tab paling dalam |
| `list-two.vue` | 387 | Senarai anak (tab 2) |
| `list-three.vue` | 400 | Senarai anak (tab 3) |
| `list-four.vue` | 405 | Senarai anak (tab 4) |
| `list-five.vue` | 410 | Senarai anak (tab 5) |

Mula baca `list-main.vue`. Baca `details-one.vue` hanya bila screen
perlu borang yang ada validasi dan lookup.

---

## 3. Cara jalankan

Route didaftar dalam `shell/src/router/training-routes.js`:

```
path: "/ui-element/general-tab-crud/list"
component: () => import("training/views/ui-element/general-tab-crud/list-main")
```

Buka `http://localhost:2400/ui-element/general-tab-crud/list`.

Tidak perlu backend. `services/training/crud.js` tiada satu pun HTTP
call — semua data fixture dengan `await delay()` supaya kelihatan
seperti rangkaian sebenar.

---

## 4. Aliran data

### Senarai

```
created()
  → getSchemaList()          isi this.schemaList (structure table)
  → getSchemaFormCarian()    isi this.schemaFormCarian (borang carian)
  → initStatsSchema()        kad dashboard (structure)
  → loadDashboardStats()     this.statsData (nilai, dari service)

user action → listData @paginatedProps(page)
  → getList(page)
      params = getParams("", page, this)
      finalRes = await getMainList(params, viewsType, roleType)
      this.totalRecord = finalRes.total
      this.list        = finalRes.list
      this.listCondition(this.list)     → assignSchemaToListData per row
  → this.list = ...
```

`getParams` baca `this.qSearch` dan `this.searchObject` dan letak
dalam param. Jangan susun param sendiri — guna `getParams`, dia juga
tulis `pageSize` dan `pageNo`.

### Senarai → details

Semua melalui `detailsBreadcrumbMixin` — jangan tambah
`showDetailsForm` atau `id` sendiri:

```js
listActions({ functionProps: { functionName }, data }) {
  if (functionName === "show")      this.openDetails(data.id, "view", data.nama);
  else if (functionName === "edit") this.openDetails(data.id, "",     data.nama);
  else if (functionName === "delete") this.deleteData(data.id);
}

onAddClick() { this.openDetails("", ""); }
```

Argumen ketiga `openDetails` ialah label crumb. Beri nama rekod supaya
crumb jadi bermakna; jika tiada nama, mixin jatuh balik kepada
`breadcrumb.details` dalam locale.

`backToList()` dan `onBreadcrumbScreenChange()` datang daripada mixin
yang sama — jangan tulis semula.

---

## 5. Kontrak service

`@/services/training/crud` — **guna semula bentuk ini**, jangan
ubah bentuknya.

```js
// Senarai. WAJIB balut dengan returnResponseList.
export async function getMainList(params, viewsType, roleType) {
  const response = {
    data: {
      data: page,        // array of rows
      pageNo,
      totalItems,        // jumlah keseluruhan, bukan jumlah halaman
      totalPages,
    },
  };
  return returnResponseList(url, response);
}
```

`returnResponseList` (`services/training/http.js`) menambah dua field
pada envelope yang sama:

| Field | Asal | Dibaca oleh view |
| --- | --- | --- |
| `res.list` | `res.data.data` | `getList()` → `this.list` |
| `res.total` | `res.data.totalItems` | `getList()` → `this.totalRecord` |

Untuk export laporan, `getListForReport` baca `finalRes.data?.data`
 terus — jadi **jangan** buang `response.data` selepas balut.

Function lain:

| Signature | Guna untuk |
| --- | --- |
| `getDetailsOne(id)` | muat satu rekod → `returnResponseDetails` |
| `saveDetails(id, data)` | `id` kosong = tambah, ada `id` = kemaskini |
| `deleteRecord(id)` | padam, pulangkan `true` |
| `getListTwo/T Three(params, viewsType, roleType)` | senarai anak dalam tab |
| `getDashboardStats()` | nilai kad dashboard |
| `getSummaryStats()` | ringkasan untuk `general-crud` (bukan tab) |

---

## 6. Feature yang perlu tahu

Semua ini sudah tersambung dalam `list-main.vue`:

| Feature | Di mana | Catatan |
| --- | --- | --- |
| Pagination server-side | `getList(page)` | `:backendPaginated="true"` + `@paginatedProps` |
| Carian terperinci | `ComponentCarian` | dua mod: ringkas (`qSearch`) dan penuh (`searchObject`) |
| Reset carian | `onResetSearchClick()` | kosongkan **kedua-dua** mod serentak |
| Bulk select | `@listMultipleSelectActions` | perlu `listSchema.multipleSelectabled` |
| Row action | `@listActions` | show / edit / delete |
| Row link action | `@listLinkActions` | buka details bila klik nama |
| Export laporan | `getListForReport(type)` | sync label dropdown dulu |
| Cetak | `schemaList.allowPrint: true` | satu-satunya screen yang hidup |
| Kolum dinamik | `@updateDisplayListField` | simpan balik ke `this.schemaList` |
| Dashboard kad | `StatCardGrid` | `statsSchema` + `statsData` + `statsLoading` |
| Tab | `<tab>` → `tab.vue` | 6 sub-screen |
| Breadcrumb | `detailsBreadcrumbMixin` | jangan tulis manual |
| Kebenaran | `priv()` → `layoutStore.priv` | `flagDaftar` / `flagKemaskini` / `flagHapus` |
| Notis | `notificationProp` computed | `notificationStore` |
| Validasi | `customValidator` | `standardValidation(field, self)` |

---

## 7. Wajib tukar bila copy

Fixture dalam `services/training/crud.js`:

- `senaraiAccountPengguna` — semua data senarai
- `getDashboardStats()` — `await delay(900)` pastu pulangkan angka
  hardcoded
- `listTwo` — data senarai anak
- `getMainList` ada `parseQuery` + `applyFilters` sendiri — ini hanya
  untuk demo. Backend sebenar yang urus pagination dan filter.

Isi `schemaFormCarian` pun dummy: setiap dropdown `listData` diambil
dari nilai yang ada dalam fixture. Bila tukar ke data sebenar, pastikan
setiap pilihan dropdown **memang ada** dalam senarai — filter yang
tawarkan pilihan yang tiada dalam data adalah filter yang pengguna
akhirnya tak percaya.

---

## 8. Jangan copy bulat-blind

ESLint `list-main.vue`: **0 error, 5 warning**, semua
`no-unused-expressions`.

`formActions(data)` dan `listMultipleSelectActions(payload)` ialah
stub — `data;` dan `payload;` sahaja. Guna sebagai titik sambung
untuk bekalan forklift, atau buang.

Jangan import `infoSwal` / `confirmSwal` / `privSwal` yang tak
diguna — akan jadi warning baru.

---

## 9. Bila perlu ubah enjin

Hanya bila tabletop behaviour yang `list-data.vue` tidak sudah ada.

`components/dynamic-form/generated-form/list-data.vue` — 2291 baris,
16 props. Feature yang dia sudah ada:

| Feature | Bukti |
| --- | --- |
| Bulk select | 34 baris |
| Cetak / print | 48 baris |
| Laporan / Excel (`setting-laporan`) | 22 baris |
| Upload, modal, validasi, carian, pagination | ada |

Semua props (`listSchema`, `listData`, `totalRecord`,
`backendPaginated`, `propListDataReport`, `reportSearch`,
`customDisplayField`, `viewMode`, `fontSize`, `removeStripe`,
`offScroll`, `hideTopPagination`, `setUsePagination`,
`propSchemaDataReport`, `propSchemaDataReportAsal`,
`listDataFooter`).

Bila masuk `list-data.vue`, baca fail ini sekali — ia kod yang
mengawal jadual dan ia tidak intuitif.
