import { UseQueryResult, useQuery } from 'react-query'
import useActiveServiceQuery from './useActiveServiceQuery'
import useInteractionsQuery from './useInteractionsQuery'

interface InteractionStatistics {
  totalCount: number
  answeredCount: number
  answeredPercentage: number
  unansweredCount: number
  confirmedCount: number
  cancelledCount: number
  rescheduledCount: number
  otherCount: number
}

const useInteractionsStatisticsQuery = (): UseQueryResult<
  InteractionStatistics,
  any
> => {
  const { data: service } = useActiveServiceQuery()
  const { data: interactions } = useInteractionsQuery({ applyFilters: true })

  return useQuery<InteractionStatistics, any, any>(
    ['interactions-stats', service?.id],
    async (): Promise<InteractionStatistics> => {
      if (!interactions) {
        return {
          totalCount: 0,
          answeredCount: 0,
          answeredPercentage: 0,
          unansweredCount: 0,
          confirmedCount: 0,
          cancelledCount: 0,
          rescheduledCount: 0,
          otherCount: 0,
        }
      }
      const totalCount = interactions.length
      const answeredCount = interactions.filter((i) =>
        i.tags.includes('ANSWERED_WHATSAPP')
      ).length
      const answeredPercentage = (100 * answeredCount) / (totalCount || 1)
      const unansweredCount = interactions.filter((i) =>
        i.tags.includes('UNANSWERED_WHATSAPP')
      ).length
      const confirmedCount = interactions.filter((i) =>
        i.tags.includes('CONFIRMED_WHATSAPP')
      ).length
      const cancelledCount = interactions.filter((i) =>
        i.tags.includes('CANCELLED_WHATSAPP')
      ).length
      const rescheduledCount = interactions.filter((i) =>
        i.tags.includes('RESCHEDULED_WHATSAPP')
      ).length
      const otherCount = interactions.filter((i) =>
        i.tags.includes('OTHER')
      ).length

      return {
        totalCount,
        answeredCount,
        answeredPercentage,
        unansweredCount,
        confirmedCount,
        cancelledCount,
        rescheduledCount,
        otherCount,
      }
    },
    {
      enabled: !!service && !!interactions,
    }
  )
}

export default useInteractionsStatisticsQuery
