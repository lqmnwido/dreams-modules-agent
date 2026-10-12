<!--
  TAB 1 · INPUT

  Komponen tab yang terpisah sendiri. Ia memiliki fungsi `getSchemaInput()`
  sendiri, `formData` sendiri dan satu `form-panel` sendiri, jadi ia tidak
  bergantung pada mana-mana tab lain.

  `created()` membina skema SEKALI sahaja. `form-data.vue` hanya mengisi
  `formData` daripada skema ketika ia dipasang, jadi skema tidak boleh
  digantikan selepas itu tanpa kehilangan nilai yang sudah ditaip.
-->
<template>
  <FormPanel
    :schema="schema"
    :formData="formData"
    :id="id"
    :viewModeForm="viewModeForm"
    @backToList="$emit('backToList')"
  />
</template>

<script>
import FormPanel from "./form-panel.vue";
import { setFormObjectBySchema } from "@2enapps/ui";
import { getDataYearList } from "@/services/training/lookups";

export default {
  name: "SampleInputTabInput",

  components: { FormPanel },

  props: {
    propId: String,
    viewModeForm: String,
    /**
     * Data permulaan. Kosong pada laluan kosong; diisi daripada perkhidmatan
     * data dummy pada laluan `/details-dummy`.
     */
    propData: { type: Object, default: () => ({}) },
  },

  emits: ["backToList", "register"],

  data() {
    return {
      schema: null,
      formData: {},
      listYear: getDataYearList(
        new Date().getFullYear() - 20,
        new Date().getFullYear() + 10,
        true
      ),
    };
  },

  created() {
    this.id = this.propId || "";
    this.schema = this.getSchemaInput();

    /**
     * `setFormObjectBySchema()` memberikan setiap kunci medan nilai lalai
     * yang betul: array kosong untuk medan berulang, `[]` untuk `chiptag`,
     * dan struktur yang tepat untuk medan upload. `propData` disepit di atasnya
     * supaya data dummy hanya menulis semula kunci yang memang dipunya
     * servicedata.
     */
    this.formData = {
      ...setFormObjectBySchema(this.schema),
      ...this.propData,
    };
  },

  mounted() {
    /**
     * Daftar skema kepada hos halaman supaya tab Skema & Data boleh
     * memaparkan JSON gabungan ketiga-tiga tab borang.
     */
    this.$emit("register", "input", this.schema);
  },

  methods: {
    /* ------------------------------------------------------------------ *
     * TAB 1 · INPUT                                                       *
     * ------------------------------------------------------------------ */
    getSchemaInput() {
      return {
        title: "uiElement.sampleInput.title.detailsOne",
        pkField: "id",
        fieldSets: [
          {
            legend: "uiElement.sampleInput.fieldset.standardInput",
            name: "standardInputFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "id", label: "uiElement.sampleInput.label.pkField", type: "hidden" },
                  { name: "textInput", label: "uiElement.sampleInput.label.textInput", type: "text" },
                  {
                    name: "standardSelect",
                    label: "uiElement.sampleInput.label.standardSelect",
                    type: "select",
                    refData: {
                      name: "Negeri",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  {
                    name: "searchSelect",
                    label: "uiElement.sampleInput.label.searchSelect",
                    type: "select-search",
                    refData: {
                      name: "Negeri",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  { name: "toggleInput", label: "uiElement.sampleInput.label.toggleInput", type: "switch" },
                  { name: "phoneNoInput", label: "uiElement.sampleInput.label.phoneNoInput", type: "phone" },
                  { name: "dateInput", label: "uiElement.sampleInput.label.dateInput", type: "date" },
                  {
                    name: "editorInput",
                    label: "uiElement.sampleInput.label.editorInput",
                    type: "texteditor",
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ color: [] }],
                      [{ align: [] }],
                    ],
                    height: "200px",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "numberInput", label: "uiElement.sampleInput.label.numberInput", type: "number", maxLength: 3 },
                  { name: "emailInput", label: "uiElement.sampleInput.label.emailInput", type: "email" },
                  {
                    name: "radioInput",
                    label: "uiElement.sampleInput.label.radioInput",
                    type: "radio",
                    inline: true,
                    refData: {
                      name: "adaTiada",
                      keyColumn: "id",
                      labelColumn: "name",
                      url: "",
                    },
                  },
                  {
                    name: "postcodeInput",
                    label: "uiElement.sampleInput.label.postcodeInput",
                    type: "number",
                    maxLength: 5,
                    validate: { min: 5, max: 5 },
                  },
                  {
                    name: "datalistInput",
                    label: "uiElement.sampleInput.label.datalistInput",
                    type: "datalist",
                    refData: {
                      name: "LokasiKuarters",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  { name: "textareaInput", label: "uiElement.sampleInput.label.textareaInput", type: "textarea", areaRows: 5 },
                  { name: "checkboxInput", label: "uiElement.sampleInput.label.checkboxInput", type: "checkbox" },
                  {
                    name: "listLinkInput",
                    label: "uiElement.sampleInput.label.listLinkInput",
                    type: "links",
                    defaultValue: [
                      { id: "1", name: "Pautan 1", name_en: "Link 1" },
                      { id: "2", name: "Pautan 2", name_en: "Link 1" },
                    ],
                  },
                  { name: "fieldInArray", label: "uiElement.sampleInput.label.fieldInArray", type: "text-array" },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.sampleDateInput",
            name: "dateInputFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "sampleDateStandard", label: "uiElement.sampleInput.label.standardDate", type: "date" },
                  { name: "sampleDateTime", label: "uiElement.sampleInput.label.dateWithTime", type: "datetime-local" },
                  { name: "sampleTime", label: "uiElement.sampleInput.label.time", type: "time" },
                  {
                    name: "sampleDateRange",
                    label: "uiElement.sampleInput.label.dateRange",
                    joinField: {
                      layout: "horizontal",
                      separator: " - ",
                      fields: [
                        { name: "sampleDateStart", label: "uiElement.sampleInput.label.dateStart", type: "date", colWidth: 5 },
                        { label: "uiElement.sampleInput.label.to", align: "center", colWidth: 2 },
                        { name: "sampleDateEnd", label: "uiElement.sampleInput.label.dateEnd", type: "date", colWidth: 5 },
                      ],
                    },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "sampleMonth", label: "uiElement.sampleInput.label.month", type: "month" },
                  {
                    name: "sampleYearList",
                    label: "uiElement.sampleInput.label.yearList",
                    type: "select-search",
                    refData: {
                      name: "year",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: this.listYear,
                    },
                  },
                  { name: "sampleYearInput", label: "uiElement.sampleInput.label.yearInput", type: "number", maxLength: 4, validate: { min: 4, max: 4 } },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.sampleUploadInput",
            name: "uploadFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "dirImageUpload",
                    label: "uiElement.sampleInput.label.imageUpload",
                    type: "upload",
                    upload: {
                      type: "image",
                      size: 5,
                      align: "center",
                      onEditImage: true,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                  {
                    name: "dirImageUploadMultiple",
                    label: "uiElement.sampleInput.label.imageUploadMultiple",
                    type: "upload-multiple",
                    upload: {
                      type: "image",
                      size: 5,
                      maxFiles: 6,
                      align: "center",
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                  {
                    name: "dirFileUploadMultipleTus",
                    label: "uiElement.sampleInput.label.fileUploadMultipleTus",
                    type: "upload-multiple",
                    upload: {
                      type: "file",
                      fileType: "pdf,doc,docx",
                      size: 200,
                      maxFiles: 5,
                      /**
                       * Susun atur ikut `maklumat-media.vue` dalam repo vtt:
                       * `foldername` wajib ada kerana shell membentuk
                       * `foldername + jobId` untuk metadata TUS, dan tanpa
                       * ia ia menjadi teks "undefined". `jobId` hanya
                       * diperlukan bagi muat naik ASR, jadi tidak di sini.
                       */
                      isTus: true,
                      foldername: "uploads",
                      dragDrop: true,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "dirFileUpload",
                    label: "uiElement.sampleInput.label.fileUpload",
                    type: "upload",
                    upload: {
                      type: "file",
                      fileType: "pdf",
                      size: 5,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                  {
                    name: "dirFileUploadMultiple",
                    label: "uiElement.sampleInput.label.fileUploadMultiple",
                    type: "upload-multiple",
                    upload: {
                      type: "file",
                      fileType: "pdf,doc,docx",
                      size: 5,
                      maxFiles: 5,
                      /**
                       * Versi biasa: tiada `dragDrop`, jadi medan ini hanya
                       * menerima fail daripada dialog pilih fail. Bandingkan
                       * dengan `dirFileUploadMultipleDragDrop` di bawah.
                       */
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                  {
                    name: "dirFileUploadMultipleDragDrop",
                    label: "uiElement.sampleInput.label.fileUploadMultipleDragDrop",
                    type: "upload-multiple",
                    upload: {
                      type: "file",
                      fileType: "pdf,doc,docx",
                      size: 5,
                      maxFiles: 5,
                      /**
                       * Satu baris ini sahaja bezakan versi ini daripada
                       * `dirFileUploadMultiple`: ia memasang pendengar seret &
                       * lepas pada zon dan memaparkan petunjuk di bawahnya.
                       */
                      dragDrop: true,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                ],
              },
            ],
          },

          /**
           * Kumpulan seterusnya mengisi jurang antara komponen yang WUJUD
           * dalam `ui/src/components/dynamic-form/input-type/` dengan yang
           * tidak pernah dipaparkan di galeri ini sebelum ini. Setiap satu
           * ialah `v-else-if` sebenar dalam `form-data-input.vue`, jadi ia
           * benar-benar boleh digunakan oleh mana-mana modul.
           */
          {
            legend: "uiElement.sampleInput.fieldset.tagRichTextFieldset",
            name: "tagRichTextFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "tagInput",
                    label: "uiElement.sampleInput.label.chiptagInput",
                    type: "chiptag",
                    /**
                     * `chiptag.placeholder` tidak diterjemahkan oleh
                     * komponen, jadi biarkan ia kosong supaya teks lalai
                     * komponen sendiri ("Taip dan tekan Enter") digunakan.
                     */
                    chiptag: { maxTags: 8, allowDuplicate: false },
                  },
                  {
                    name: "tagEmailInput",
                    label: "uiElement.sampleInput.label.chiptagEmailInput",
                    type: "chiptag",
                    /**
                     * `validate.email` menyalakan semakan format setiap tag
                     * dan mewarnakannya merah jika tidak sah.
                     */
                    validate: { email: true },
                    chiptag: { maxTags: 5 },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "tiptapInput",
                    label: "uiElement.sampleInput.label.tiptapInput",
                    type: "tiptap",
                    height: "280px",
                    /**
                     * `tiptap.showPlaceholderHint: false` menyembunyikan
                     * baris petunjuk di bawah editor.
                     */
                    tiptap: { showPlaceholderHint: true },
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.numericFormatFieldset",
            name: "numericFormatFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "currencyInput",
                    label: "uiElement.sampleInput.label.currencyInput",
                    type: "currency",
                    /**
                     * `currency` diformat dengan `Intl.NumberFormat` dan
                     * nilai lalai automatiknya ialah 0, bukan kosong.
                     */
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "decimalsInput",
                    label: "uiElement.sampleInput.label.decimalsInput",
                    type: "decimals",
                    decimalPoint: 2,
                    /** `decimalComas` menukar pemisah perpuluhan kepada koma. */
                    decimalComas: true,
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.arrayFieldset",
            name: "arrayFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "numberArrayInput", label: "uiElement.sampleInput.label.numberArrayInput", type: "number-array", maxLength: 3 },
                  { name: "emailArrayInput", label: "uiElement.sampleInput.label.emailArrayInput", type: "email-array" },
                  { name: "phoneArrayInput", label: "uiElement.sampleInput.label.phoneArrayInput", type: "phone-array" },
                  { name: "passwordArrayInput", label: "uiElement.sampleInput.label.passwordArrayInput", type: "password-array" },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  { name: "currencyArrayInput", label: "uiElement.sampleInput.label.currencyArrayInput", type: "currency-array" },
                  {
                    name: "decimalsArrayInput",
                    label: "uiElement.sampleInput.label.decimalsArrayInput",
                    type: "decimals-array",
                    decimalPoint: 2,
                    decimalComas: true,
                  },
                  /**
                   * `hidden-array` tidak tersembunyi seperti `hidden`: penjana
                   * hanya menyembunyikan `type == "hidden"`, jadi senarai ini
                   * tetap kelihatan dan boleh disunting.
                   */
                  { name: "hiddenArrayInput", label: "uiElement.sampleInput.label.hiddenArrayInput", type: "hidden-array" },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.sampleLiveEmbed",
            name: "liveEmbedFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "youtubeLive",
                    label: "Youtube",
                    type: "live-embed",
                    embed: {
                      provider: "youtube",
                      url: "https://www.youtube.com/watch?v=ZbsUaN-iKEw",
                      aspectRatio: "16:9",
                      height: 420,
                      showMeta: true
                    }
                  },
                  {
                    name: "tiktokLive",
                    label: "Tiktok",
                    type: "live-embed",
                    embed: {
                      provider: "tiktok",
                      url: "https://www.tiktok.com/@hanifloid/video/7610737306923846932?is_from_webapp=1&sender_device=pc",
                      aspectRatio: "16:9",
                      height: 420,
                      showMeta: true
                    }
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "facebookLive",
                    label: "Facebook",
                    type: "live-embed",
                    embed: {
                      provider: "facebook",
                      url: "https://www.facebook.com/astroawani/videos/26327985840171481",
                      aspectRatio: "16:9",
                      height: 420,
                      showMeta: true
                    }
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.mediaAppointmentFieldset",
            name: "mediaAppointmentFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "videoLinkInput",
                    label: "uiElement.sampleInput.label.videoInput",
                    type: "video",
                    video: { aspect: "16x9" },
                  },
                  {
                    name: "videoLinkArrayInput",
                    label: "uiElement.sampleInput.label.videoArrayInput",
                    type: "video-array",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "waktuJanjiTemu",
                    label: "uiElement.sampleInput.label.appointmentInput",
                    type: "select-time-temujanji",
                    /**
                     * `checkUniqueSlot` menjadikan ini satu pilihan sahaja
                     * dan menampilkan amaran bila dilampaui; hadnya tiga
                     * slot. `notAvailable` lumpuhkan slot tersebut.
                     */
                    checkUniqueSlot: true,
                    refData: {
                      listWidth: 4,
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: [
                        { id: "1", keterangan: "08:00 - 08:30" },
                        { id: "2", keterangan: "08:30 - 09:00" },
                        { id: "3", keterangan: "09:00 - 09:30", notAvailable: true },
                        { id: "4", keterangan: "09:30 - 10:00" },
                        { id: "5", keterangan: "10:00 - 10:30" },
                        { id: "6", keterangan: "10:30 - 11:00", notAvailable: true },
                      ],
                    },
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.mediaPreviewFieldset",
            name: "mediaPreviewFieldset",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                sizelabel: "2",
                sizefield: "10",
                fields: [
                  {
                    name: "pdfFrame",
                    label: "PDF",
                    type: "pdf",
                    embed: {
                      /**
                       * URL awam, bukan `/doc/contoh-doc.pdf` yang lama.
                       * Fail dalam `/doc/` tidak wujud di mana-mana hos
                       * (shell mahupun training), jadi `iframe` itu
                       * memuat 404 dan medan ini tidak pernah dipapar
                       * sebagai PDF.
                       *
                       * URL ini disahkan dalam pelayar, bukan sahaja
                       * dengan `curl`. `curl -sI` sahaja tidak cukup:
                       * `https://www.w3.org/.../dummy.pdf` memang 200 dan
                       * `application/pdf` tanpa `x-frame-options`, tetapi
                       * CSP-nya ada `frame-ancestors 'self' https://cms.w3.org/`
                       * jadi Chrome tetap memblok dengan
                       * "Framing ... violates ... Content Security Policy".
                       *
                       * URL ini disahkan TIGA lapis: 200, `application/pdf`,
                       * TADA `x-frame-options`, TADA CSP `frame-ancestors`,
                       * dan tiada ralat framing dalam console Chrome.
                       * Saiz 20 KB, jadi tidak melambatkan halaman.
                       */
                      url: "https://www.orimi.com/pdf-test.pdf",
                      // aspectRatio: "16:9",
                      // height: 420,
                      pdfMode: "iframe",
                      //pdfMode: "google",
                      showMeta: true
                    }
                  },
                  {
                    //untuk powerpoint mmg xboleh iframe (guna local url)
                    //Browser TAK boleh render .ppt / .pptx / .pptm
                    name: "powerpointFrame",
                    label: "Power Point",
                    type: "powerpoint",
                    embed: {
                      url: "https://drive.google.com/file/d/1XU22qEiwzsWeKPewg70SnW85KHBnytz0/view?usp=sharing",
                      powerpointMode: "google",
                      showMeta: true
                    }
                  },
                  {
                    name: "videoFrame",
                    label: "Video",
                    type: "media-video",
                    embed: {
                      /**
                       * URL awam, bukan `/doc/sampel_video.mp4` yang lama.
                       * Fail itu tidak wujud, jadi `<video>` berakhir dengan
                       * `MEDIA_ERR_SRC_NOT_SUPPORTED` (error 4) dan tiada
                       * apa-apa dipapar.
                       *
                       * URL ini disahkan dengan `curl -sI`: 200,
                       * `content-type: video/mp4`, TADA `x-frame-options`,
                       * dan `accept-ranges: bytes` supaya pengguna boleh
                       * mencari dalam fail.
                       */
                      url: "https://www.w3schools.com/html/mov_bbb.mp4",
                      //provider: "html5",
                      showMeta: true
                    }
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.samplePasswordInput",
            name: "katalaluan",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "6",
                fields: [
                  { name: "katalaluan", label: "uiElement.sampleInput.label.password", type: "password", showPassword: true },
                  { name: "hintKatalaluan", label: "uiElement.sampleInput.label.passwordConfirm", type: "password", showPassword: true },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.sampleMultipleSelectionInput",
            name: "multipleSelectionRole",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                sizelabel: "2",
                sizefield: "10",
                fields: [
                  {
                    name: "senaraiPeranan",
                    label: "uiElement.sampleInput.label.selectRole",
                    labelVar: { "testVar": "Sistem" },
                    type: "select-multiple",
                    isSearch: true,
                    refData: {
                      listWidth: 4,
                      selectAll: true,
                      name: "Peranan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url:
                        process.env.VUE_API_URL_PENTADBIR +
                        "/peranan?sortBy=keterangan&sortOrder=asc",
                    },
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.sampleMultipleSelectionInput",
            name: "multipleSelectionRoleWithGroup",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                sizelabel: "2",
                sizefield: "10",
                fields: [
                  {
                    name: "senaraiPerananGroup",
                    label: "uiElement.sampleInput.label.selectRoleWithGroup",
                    labelVar: { "testVar": "Sistem" },
                    type: "select-multiple",
                    isSearch: true,
                    group: {
                      showByGroup: true,
                      groupId: "idKategoriPengguna",
                      groupLabel: "keteranganKategoriPengguna",
                      width: 6,
                      selectAll: true,
                    },
                    refData: {
                      listWidth: 6,
                      selectAll: true,
                      name: "Peranan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url:
                        process.env.VUE_API_URL_PENTADBIR +
                        "/peranan?sortBy=keterangan&sortOrder=asc",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
