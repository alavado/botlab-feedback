import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { Alert, PatientId, ServiceId } from '../types/types'
import useActiveAlertsQuery, { ActiveAlerts } from './useActiveAlertsQuery'

const getActiveAlertsForPatient = (
  activeAlerts: ActiveAlerts = { pending: [], solved: [] },
  serviceId: ServiceId,
  patientId: PatientId
) => {
  const alerts = [...activeAlerts.pending, ...activeAlerts.solved]
  return alerts.filter((alert) =>
    _.isEqual([alert.patientId, alert.serviceId], [patientId, serviceId])
  )
}

const useAlertsForPatientQuery = ({
  serviceId,
  patientId,
}: {
  serviceId?: ServiceId
  patientId?: PatientId
}): UseQueryResult<Alert[], unknown> => {
  const { data: activeAlerts } = useActiveAlertsQuery()

  return useQuery<Alert[], any, any>(
    ['alerts', serviceId, patientId],
    async () => {
      if (!serviceId || !patientId) {
        return []
      }
      return getActiveAlertsForPatient(activeAlerts, serviceId, patientId)
    },
    {
      enabled: !!activeAlerts,
    }
  )
}

export default useAlertsForPatientQuery
