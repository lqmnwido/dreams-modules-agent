import { delay, returnResponseDetails, returnResponseList } from "@2enapps/ui";
// 
// 

import { senaraiAccountPengguna } from "./sistem";

//-----------------List Main-----------------------------

/**
 * Columns the global search box is matched against.
 *
 * `gSearch` is the parameter `getParams` builds from `self.qSearch`
 * (`getParams` in `@2enapps/ui` → `components/functions/general.js`), and it
 * means "one box, many columns" — the
 * opposite of the detailed form, where every column has its own input. It is
 * kept as an explicit list rather than a scan over every key on each record so
 * that adding a field to the fixture does not silently widen the search: a
 * column appears here because someone decided it is worth searching, not
 * because it happens to exist.
 */
const GLOBAL_SEARCH_FIELDS = [
  "nama",
  "noKadPengenalan",
  "noKadPengenalanLama",
  "jantina",
  "keteranganAgama",
  "keteranganBangsa",
  "keteranganWarganegara",
  "keteranganKategoriPengguna",
  "keteranganKategoriPerkhidmatan",
  "keteranganJawatan",
  "keteranganGredPerkhidmatan",
  "keteranganKementerian",
  "keteranganAgensi",
  "jabatan",
  "keteranganStatusPerkhidmatan",
  "keteranganStatusPerkahwinan",
  "emel",
  "emelPejabat",
  "noTelefonBimbit",
];

/**
 * Splits the query string `getParams` builds into a plain object.
 *
 * `getParams` percent-encodes both halves of every pair (same `getParams` in
 * `components/functions/general.js`), so a name containing `&` or a space arrives
 * intact and `URLSearchParams` decodes it back. Keys are kept verbatim because
 * each one is a column name — the record keys are camelCase, and folding case
 * here would guarantee that every detailed-form filter missed.
 */
function parseQuery(params) {
  const query = {};

  new URLSearchParams(params || "").forEach((value, key) => {
    query[key] = value;
  });

  return query;
}

/**
 * Query parameters that describe the request rather than a row, so they must
 * not be read as filters.
 *
 * `pageNo`/`pageSize` are added by `getParams` when the list is backend
 * paginated, `gSearch` is the global box, and `sortBy`/`sortOrder` are what the
 * list component emits on a header click (`list-data.vue:1658-1661`). Each name
 * is taken from the code that produces it, not guessed — a wrong guess here
 * silently filters the list down to nothing.
 */
const NON_FILTER_PARAMS = new Set([
  "pageNo",
  "pageSize",
  "gSearch",
  "sortBy",
  "sortOrder",
]);

/**
 * Status untuk demo bar ringkasan.
 *
 * `id` sengaja sama dengan `item.key` dalam `summarySchema`, jadi klik satu
 * item ringkasan menjadi filter `?idStatus=<id>` tanpa perlu peta translate:
 * `onSummaryStatAction` hanya perlu salin `key` ke `searchObject.idStatus`.
 *
 * `variant` ialah warna badge lajur Status pada senarai, diimport oleh view
 * untuk membina `badgeMap` — senarai status hidup di satu tempat sahaja.
 */
export const RINGKASAN_STATUS = [
  { id: "semakSemula", variant: "secondary" },
  { id: "draf", variant: "info" },
  { id: "baharu", variant: "primary" },
  { id: "dalamProses", variant: "warning" },
  { id: "selesai", variant: "success" },
  { id: "ditolak", variant: "danger" },
];

/**
 * Tambahkan `idStatus` pada setiap rekod senarai, mengikut kedudukan.
 *
 * `senaraiAccountPengguna` dalam `sistem.js` disalin bulat-bulat daripada
 * sistem sebenar dan tiada medan status di dalamnya, jadi status ditambahkan
 * di sini (pada salinan) dan bukan dengan menyunting fixture itu.
 *
 * Giliran tetap (bukan rawak) supaya kiraan bar ringkasan boleh diterbitkan
 * daripada senarai yang sama dan kekal stabil antara muatan — klik "Draf"
 * mesti sentiasa mengembalikan baris yang sama.
 */
function withStatus(rows) {
  return rows.map((row, index) => ({
    ...row,
    idStatus: RINGKASAN_STATUS[index % RINGKASAN_STATUS.length].id,
  }));
}

