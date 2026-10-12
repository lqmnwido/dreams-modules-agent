/* ---------------------------------------------------------------------------
 * Training-local lookups.
 *
 * `getDataYearList` is lifted from
 * `dreams-mfe/src/shared/services/admin/lookups.js:98` — the only lookup the
 * ported views reach. The body is byte-identical. The rest of that file is an
 * HTTP layer over the same factories the host owns and is not needed here.
 * ------------------------------------------------------------------------- */

export function getDataYearList(start = 0, end = 0, isReverse = false) {
  let list = [];
  if (start && end) {
    for (let i = start; i <= end; i++) {
      list.push({
        id: i,
        keterangan: i + "",
      });
    }
  }

  if (isReverse) {
    list.reverse();
  }

  //console.log('getDataYearList start : '+start+'; end : '+end+'; list : ', list)

  return list;
}
