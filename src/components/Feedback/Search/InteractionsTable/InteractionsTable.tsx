import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
} from '@tanstack/react-table'
import { format } from 'date-fns/esm'
import { Interaction } from '../../../../api/types/servicio'
import { useVirtual } from 'react-virtual'
import './InteractionsTable.css'
import { MouseEventHandler, useRef } from 'react'

const columnHelper = createColumnHelper<Interaction>()

const columns = [
  columnHelper.display({
    id: 'n',
    header: '#',
    cell: (props) => <div>{props.row.index + 1}</div>,
  }),
  columnHelper.accessor('start', {
    header: 'Inicio interacción',
    cell: (info) => format(info.getValue(), 'dd/MM/yy HH:mm'),
  }),
  columnHelper.accessor('phone', {
    header: 'Teléfono',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.appointments, {
    id: `rut`,
    header: 'RUT',
    cell: (info) =>
      info
        .getValue()
        .map((v) => (
          <div className="InteractionsTable__multi_cell">{v.rut}</div>
        )),
  }),
  columnHelper.accessor((row) => row.appointments, {
    id: `patient`,
    header: 'Nombre',
    cell: (info) =>
      info
        .getValue()
        .map((v) => (
          <div className="InteractionsTable__multi_cell">{v.patientName}</div>
        )),
  }),
  columnHelper.accessor((row) => row.appointments[0].datetime, {
    id: `app_date`,
    header: 'Fecha cita',
    cell: (info) => format(info.getValue(), 'dd/MM'),
  }),
  columnHelper.accessor((row) => row.appointments, {
    id: `app_time`,
    header: 'Hora cita',
    cell: (info) =>
      info.getValue().map((v) => {
        const time = format(v.datetime, 'HH:mm')
        if (time === '00:00') {
          return <div className="InteractionsTable__multi_cell">-</div>
        }
        return <div className="InteractionsTable__multi_cell">{time}</div>
      }),
  }),
  columnHelper.accessor((row) => row.appointments, {
    id: `app_id`,
    header: 'ID cita',
    cell: (info) =>
      info
        .getValue()
        .map((v) => (
          <div className="InteractionsTable__multi_cell">{v.id}</div>
        )),
  }),
  columnHelper.accessor('branch', {
    header: 'Sucursal',
    cell: (info) => info.getValue() || '',
  }),
]

interface InteractionsTableParams {
  data: Interaction[]
  onRowClick: MouseEventHandler
}

const InteractionsTable = ({ data, onRowClick }: InteractionsTableParams) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                onClick={onRowClick}
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

export default InteractionsTable