/**
 * Whether one cell satisfies one filter value.
 *
 * Substring and case-insensitive, so `nama=nor` finds "NOR FATIHAH BINTI ABDULLAH"
 * and a date input's `YYYY-MM-DD` finds a `YYYY-MM-DD HH:mm:ss AM` timestamp by
 * its leading part. Booleans are compared as text because that is the only form
 * they arrive in — the query string has no types, so `flagAktif=true` must match
 * the fixture's boolean `true` rather than the text `"true"`.
 */
function cellMatches(cell, needle) {
  if (cell === null || typeof cell === "undefined") {
    return false;
  }

  return String(cell).toLowerCase().includes(String(needle).toLowerCase());
}

/**
 * Applies the global search and the detailed form's filters to the fixture.
 *
 * They are `AND`-ed when both arrive. `ComponentCarian` clears one before
 * showing the other, so the combination is reachable only by a caller that
 * builds params itself — and `AND` is the right reading of that regardless: two
 * filters that each narrow the result should both narrow it.
 */
function applyFilters(rows, query) {
  const globalSearch = query.gSearch;

  return rows.filter((row) => {
    if (globalSearch) {
      const hit = GLOBAL_SEARCH_FIELDS.some((field) =>
        cellMatches(row[field], globalSearch)
      );

      if (!hit) {
        return false;
      }
    }

    return Object.keys(query).every(
      (key) =>
        NON_FILTER_PARAMS.has(key) || cellMatches(row[key], query[key])
    );
  });
}

export async function getMainList(params, viewsType, roleType) {
  viewsType, roleType;
  let url = "/api";
  await delay();

  const query = parseQuery(params);
  const filtered = applyFilters(withStatus(senaraiAccountPengguna), query);

  const pageSize = Number(query.pageSize) || filtered.length;
  const pageNo = Number(query.pageNo) || 1;
  const startIndex = (pageNo - 1) * pageSize;
  const page = filtered.slice(startIndex, startIndex + pageSize);

  const response = {
    data: {
      data: page,
      pageNo,
      totalItems: filtered.length,
      totalPages: pageSize
        ? Math.max(1, Math.ceil(filtered.length / pageSize))
        : 1,
    },
  };
  return returnResponseList(url, response);
}

export const listTwo = [
  {
    id: "000101080178",
    nama: "NOR FATIHAH BINTI ABDULLAH",
    noKadPengenalan: "000101080178",
    daftarOleh: null,
    tarikhDaftar: "2025-07-22 10:01:49 AM",
    jantina: "Perempuan",
    jantina_en: "Female",
  },
  {
    id: "000104100218",
    nama: "NADIAH NATASHA BINTI ABDUL RAHMAN",
    noKadPengenalan: "000104100218",
    daftarOleh: null,
    tarikhDaftar: "2025-01-02 10:01:49 AM",
    jantina: "Perempuan",
    jantina_en: "Female",
  },
  {
    id: "000108070538",
    nama: "NUR AISHAH BINTI ISHAK",
    noKadPengenalan: "000108070538",
    daftarOleh: null,
    tarikhDaftar: "2023-11-12 17:01:49 AM",
    jantina: "Perempuan",
    jantina_en: "Female",
  },
];

export async function getListThree(params, viewsType, roleType) {
  params, viewsType, roleType;
  let url = "/api";
  await delay();
  const response = {
    data: {
      data: listTwo,
      pageNo: 1,
      totalItems: listTwo.length + 5,
      totalPages: 1,
    },
  };
  return returnResponseList(url, response);
}

export async function getListTwo(params, viewsType, roleType) {
  params, viewsType, roleType;
  let url = "/api";
  await delay();
  const response = {
    data: {
      data: listTwo,
      pageNo: 1,
      totalItems: listTwo.length + 5,
      totalPages: 1,
    },
  };
  return returnResponseList(url, response);
}

export async function getDetailsOne(id) {
  await delay();
  const response = {
    data: senaraiAccountPengguna.find((item) => item.id === id),
  };
  return returnResponseDetails(`/getDetailsOne/${id}`, response);
}

export async function deleteRecord(id) {
  id;
  await delay();
  return true;
}

//-----------------List Main-----------------------------

//-----------------Sample Input-----------------------------

export async function saveDetails(id, data) {
  id, data;
  await delay();
  return true;
}

