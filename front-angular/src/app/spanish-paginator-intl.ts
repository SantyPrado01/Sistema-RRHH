import { MatPaginatorIntl } from '@angular/material/paginator';

export function getSpanishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
  paginatorIntl.nextPageLabel     = 'Página siguiente';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.firstPageLabel    = 'Primera página';
  paginatorIntl.lastPageLabel     = 'Última página';
  paginatorIntl.changes.next(); // Notifica a los componentes que los textos han cambiado

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return '0 de ' + length;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };

  return paginatorIntl;
}