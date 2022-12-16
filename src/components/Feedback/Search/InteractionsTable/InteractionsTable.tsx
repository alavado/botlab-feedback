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
import classNames from 'classnames'
import { isSameDay } from 'date-fns'
import { Icon } from '@iconify/react'

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
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const CopyDiv = ({
  text,
  className,
}: {
  text: string | undefined
  className: string
}) => {
  return (
    <div
      className={classNames({
        [className]: true,
        InteractionsTable__copy_div: true,
      })}
    >
      <span>{text}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          navigator.clipboard.writeText(text || '')
        }}
        title="Copiar"
        className="InteractionsTable__copy_div_button"
      >
        <Icon icon="mdi:content-copy" />
      </button>
    </div>
  )
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
    cell: (info) => (
      <CopyDiv
        className="InteractionsTable__multi_cell"
        text={info.getValue()}
      />
    ),
  },
  {
    id: 'phone',
    accessorFn: (row) => row.phone,
    header: 'Teléfono',
    filterFn: 'fuzzy',
    cell: (info) => (
      <CopyDiv
        className="InteractionsTable__multi_cell"
        text={info.getValue()}
      />
    ),
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
          <CopyDiv className="InteractionsTable__multi_cell" text={v} />
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
          <CopyDiv className="InteractionsTable__multi_cell" text={v} />
        )),
  },
  {
    id: 'app_date',
    accessorFn: (row) => format(row.appointments[0].datetime, 'dd/MM'),
    header: 'Fecha cita',
    filterFn: 'fuzzy',
    cell: (info) => (
      <CopyDiv
        className="InteractionsTable__multi_cell"
        text={info.getValue()}
      />
    ),
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
          return <CopyDiv className="InteractionsTable__multi_cell" text={v} />
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
          <CopyDiv className="InteractionsTable__multi_cell" text={v} />
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
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

const isSameInteraction = (
  i1: Interaction | undefined,
  i2: Interaction | undefined
): boolean => {
  if (!i1 || !i2) {
    return false
  }
  return (
    i1.pollId === i2.pollId &&
    i1.userId === i2.userId &&
    isSameDay(i1.appointments[0].datetime, i2.appointments[0].datetime)
  )
}

interface InteractionsTableProps {
  data: Interaction[]
  highlighted?: Interaction
  onRowClick: Function
}

const InteractionsTable = ({
  data,
  highlighted,
  onRowClick,
}: InteractionsTableProps) => {
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
                <th key={header.id} className="InteractionsTable__th">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {data.length > 0 && header.column.getCanFilter() ? (
                    <div className="InteractionsTable__filter_container">
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
                className={classNames({
                  InteractionsTable__tr: true,
                  'InteractionsTable__tr--highlighted': isSameInteraction(
                    row.original,
                    highlighted
                  ),
                })}
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