/**
 * Data dummy untuk laluan `/ui-element/sample-input/details-dummy`.
 *
 * Corak yang sama seperti `getDetailsOne()` di atas: `delay()` untuk meniru
 * pusingan round trip, kemudian `returnResponseDetails()` yang memulangkan
 * objek respons. Tiada HTTP dan tiada BE.
 *
 * Setiap kunci sepadan dengan `name` tepat satu medan dalam ketiga-tiga
 * skema tab. Nilai setiap satu sengaja sah supaya borang boleh disimpan
 * tanpa ralat:
 *
 *   - `medanWajib`, `emelWajib`, `telefonWajib`, `kotakSemakWajib` dan
 *     `pilihanWajib` memenuhi `validate.required`.
 *   - `medanMinimumAksara` (min 10 aksara), `nilaiAntara` (10 hingga 100),
 *     `postcodeInput` (tepat 5 aksara).
 *   - `katalaluanBaru` dan `sahkanKatalaluan` sengaja SAMA, kerana
 *     `customValidator` membandingkan kedua-duanya.
 *   - `tarikhMulaKelahiran` lebih awal daripada `tarikhAkhirKelahiran`, dan
 *     `tarikhMulaTempahan` lebih awal daripada `tarikhTamatTempahan`,
 *     kerana `dateCompareValidation` membandingkan kedua-dua pasangan.
 *   - `adaKeluargaLain` bernilai `true` supaya medan bersarang di bawahnya
 *     kelihatan.
 *
 * ID Negeri diambil daripada lookup KOD yang hidup (`/negeri`), bukan
 * diteka: `10` = SELANGOR, `14` = W.P. KUALA LUMPUR.
 *
 * Enam medan upload TIDAK diberi nilai dummy. Laluan baca fail upload
 * bergantung pada `process.env.VUE_APP_KEYCLOAK`, `VUE_APP_OFFLINE` dan
 * `VUE_API_URL_UPLOAD`. Vite tidak dapat membina nilai tersebut dan tiada
 * `process` dalam pelayar, jadi URL yang dihantar akan gagal dimuatkan.
 * Sengaja dikosongkan supaya halaman ini tidak ada baris yang diam-diam
 * tidak berfungsi.
 *
 * Medan `live-embed`, `pdf`, `powerpoint` dan `media-video` juga tiada nilai:
 * semuanya membaca `field.embed.url` daripada skema, bukan daripada data.
 */
