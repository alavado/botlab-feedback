import { Icon } from '@iconify/react'
import {
  addDays,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import useDashboardDataQuery, {
  DashboardDayCount,
} from '../../../api/hooks/useDashboardDataQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import './Dashboard.css'
import Loader from '../../Loader/Loader'
import { es } from 'date-fns/locale'

type DashboardGroupByFilter = 'DAY' | 'WEEK' | 'MONTH'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(addDays(new Date(), -1))
  const [endDate, setEndDate] = useState(new Date())
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
  } = useDashboardDataQuery({
    startDate,
    endDate,
  })
  const [groupByFilter, setGroupByFilter] =
    useState<DashboardGroupByFilter>('DAY')

  const data = useMemo(() => {
    if (!dailyData) {
      return null
    }
    if (groupByFilter === 'WEEK') {
      const weeklyData: DashboardDayCount[] = []
      dailyData.forEach((day: DashboardDayCount) => {
        const weekStart = startOfWeek(day.date)
        if (!weeklyData.find((w) => isSameDay(w.date, weekStart))) {
          weeklyData.push({
            date: weekStart,
            total: 0,
            answered: 0,
          })
        }
        const i = weeklyData.findIndex((w) => isSameDay(w.date, weekStart))
        weeklyData[i].total += day.total
        weeklyData[i].answered += day.answered
      })
      return weeklyData
    }
    if (groupByFilter === 'MONTH') {
      const monthlyData: DashboardDayCount[] = []
      dailyData.forEach((day: DashboardDayCount) => {
        const monthStart = startOfMonth(day.date)
        if (!monthlyData.find((m) => isSameDay(m.date, monthStart))) {
          monthlyData.push({
            date: monthStart,
            total: 0,
            answered: 0,
          })
        }
        const i = monthlyData.findIndex((m) => isSameDay(m.date, monthStart))
        monthlyData[i].total += day.total
        monthlyData[i].answered += day.answered
      })
      return monthlyData
    }
    return dailyData
  }, [dailyData, groupByFilter])

  console.log({ data })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <p>{'' + error}</p>
  }

  return (
    <div className="Dashboard">
      <div className="Dashboard__topbar">
        <div className="Dashboard__topbar_left">
          <h2 className="Dashboard__title">Dashboard</h2>
        </div>
        <MenuUsuario />
      </div>
      <div className="Dashboard__container">
        <div className="Dashboard__top_filters">
          <div>
            Fecha inicio:{' '}
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(parseISO(e.target.value))}
            />
          </div>
          <div>
            Fecha termino:{' '}
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => setEndDate(parseISO(e.target.value))}
            />
          </div>
          <div>
            Agrupar datos:
            <select
              onChange={(e) =>
                setGroupByFilter(e.target.value as DashboardGroupByFilter)
              }
            >
              <option value="DAY">Por día</option>
              <option value="WEEK">Por semana</option>
              <option value="MONTH">Por mes</option>
            </select>
          </div>
        </div>
        <div className="Dashboard__sidebar">
          En construcción <Icon icon="mdi:account-hard-hat" />
        </div>
        <div className="Dashboard__chart">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Día',
                  },
                },
                y: {
                  min: 0,
                  title: {
                    display: true,
                    text: 'Citas',
                  },
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
            data={{
              labels: data.map((d: DashboardDayCount) => {
                switch (groupByFilter) {
                  case 'WEEK':
                    return 'Semana del ' + format(d.date, 'dd/MM')
                  case 'MONTH':
                    return format(d.date, 'MMMM', { locale: es })
                  default:
                    return format(d.date, 'dd/MM')
                }
              }),
              datasets: [
                {
                  label: 'Total',
                  data: data.map((d: DashboardDayCount) => d.total),
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                  label: 'Respondidas',
                  data: data.map((d: DashboardDayCount) => d.answered),
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
          />
        </div>
        <div className="Dashboard__big_numbers">
          <div
            className="Dashboard__big_number"
            style={{ backgroundColor: 'rgba(255, 99, 132, 1)' }}
          >
            <figure>
              {data.reduce((acc: any, v: any) => acc + v.total, 0)}
            </figure>
            <p>Contactadas</p>
          </div>
          <div
            className="Dashboard__big_number"
            style={{ backgroundColor: 'rgba(53, 162, 235, 1)' }}
          >
            <figure>
              {data.reduce((acc: any, v: any) => acc + v.answered, 0)}
            </figure>
            <p>Respondidas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
