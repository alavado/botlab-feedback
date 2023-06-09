import axios from 'axios'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { FiltersAPIResponse } from '../types/responses'

export enum MetricFilterByAppointmentPropertyKind {
  'LEVELS',
  'FREEFORM',
}

export type MetricFilterByAppointmentProperty =
  | {
      id: string
      kind: MetricFilterByAppointmentPropertyKind.LEVELS
      label: string
      values: string[]
    }
  | {
      id: string
      kind: MetricFilterByAppointmentPropertyKind.FREEFORM
      label: string
    }

const useMetricsFiltersQuery = (): UseQueryResult<
  MetricFilterByAppointmentProperty[],
  any
> => {
  const { idCliente } = useSelector((state: RootState) => state.login)

  return useQuery<any, any, any>(['metrics-filters', idCliente], async () => {
    const { data }: { data: FiltersAPIResponse } = await axios.get(
      `https://dashboard-api-ysuyrps2hq-tl.a.run.app/client/${idCliente}/filters`
    )
    return data.filters.map(
      (f): MetricFilterByAppointmentProperty =>
        f.values
          ? {
              kind: MetricFilterByAppointmentPropertyKind.LEVELS,
              id: f.filter_name,
              label: f.display_name,
              values: f.values,
            }
          : {
              kind: MetricFilterByAppointmentPropertyKind.FREEFORM,
              id: f.filter_name,
              label: f.display_name,
            }
    )
  })
}

export default useMetricsFiltersQuery
