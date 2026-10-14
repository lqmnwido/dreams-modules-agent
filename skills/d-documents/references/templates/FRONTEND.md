# FRONTEND — templat skrin dan idea mockup

Mockup ialah draf keperluan fungsi, bukan visual akhir. Isi skrin/medan/tindakan sumber sebenar. Semua UI daripada @2enapps/ui; gunakan general-tab-crud sahaja sebagai contoh lengkap.

| Submodul / skrin | Fields / actions / states | Source | Exact general-tab-crud file / shared components | Planned API | Fixture scenarios / review |
| --- | --- | --- | --- | --- | --- |

Rujuk ARCHITECTURE.md untuk contract getParams/returnResponseList/detailsBreadcrumbMixin. Jangan bina params atau state breadcrumbs kedua. Tindakan hanya fungsi domain; jangan salin delete/bulk daripada contoh tanpa keperluan.

Fasa 2: satu submodul, dummy sintetik, API standby dikomen/tidak aktif, standalone tanpa Shell, ESLint/Prettier, white-box dan Playwright MCP visible browser. Stop untuk user review sebelum submodul seterusnya. Komponen tiada selepas semakan UI: card shared kosong dengan label tepat `[ component not available ]`; rekod jurang, tiada custom component/button/CSS.

Selepas semua interface diterima, metadata.js/remote-entry.js/exposes.js mesti sepadan modul sebenar; fail scaffold sedia ada memerlukan kebenaran khusus sebelum edit. Fasa 3: ganti fixture dengan real API selepas backend diuji, tanpa dummy fallback. Integrasi Shell/SSO selepas pelan dibenarkan. Jangan anggap demo privilege flags membuktikan backend authorization.
