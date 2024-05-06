import '@tanstack/react-table';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: {
      variant: 'text' | 'select';
      matchField: string;
      options?: { label: string; value: string }[]; // select
    };
  }
}

/*
where: {
    skus: {
        sku: {
            has: '...',
            mode: 'insensitive',
        },
    },
},
*/