export async function getSampleInputDetails(id) {
  id;
  await delay();

  const response = {
    data: {
      // ---- TAB 1 · INPUT ---------------------------------------------------
      id: "DUMMY-SAMPLE-0001",

      // Kumpulan input standard.
      textInput: "Ahmad bin Abu Bakar",
      standardSelect: "10",
      searchSelect: "14",
      toggleInput: true,
      phoneNoInput: "0123456789",
      dateInput: "2026-03-15",
      editorInput: "<p>Rekod ini dimasukkan untuk <strong>uji galeri</strong>.</p>",
      numberInput: "42",
      emailInput: "ahmad.abu@arc.gov.my",
      radioInput: "Y",
      postcodeInput: "40100",
      datalistInput: "14",
      textareaInput: "Baris pertama.\nBaris kedua.\nBaris ketiga.",
      checkboxInput: true,
      listLinkInput: [
        { id: "1", name: "Pautan Arkib Negara", name_en: "National Archive Link" },
        { id: "2", name: "Pautan JPA", name_en: "JPA Link" },
        { id: "3", name: "Pautan.my", name_en: "" },
      ],
      fieldInArray: ["Biru", "Merah", "Hijau"],

      // Kumpulan tarikh.
      sampleDateStandard: "2026-01-20",
      sampleDateTime: "2026-01-20T09:30",
      sampleTime: "09:30",
      sampleDateStart: "2026-02-01",
      sampleDateEnd: "2026-02-28",
      sampleMonth: "2026-02",
      sampleYearList: 2026,
      sampleYearInput: 2026,

      // Kumpulan tag dan editor.
      tagInput: ["Arkib", "Kekal", "Rahsia"],
      tagEmailInput: ["satu@arc.gov.my", "dua@arc.gov.my"],
      tiptapInput: "<h2>Catatan Ujian</h2><p>Editor <strong>tiptap</strong> berfungsi.</p>",

      // Kumpulan nombor.
      currencyInput: "1250.50",
      decimalsInput: "3.75",
      numberArrayInput: ["1", "2", "3"],
      emailArrayInput: ["satu@arc.gov.my", "dua@arc.gov.my"],
      phoneArrayInput: ["0123456789", "0198765432"],
      passwordArrayInput: ["RahsiaArray123!", "RahsiaArray456!"],
      currencyArrayInput: ["10.00", "20.00", "30.00"],
      decimalsArrayInput: ["1.5", "2.5", "3.5"],
      hiddenArrayInput: ["rahasiaSatu", "rahasiaDua"],

      /**
       * URL video yang boleh MAIN. Tiga bentuk URL yang BERBEZA supaya
       * ketiga-tiga cabang `getYoutubeEmbedUrl()` diuji sekali gus:
       * `/watch?v=`, `youtu.be/`, dan URL `/embed/` yang sedia pun boleh
       * dibingkai.
       *
       * Tiada medan `video` atau `video-array` yang perlu uppercase dalam data ini —
       * `autoCaps()` dikecualikan untuk kedua-dua jenis tersebut.
       */
      videoLinkInput: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      videoLinkArrayInput: [
        "https://youtu.be/dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=9bZkp7q19f0",
        "https://www.youtube.com/embed/ZbsUaN-iKEw",
      ],

      // Kumpulan pilihan berganda.
      /**
       * `select-multiple` menyimpan ARRAY yang mengandungi salinan penuh
       * objek pilihan, bukan ID mentah. Setiap `BFormCheckbox` menerima satu
       * objek `{ [keyColumn]: nilai }` sebagai `value`, dan
       * `bootstrap-vue-next` membandingkannya dengan `JSON.stringify`, jadi
       * hanya objek dengan kunci yang sama persis akan bertanda.
       *
       * Array `["01", "03"]` tidak akan menanda satu kotak pun.
       *
       * Objeknya datang daripada API sebenar, bukan daripada data dummy ini.
       * `senaraiPeranan` dan `senaraiPerananGroup` berkongsi ID yang sama
       * (`01` hingga `04`) tetapi cara paparan berbeza: yang kedua
       * dikumpulkan mengikut `idKategoriPengguna`, jadi senarai peranan itu
       * dipaparkan dalam kotak berkumpulan.
       */
      senaraiPeranan: [{ id: "01" }, { id: "03" }],
      senaraiPerananGroup: [{ id: "01" }, { id: "04" }],

      // Kumpulan temu janji.
      /**
       * `select-time-temujanji` juga menggunakan kumpulan `BFormCheckbox`, jadi
       * nilainya mesti berupa array ID slot, bukan satu rentetan biasa.
       *
       * Slot `3` dan `6` ditanda `notAvailable` dalam skema dan dilumpuhkan,
       * jadi data dummy ini sengaja memilih slot yang masih tersedia.
       *
       * `checkUniqueSlot` hanya dijalankan dalam peristiwa `@change`, jadi
       * tiada had tiga slot terhadap data yang dimuatkan sebelum ini.
       */
      waktuJanjiTemu: ["1", "4"],

      // Kumpulan kata laluan.
      katalaluan: "Rahsia123!",
      hintKatalaluan: "Rahsia456!",

      // ---- TAB 2 · ATURAN & KEADAAN ----------------------------------------
      medanWajib: "Nilai wajib diisi",
      medanMinimumAksara: "ABCDEFGHIJ",
      nilaiAntara: "50",
      emelWajib: "wajib@arc.gov.my",
      telefonWajib: "0123456789",
      kotakSemakWajib: true,
      /**
       * `select-multiple` bukan array string. `BFormCheckbox` diberi satu
       * objek `{ [keyColumn]: nilai }` sebagai nilai kotak, dan
       * `bootstrap-vue-next` membandingkannya dengan `JSON.stringify`.
       * Jadi model mesti mengandungi objek dengan kunci yang sama persis.
       * Array `["10", "14"]` tidak akan menanda satu kotak pun.
       */
      pilihanWajib: [{ id: "10" }, { id: "14" }],

      // WAJIB SAMA: `customValidator` membandingkan kedua-dua medan ini.
      katalaluanBaru: "RahsiaBaru123!",
      sahkanKatalaluan: "RahsiaBaru123!",

      // `true` supaya medan bersarang di bawahnya dipaparkan.
      adaKeluargaLain: true,
      tarikhLahirAnak: "2018-05-14",
      tarikhMulaKelahiran: "2018-05-01",
      tarikhAkhirKelahiran: "2018-05-20",
      namaAhliKeluarga: "Siti Aminah binti Abdullah",

      tarikhMulaTempahan: "2026-03-01",
      tarikhTamatTempahan: "2026-03-31",

      medanHanyaPapar: "Hanya dipapar",
      medanTidakBolehEdit: "Tidak boleh disunting",
      nilaiWarna: "3",
      labelDynamik: "Label dinamik di sini",
      tagDilumpuhkan: ["TidakAktif1", "TidakAktif2"],
      medanDalamAkordeon: "Medan dalam akordeon",

      // ---- TAB 3 · PENGIMBAS QR --------------------------------------------
      /**
       * Nilainya ialah teks yang dibaca daripada kod QR. Komponen
       * `qr-scanner` menulis balik melalui `@update:modelValue`, tetapi ia
       * TIDAK menerima `modelValue` daripada hos — jadi nilai ini masuk ke
       * dalam payload simpan tetapi tidak dipaparkan pada kotak output
       * pengimbas.
       */
      scanner: "https://arkib.arc.gov.my/arkib/AST/SM/00012345",
    },
  };

  return returnResponseDetails(`/getSampleInputDetails/${id}`, response);
}

