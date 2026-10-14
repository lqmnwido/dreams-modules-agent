# DATABASE — templat spesifikasi database modul sendiri

Isi nilai sebenar daripada sumber/keputusan Fasa 1; templat ini bukan skema lengkap dan bukan DDL.

## Standard reka bentuk dan pelaksanaan

Baca [DATABASE-PATTERNS.md](../DATABASE-PATTERNS.md) sebelum memuktamadkan skema Fasa 1 atau mencipta migrasi Fasa 3. Tetapkan snake_case, PK id BIGINT GENERATED ALWAYS AS IDENTITY (SERIAL hanya alternatif corak projek), NUMERIC, TIMESTAMPTZ, CREATE TYPE bagi enum tertutup, idx_/uniq_/fk_ serta ON DELETE/UPDATE jelas. Dokumentasikan indexes/query reuse, page-size/timeouts, keyset/cursor compatibility, batch/no-N+1/eager loading bersasar, cache invalidation dan advisory coordination yang sesuai.

Reka bentuk terkunci atau source-defined UUID/catalog/pageNo/locking yang bercanggah memerlukan keputusan revision khusus; jangan auto-convert atau reka nilai. Setiap migrasi memerlukan ujian forward dan rollback/recovery pada data representatif. Production read-only kecuali mutation khusus dibenarkan; DROP/destructive changes perlukan approval dan backup disahkan.

## Ownership

Satu database PostgreSQL berasingan bagi modul. Hanya backend/worker/migration pemilik mengaksesnya. Modul lain melalui API sahaja; tiada cross-database FK/join atau credentials dikongsi.

## Jadual dan kolum

Bagi setiap table, isi kolum/type/NULL/default/PK/FK/check/unique, audit dan soft-delete sebenar. Nyatakan referenced table/column, ON DELETE/UPDATE serta relationship cardinality. Bezakan source field daripada extension yang diputuskan.

| Table / column | PostgreSQL type | NULL / default | Key / constraint / relation | Source / decision |
| --- | --- | --- | --- | --- |

## Indeks dan transaksi

| Nama index | Table / columns / ordering | Unique / predicate | Query berkaitan |
| --- | --- | --- | --- |

Nyatakan query pagination/filter/sort, no-N+1, concurrent writes, optimistic locking, duplicate constraints, numbering dan transaction-owned cross-table validation yang diperlukan fungsi. Jangan cipta business defaults atau tables modul lain.

## Migrasi

Flyway; Hibernate generation none dan SQL initialization never. Nyatakan migration dependencies serta deletion/retention sebenar. Jangan tulis semula migrasi yang sudah dijalankan. Tiada seksyen human review/APPROVED berasingan diperlukan. Design dikunci selepas Fasa 1; exact target/scripts dan kebenaran execution masih perlu sebelum connect/startup.
