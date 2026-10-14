# SCOPE — templat penghubung keperluan modul

Templat dokumentasi, bukan skop modul yang telah disemak. Isi daripada sumber sebenar pada Fasa 1; jangan dakwa lengkap selagi belum diisi/disahkan.

## Identiti dan sumber

Nama/kod modul daripada module.config.json. Senaraikan fail, versi, seksyen dan sumber autoritatif; rekod fail hilang/tidak boleh dibaca. Jangan cipta SRS jika tiada.

## Peta fungsi

| Submodul / fungsi / source ID | Aktor / akses rekod | Input / hasil / workflow | Peraturan / exceptions | Rujukan sumber | Storage / API / skrin |
| --- | --- | --- | --- | --- | --- |

Isi setiap fungsi sebenar. Gunakan pautan seksyen DATABASE.md, BACKEND.md dan FRONTEND.md; jangan ulang semua kolum/payload di sini. Simpan fakta sumber, konflik dan keputusan eksplisit dengan jelas.

## Keputusan dan sempadan

| ID | Fakta sumber / soalan | Cadangan | Jawapan eksplisit | Status / kesan |
| --- | --- | --- | --- | --- |

Tiada andaian nilai, peranan atau kontrak provider. Pertanyaan belum dijawab menghalang kerja yang bergantung padanya sahaja. Maksimum lima soalan setiap kumpulan; jangan ulang jawapan atau permintaan bukti yang pengguna tidak ada.

## Fasa dan penerimaan

Catat satu submodul dipilih, progress prototaip/UI review/backend/integration dan pautan TESTING/evidence. PRD.md menyimpan ringkasan umum. Selepas Fasa 1, sahkan semula sumber dan minta pengguna lock lima design docs sebelum Fasa 2. Tiada database human-review table berasingan.
