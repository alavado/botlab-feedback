import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { format } from 'date-fns/esm'
import { Interaction } from '../../../../api/types/servicio'
import './SearchResults.css'

const columnHelper = createColumnHelper<Interaction>()

const columns = [
  columnHelper.display({
    id: 'n',
    header: '#',
    cell: props => <div>{props.row.index + 1}</div>
  }),
  columnHelper.accessor('start', {
    header: 'Inicio interacción',
    cell: info => format(info.getValue(), 'yyyy-MM-dd HH:mm'),
  }),
  columnHelper.accessor('phone', {
    header: 'Teléfono',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(row => row.appointments, {
    id: `rut`,
    header: 'RUT',
    cell: info => info.getValue().map(v => <div>{v.rut}</div>),
  }),
  columnHelper.accessor(row => row.appointments, {
    id: `patient`,
    header: 'Nombre',
    cell: info => info.getValue().map(v => <div>{v.patientName}</div>),
  }),
  columnHelper.accessor(row => row.appointments[0].datetime, {
    id: `app_date`,
    header: 'Fecha de la cita',
    cell: info => format(info.getValue(), 'yyyy-MM-dd')
  }),
  columnHelper.accessor(row => row.appointments, {
    id: `app_time`,
    header: 'Hora de la cita',
    cell: info => info.getValue().map(v => <div>{format(v.datetime, 'HH:mm')}</div>),
  }),
  columnHelper.accessor('branch', {
    header: 'Sucursal',
    cell: info => info.getValue() || ''
  }),
]

const SearchResults = ({ data } : { data: Interaction[] }) => {

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="SearchResults">
      <table className="SearchResults__table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="SearchResults__header"
                  style={headerGroup.id === 'n' ? { border: 'none' } : {}}
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="SearchResults__cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SearchResults