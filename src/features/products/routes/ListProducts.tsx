import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Column,
  ColumnFilter,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { sentenceCase } from 'change-case';
import { debounce } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useListProductMutation } from '../api/products';
import { ListProductPayload, ProductInList } from '../types';

export const ListProducts = () => {
  const [listProduct] = useListProductMutation();
  const memoizedListProduct = useMemo(() => listProduct, [listProduct]);
  const [data, setData] = useState<{ rows: ProductInList[]; count: number }>({
    rows: [],
    count: 0,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnHelper = createColumnHelper<ProductInList>();
  const columns = [
    columnHelper.display({
      id: 'details',
      cell: (props) => (
        <button>
          <NavLink
            to={`/products/list/${props.row.original.id}/details`}
            className="block h-full w-full"
          >
            <FontAwesomeIcon icon={faEye} />
          </NavLink>
        </button>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: () => <span>名稱</span>,
      footer: (props) => props.column.id,
      meta: {
        filter: {
          variant: 'text',
          matchField: 'LIKE_name',
        },
      },
    }),
    columnHelper.accessor('status', {
      cell: (info) => sentenceCase(info.getValue()),
      header: () => <span>狀態</span>,
      footer: (props) => props.column.id,
      meta: {
        filter: {
          variant: 'select',
          matchField: 'EQUAL_status',
          options: [
            { label: 'All', value: '<--SELECT DEFAULT VALUE-->' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
          ],
        },
      },
      enableSorting: false,
    }),
    columnHelper.accessor('skus', {
      cell: (info) => {
        return (
          <div className="flex gap-1">
            {info.getValue().map((item) => (
              <div
                key={item.sku}
                className="rounded-xl bg-gray-300 px-2 py-1 text-sm"
              >
                {item.sku}
              </div>
            ))}
          </div>
        );
      },
      header: () => <span>SKU(s)</span>,
      footer: (props) => props.column.id,
      meta: {
        filter: {
          variant: 'text',
          matchField: 'IN_skus.sku',
        },
      },
      enableSorting: false,
    }),
    columnHelper.accessor('createdAt', {
      cell: (info) =>
        info.getValue()
          ? moment(info.getValue()).format('YYYY-MM-DD HH:mm')
          : '/',
      header: () => <span>創建時間</span>,
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('updatedAt', {
      cell: (info) =>
        info.getValue()
          ? moment(info.getValue()).format('YYYY-MM-DD HH:mm')
          : '/',
      header: () => <span>更新時間</span>,
      footer: (props) => props.column.id,
      enableColumnFilter: false,
    }),
  ];
  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    manualSorting: true,
    onSortingChange: setSorting,
    manualPagination: true,
    rowCount: data.count,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
  });

  const loadData = useCallback(
    debounce(async () => {
      const filter: ListProductPayload['filter'] = {};
      for (const columnFilter of columnFilters) {
        const column = table.getColumn(columnFilter.id);
        if (!column?.columnDef.meta?.filter) continue;
        const { matchField } = column.columnDef.meta.filter;
        if (columnFilter.value !== '<--SELECT DEFAULT VALUE-->')
          filter[matchField] = columnFilter.value as string | number;
      }
      const orderBy: ListProductPayload['orderBy'] = [];
      for (const { id, desc } of sorting)
        orderBy.push({ [id]: desc ? 'desc' : 'asc' });
      console.log('(loadData) FILTER!', filter);
      console.log('(loadData) ORDERBY!', orderBy);
      const res = await memoizedListProduct({
        skip: pagination.pageSize * pagination.pageIndex,
        take: pagination.pageSize,
        filter,
        orderBy,
      }).unwrap();
      console.log('(loadData) List Product RES', res);
      setData(res);
    }, 1200),
    [
      columnFilters,
      memoizedListProduct,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      table,
    ],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getHeaderFilter = (column: Column<ProductInList, unknown>) => {
    const columnFilter = column.columnDef.meta?.filter;
    const columnFilterValue = column.getFilterValue();
    switch (columnFilter?.variant) {
      case 'text': {
        return (
          <input
            className="h-[35px] rounded-md border px-2 font-normal"
            placeholder={'Search...'}
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={(columnFilterValue ?? '') as string}
          />
        );
      }
      case 'select': {
        const { options } = columnFilter;
        const id = column.id + '-select';
        return (
          <select
            id={id}
            name={id}
            className="h-[35px] rounded-md border px-2 font-normal"
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue as string | number}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      default:
        return null;
    }
  };

  const getHeader = () => {
    return (
      <thead>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <>
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className="px-6 py-3">
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <span
                            className="cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? ' ↕️'}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
              <tr key={headerGroup.id + '-filter'} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id + '-filter'} className="px-6 py-3">
                      <div>{getHeaderFilter(header.column)}</div>
                    </th>
                  );
                })}
              </tr>
            </>
          );
        })}
      </thead>
    );
  };

  const getNav = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPage = table.getPageCount() === 0 ? 1 : table.getPageCount();
    const pageLimit = table.getState().pagination.pageSize;
    return (
      <nav
        className="flex justify-between px-4 py-2"
        aria-label="Table navigation"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="limit">每頁顯示數目:</label>
          <select
            id="limit"
            name="limit"
            className="rounded-md border p-1"
            value={pageLimit}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <button
            disabled={currentPage === 1}
            className="rounded-full border border-blue-600 px-2 py-1 text-blue-600 disabled:border-inherit disabled:text-gray-300"
            onClick={() => table.getCanPreviousPage() && table.previousPage()}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            <p>頁數:</p>
            <input
              type="number"
              className="w-12 rounded-md border p-1"
              min={1}
              max={totalPage}
              value={currentPage}
              onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
            />
            <p>/ {totalPage.toLocaleString()}</p>
          </div>
          <button
            disabled={currentPage === totalPage}
            className="rounded-full border border-blue-600 px-2 py-1 text-blue-600 disabled:border-inherit disabled:text-gray-300"
            onClick={() => table.getCanNextPage() && table.nextPage()}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
          </button>
        </div>
      </nav>
    );
  };

  return (
    <NavigationLayout>
      <h2 className="mb-4 text-2xl font-medium">檢視產品</h2>
      <div className="w-full overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left">
          {getHeader()}
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="px-6 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {getNav()}
      </div>
    </NavigationLayout>
  );
};