//-----------------Sample Input-----------------------------


  //-----------------Dashboard (Sample Data)-----------------------------

  /**
   * Ringkasan statistik (dashboard) — sample data hardcode, tanpa BE.
   *
   * `delay(900)` mensimulasikan menunggu response dari server supaya
   * indicator loading (skeleton shimmer) dalam `stat-card-grid` dapat
   * dilihat. Bentuk data selari dengan `propData` komponen:
   *   key kad → { value, trend, chips: { key chip → nilai } }
   */
  export async function getDashboardStats() {
    await delay(900);
    return {
      permohonanProgram: {
        value: 48,
        trend: 12.5,
        chips: { baharu: 8, proses: 10, selesai: 30 },
      },
      jalinanCerita: {
        value: 34,
        trend: -9.7,
        chips: { baharu: 6, proses: 6, selesai: 22 },
      },
      laporanProgram: {
        value: 26,
        trend: 7.4,
        chips: { baharu: 4, proses: 4, selesai: 18 },
      },
      // permohonanPinjaman: {
      //   value: 42,
      //   trend: 11.2,
      //   chips: { baharu: 7, proses: 10, selesai: 25 },
      // },
      // penyediaanPoster: {
      //   value: 31,
      //   trend: 8.1,
      //   chips: { baharu: 5, proses: 9, selesai: 17 },
      // },
      // penyimpananPengeluaran: {
      //   value: 57,
      //   trend: 14.6,
      //   chips: { baharu: 6, proses: 13, selesai: 38 },
      // },
    };
  }
  
//-----------------Summary Stats (Sample Data)-----------------------------

/**
 * Bar ringkasan (summary stats) — dikira daripada senarai yang sama, tanpa BE.
 *
 * `delay(700)` mensimulasikan menunggu response API supaya skeleton shimmering
 * dalam komponen `summary-stats` kelihatan semasa memuatkan. Data dirata
 * (kunci → nombor) mengikut bentuk `propData` komponen: setiap `item.key` dan
 * `total.key` cari di sini.
 *
 * Kiraan diterbitkan daripada `withStatus(senaraiAccountPengguna)` dan bukan
 * nombor hardcode, sebab item ringkasan boleh diklik untuk menapis senarai:
 * angka pada kad mesti sama dengan bilangan baris yang benar-benar muncul.
 * Jika tidak, klik "Draf" akan menapis data yang tiada hubungannya dengan
 * kad tersebut.
 */
export async function getSummaryStats() {
  await delay(700);

  const rows = withStatus(senaraiAccountPengguna);
  const stats = {};

  RINGKASAN_STATUS.forEach(({ id }) => {
    stats[id] = rows.filter((row) => row.idStatus === id).length;
  });

  stats.jumlah = rows.length;

  return stats;
}

//-----------------Summary Stats (Sample Data)-----------------------------
