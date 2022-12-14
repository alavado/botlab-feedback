import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
  ColumnFiltersState,
  Column,
  getFilteredRowModel,
  FilterFn,
  ColumnDef,
  getFacetedRowModel,
  getFacetedUniqueValues,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table'
import { format } from 'date-fns/esm'
import { Interaction } from '../../../../api/types/servicio'
import { useVirtual } from 'react-virtual'
import './InteractionsTable.css'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

const columnHelper = createColumnHelper<Interaction>()

const multiAppointmentDataSeparator = ' + '

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const columns: ColumnDef<Interaction, any>[] = [
  columnHelper.display({
    id: 'n',
    header: '#',
    cell: (props) => <div>{props.row.index + 1}</div>,
  }),
  {
    id: 'start',
    accessorFn: (row) => format(row.start, 'dd/MM/yy HH:mm'),
    header: 'Inicio interacción',
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
  },
  {
    id: 'phone',
    accessorFn: (row) => row.phone,
    header: 'Teléfono',
    filterFn: 'fuzzy',
  },
  {
    id: 'rut',
    accessorFn: (row) =>
      row.appointments.map((a) => a.rut).join(multiAppointmentDataSeparator),
    header: 'RUT',
    filterFn: 'fuzzy',
    cell: (info) =>
      info
        .getValue()
        .split(multiAppointmentDataSeparator)
        .map((v: string) => (
          <div className="InteractionsTable__multi_cell">{v}</div>
        )),
  },
  {
    id: 'patient',
    accessorFn: (row) =>
      row.appointments
        .map((a) => a.patientName)
        .join(multiAppointmentDataSeparator),
    header: 'Nombre',
    filterFn: 'fuzzy',
    cell: (info) =>
      info
        .getValue()
        .split(multiAppointmentDataSeparator)
        .map((v: string) => (
          <div className="InteractionsTable__multi_cell">{v}</div>
        )),
  },
  {
    id: 'app_date',
    accessorFn: (row) => format(row.appointments[0].datetime, 'dd/MM'),
    header: 'Fecha cita',
    filterFn: 'fuzzy',
  },
  {
    id: 'app_time',
    accessorFn: (row) =>
      row.appointments
        .map((a) => format(a.datetime, 'HH:mm'))
        .join(multiAppointmentDataSeparator),
    header: 'Hora cita',
    filterFn: 'fuzzy',
    cell: (info) =>
      info
        .getValue()
        .split(multiAppointmentDataSeparator)
        .map((v: string) => {
          if (v === '00:00') {
            return <div className="InteractionsTable__multi_cell">-</div>
          }
          return <div className="InteractionsTable__multi_cell">{v}</div>
        }),
  },
  {
    id: 'app_id',
    accessorFn: (row) =>
      row.appointments.map((a) => a.id).join(multiAppointmentDataSeparator),
    header: 'ID cita',
    filterFn: 'fuzzy',
    cell: (info) =>
      info
        .getValue()
        .split(multiAppointmentDataSeparator)
        .map((v: string) => (
          <div className="InteractionsTable__multi_cell">{v}</div>
        )),
  },
  {
    id: 'branch',
    accessorFn: (row) => row.branch,
    header: 'Sucursal',
    filterFn: 'fuzzy',
  },
]

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

interface InteractionsTableProps {
  data: Interaction[]
  onRowClick: Function
}

const InteractionsTable = ({ data, onRowClick }: InteractionsTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  })
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 20,
  })
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <div ref={tableContainerRef} className="InteractionsTable">
      <table className="InteractionsTable__table">
        <thead className="InteractionsTable__thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="InteractionsTable__th"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} />
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow: any) => {
            const row = rows[virtualRow.index] as Row<Interaction>
            return (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className="InteractionsTable__tr"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="InteractionsTable__td">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return (
    <>
      {column.id === 'branch' && (
        <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
      )}
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Filtrar... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default InteractionsTable
