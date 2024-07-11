import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { TListQuery } from '@/types';
import {
  faChevronLeft,
  faChevronRight,
  faEye,
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
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useListCategoriesMutation } from '../api/categories';
import { TCategoryInList } from '../types/categories';

export const Categories = () => {
  const [listCategories] = useListCategoriesMutation();
  const memoizedListCategories = useMemo(
    () => listCategories,
    [listCategories],
  );
  const [data, setData] = useState<{ rows: TCategoryInList[]; count: number }>({
    rows: [],
    count: 0,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnHelper = createColumnHelper<TCategoryInList>();
  const columns = [
    columnHelper.display({
      id: 'details',
      cell: (props) => (
        <button>
          <NavLink
            to={`/products/categories/${props.row.original.id}`}
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
    columnHelper.accessor('slug', {
      cell: (info) => info.getValue(),
      header: () => <span>URL Slug</span>,
      footer: (props) => props.column.id,
      meta: {
        filter: {
          variant: 'text',
          matchField: 'LIKE_slug',
        },
      },
    }),
    columnHelper.accessor('parent.slug', {
      cell: (info) => {
        // console.log('aa', info.row.original.parent);
        console.log(info.row.original);
        return info.getValue();
      },
      header: () => <span>Parent Slug</span>,
      footer: (props) => props.column.id,
      meta: {
        filter: {
          variant: 'text',
          matchField: 'LIKE_parent.slug',
        },
      },
      enableSorting: false,
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
      const filter: TListQuery['filter'] = {};
      for (const columnFilter of columnFilters) {
        const column = table.getColumn(columnFilter.id);
        if (!column?.columnDef.meta?.filter) continue;
        const { matchField } = column.columnDef.meta.filter;
        if (columnFilter.value !== '<--SELECT DEFAULT VALUE-->')
          filter[matchField] = columnFilter.value as string | number;
      }
      const orderBy: TListQuery['orderBy'] = [];
      for (const { id, desc } of sorting)
        orderBy.push({ [id]: desc ? 'desc' : 'asc' });
      const response = await memoizedListCategories({
        skip: pagination.pageSize * pagination.pageIndex,
        take: pagination.pageSize,
        filter,
        orderBy,
      }).unwrap();
      console.log('(loadData) List Categories RES', response);
      setData(response);
    }, 1200),
    [
      columnFilters,
      memoizedListCategories,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      table,
    ],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getHeaderFilter = (column: Column<TCategoryInList, unknown>) => {
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
            {options?.map((option, i) => (
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
            <React.Fragment key={'header-group-' + headerGroup.id}>
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header, i) => {
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
              <tr key={'filter-row-' + headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={'filter-row-' + header.id} className="px-6 py-3">
                      <div>{getHeaderFilter(header.column)}</div>
                    </th>
                  );
                })}
              </tr>
            </React.Fragment>
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
            className="rounded-full border border-blue px-2 py-1 text-blue disabled:border-inherit disabled:text-gray-300"
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
            className="rounded-full border border-blue px-2 py-1 text-blue disabled:border-inherit disabled:text-gray-300"
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
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-medium">管理分類</h2>
        <Link
          to="/products/categories/create"
          className="rounded bg-orange px-4 py-2 text-white"
        >
          創建
        </Link>
      </div>
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
