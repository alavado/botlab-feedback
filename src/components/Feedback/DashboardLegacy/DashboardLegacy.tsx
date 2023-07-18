import { Icon } from '@iconify/react'
import { addDays, format, parseISO, startOfMonth, startOfWeek } from 'date-fns'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import useDashboardLegacyDataQuery from '../../../api/hooks/useDashboardLegacyDataQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import './DashboardLegacy.css'
import Loader from '../../Loader/Loader'

type DashboardLegacyGroupByFilter = 'DAY' | 'WEEK' | 'MONTH'

const DashboardLegacy = () => {
  const [startDate, setStartDate] = useState(addDays(new Date(), -1))
  const [endDate, setEndDate] = useState(new Date())
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useDashboardLegacyDataQuery({
    startDate,
    endDate,
  })
  const [groupByFilter, setGroupByFilter] =
    useState<DashboardLegacyGroupByFilter>('DAY')
  const [propertiesFilters, setPropertiesFilters] = useState<any>({})

  const data = useMemo(() => {
    if (!rawData) {
      return null
    }
    if (_.isEmpty(propertiesFilters)) {
      return rawData.map((date: any) => ({
        date,
        total: date.appointments.length,
        answered: date.appointments.filter((a: any) => a.answered).length,
      }))
    }
    const dailyData = rawData.map((date: any) => {
      const filteredAppointments = date.appointments.filter((app: any) =>
        _.every(
          Object.keys(app),
          (property: any) => propertiesFilters[property][app[property]]
        )
      )
      return {
        date: date.date,
        total: filteredAppointments.length,
        answered: filteredAppointments.filter((a: any) => a.answered).length,
      }
    })
    if (groupByFilter === 'WEEK') {
      const weeklyData: any[] = []
      dailyData.forEach((day: any) => {
        const weekStart = format(startOfWeek(parseISO(day.date)), 'yyyy-MM-dd')
        if (!weeklyData.find((w) => w.date === weekStart)) {
          weeklyData.push({
            date: weekStart,
            total: 0,
            answered: 0,
          })
        }
        const i = weeklyData.findIndex((w) => w.date === weekStart)
        weeklyData[i].total += day.total
        weeklyData[i].answered += day.answered
      })
      return weeklyData
    }
    if (groupByFilter === 'MONTH') {
      const monthlyData: any[] = []
      dailyData.forEach((day: any) => {
        const monthStart = format(
          startOfMonth(parseISO(day.date)),
          'yyyy-MM-dd'
        )
        if (!monthlyData.find((w) => w.date === monthStart)) {
          monthlyData.push({
            date: monthStart,
            total: 0,
            answered: 0,
          })
        }
        const i = monthlyData.findIndex((w) => w.date === monthStart)
        monthlyData[i].total += day.total
        monthlyData[i].answered += day.answered
      })
      return monthlyData
    }

    return dailyData
  }, [rawData, propertiesFilters, groupByFilter])

  const appointmentFilters = useMemo(() => {
    if (!rawData) {
      return []
    }
    const filters: any = {}
    rawData.forEach((day: any) => {
      day.appointments.forEach((app: any) => {
        const properties = Object.keys(app)
        properties.forEach((property: any) => {
          if (!filters[property]) {
            filters[property] = {}
          } else if (!filters[property][app[property]]) {
            filters[property][app[property]] = true
          }
        })
      })
    })
    setPropertiesFilters(filters)
    return Object.keys(filters).map((property: string) => ({
      property,
      values: Object.keys(filters[property]),
    }))
  }, [rawData])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <p>{'' + error}</p>
  }

  return (
    <div className="DashboardLegacy">
      <div className="DashboardLegacy__topbar">
        <div className="DashboardLegacy__topbar_left">
          <h2 className="DashboardLegacy__title">DashboardLegacy</h2>
        </div>
        <MenuUsuario />
      </div>
      <div className="DashboardLegacy__container">
        <div className="DashboardLegacy__top_filters">
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
                setGroupByFilter(e.target.value as DashboardLegacyGroupByFilter)
              }
            >
              <option value="DAY">Por día</option>
              <option value="WEEK">Por semana</option>
              <option value="MONTH">Por mes</option>
            </select>
          </div>
        </div>
        <div className="DashboardLegacy__sidebar">
          Filtrar citas
          {appointmentFilters
            .filter((f) => f.property !== 'answered' && f.values.length < 10)
            .map((filter: any) => (
              <div className="DashboardLegacy__filter_container">
                <p>{filter.property}</p>
                {filter.values.map((v: any) => (
                  <div className="DashboardLegacy__filter_checkbox_container">
                    <button
                      onClick={() =>
                        setPropertiesFilters({
                          ...propertiesFilters,
                          [filter.property]: {
                            ...propertiesFilters[filter.property],
                            [v]: !propertiesFilters[filter.property][v],
                          },
                        })
                      }
                    >
                      <Icon
                        icon={
                          propertiesFilters[filter.property][v]
                            ? 'mdi:check-bold'
                            : 'mdi:minus'
                        }
                      />
                    </button>
                    {v}
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="DashboardLegacy__chart">
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
              labels: data.map((d: any) => d.date),
              datasets: [
                {
                  label: 'Total',
                  data: data.map((d: any) => d.total),
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                  label: 'Respondidas',
                  data: data.map((d: any) => d.answered),
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
          />
        </div>
        <div className="DashboardLegacy__big_numbers">
          <div
            className="DashboardLegacy__big_number"
            style={{ backgroundColor: 'rgba(255, 99, 132, 1)' }}
          >
            <figure>
              {data.reduce((acc: any, v: any) => acc + v.total, 0)}
            </figure>
            <p>Contactadas</p>
          </div>
          <div
            className="DashboardLegacy__big_number"
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

export default DashboardLegacy
