import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ColumnFilter,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useListCategoriesMutation } from '../api/categories';
import { TListCategory } from '../types/categories';

export const Categories = () => {
  const [listCategories] = useListCategoriesMutation();
  const memoizedListCategory = useMemo(() => listCategories, [listCategories]);
  const [data, setData] = useState<{ rows: TListCategory[]; count: number }>({
    rows: [],
    count: 0,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnHelper = createColumnHelper<TListCategory>();
  const columns = [
    columnHelper.display({
      id: 'details',
      cell: (props) => (
        <button>
          {/* <NavLink
            to={`/products/categories/${props.row.original.id}`}
            className="block h-full w-full"
          >
            <FontAwesomeIcon icon={faEye} />
          </NavLink> */}
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
    </NavigationLayout>
  );
};
