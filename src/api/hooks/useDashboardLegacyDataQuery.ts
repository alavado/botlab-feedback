import axios from 'axios'
import { addDays, differenceInDays, format, parseISO } from 'date-fns'
import { max, min } from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

const useDashboardLegacyDataQuery = ({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): UseQueryResult<any, unknown> => {
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { idCliente } = useSelector((state: RootState) => state.login)

  return useQuery<any, any, any>(
    ['dashboard', start, end],
    async () => {
      const { data } = await axios.get(
        `https://dashboard-api-ysuyrps2hq-tl.a.run.app/client/${idCliente}/metrics?start_date=${start}&end_date=${end}`
      )
      const dataByDate: any = {}
      data.citas.forEach((appointment: any) => {
        const date = format(parseISO(appointment.fecha), 'yyyy-MM-dd')
        if (!dataByDate[date]) {
          dataByDate[date] = {
            appointments: [],
          }
        }
        if (appointment.eventos.some((e: any) => e.nombre === 'carga')) {
          dataByDate[date].appointments.push({
            ...appointment.datos,
            answered: appointment.eventos.some(
              (e: any) => e.nombre === 'respuesta'
            ),
          })
        }
      })

      let currentDate = parseISO(min(Object.keys(dataByDate)) as string)
      const maxDate = parseISO(max(Object.keys(dataByDate)) as string)

      const allDates = []
      while (differenceInDays(maxDate, currentDate) >= 0) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd')
        if (!dataByDate[formattedDate]) {
          allDates.push({
            date: formattedDate,
            appointments: [],
          })
        } else {
          allDates.push({
            date: formattedDate,
            appointments: dataByDate[formattedDate].appointments,
          })
        }
        currentDate = addDays(currentDate, 1)
      }

      return allDates
    },
    { refetchOnWindowFocus: false }
  )
}

export default useDashboardLegacyDataQuery
