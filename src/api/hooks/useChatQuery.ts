import { formatISO, isSameDay, parseISO } from 'date-fns'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import {
  chatAPIConversation,
  chatAPIResponse,
  metaTarget,
} from '../types/responses'
import {
  Appointment,
  Interaction,
  Message,
  PatientId,
  SchedulingSystem,
  ServiceId,
} from '../types/types'
import { get, API_ROOT, parseAPIDate } from './utils'

type InteractionID = {
  serviceId: ServiceId
  patientId: PatientId
  start: Date
}

const useChatQuery = (
  id: InteractionID
): UseQueryResult<
  {
    currentInteraction: Interaction
    pastInteractions: Interaction[]
    futureInteractions: Interaction[]
  },
  unknown
> => {
  const { serviceId, patientId, start } = id
  return useQuery<any, any, any>(
    ['interaction', serviceId, patientId, start],
    async () => {
      const { data }: { data: chatAPIResponse } = await get(
        `${API_ROOT}/chat/${serviceId}/${patientId}`
      )
      return splitInteractions(
        id,
        data.data.conversations,
        data.data.user.phone,
        data.data.bot.name
      )
    },
    {
      refetchInterval: 30_000,
    }
  )
}

const splitInteractions = (
  currentInteractionID: InteractionID,
  conversations: chatAPIConversation[],
  phone: string,
  botName: string
): {
  currentInteraction: Interaction
  pastInteractions: Interaction[]
  futureInteractions: Interaction[]
} => {
  const currentConversationIndex = conversations.findIndex((c: any) =>
    isSameDay(parseISO(c.start), currentInteractionID.start)
  )
  if (currentConversationIndex < 0) {
    return {
      currentInteraction: conversationToInteraction(
        currentInteractionID,
        phone,
        botName,
        conversations.slice(-1)[0]
      ),
      pastInteractions: conversations
        .slice(0, -1)
        .map((conversation) =>
          conversationToInteraction(
            currentInteractionID,
            phone,
            botName,
            conversation
          )
        ),
      futureInteractions: [],
    }
  }
  return {
    currentInteraction: conversationToInteraction(
      currentInteractionID,
      phone,
      botName,
      conversations[currentConversationIndex]
    ),
    pastInteractions: conversations
      .slice(0, currentConversationIndex)
      .map((conversation) =>
        conversationToInteraction(
          currentInteractionID,
          phone,
          botName,
          conversation
        )
      ),
    futureInteractions: conversations
      .slice(currentConversationIndex + 1)
      .map((conversation) =>
        conversationToInteraction(
          currentInteractionID,
          phone,
          botName,
          conversation
        )
      ),
  }
}

const extractAppointments = (
  start: Date,
  conversation: chatAPIConversation
): Appointment[] => {
  const { context } = conversation
  const appointmentsCount: number = Number(
    _.find(context, { target: 'n_appointments' })?.value || 1
  )
  if (appointmentsCount > 1) {
    return Array(appointmentsCount)
      .fill(0)
      .map((n, i: number) => {
        const appointmentIndex = i + 1
        const dateTarget = `date_${appointmentIndex}` as metaTarget
        const timeTarget = `time_${appointmentIndex}` as metaTarget
        const rutTarget = `rut_${appointmentIndex}` as metaTarget
        const nameTarget = `patient_name_${appointmentIndex}` as metaTarget
        return {
          datetime: parseAPIDate(
            (_.find(context, { target: dateTarget })?.value ||
              _.find(context, { target: 'date_1' })?.value) as string,
            _.find(context, { target: timeTarget })?.value as string,
            formatISO(start)
          ),
          rut: _.find(context, { target: rutTarget })?.value as string,
          patientName: _.trim(
            _.find(context, { target: nameTarget })?.value as string
          ),
          url: getSchedulingSystemURL(conversation),
          schedulingSystem: inferSchedulingSystem(conversation),
        }
      })
  }
  return [
    {
      datetime: parseAPIDate(
        _.find(context, { target: 'date' })?.value as string,
        _.find(context, { target: 'time' })?.value as string,
        formatISO(start)
      ),
      rut: _.find(context, { target: 'rut' })?.value as string,
      patientName: _.trim(_.find(context, { target: 'name' })?.value as string),
      url: getSchedulingSystemURL(conversation),
      schedulingSystem: inferSchedulingSystem(conversation),
    },
  ]
}

const conversationToInteraction = (
  interactionId: InteractionID,
  phone: string,
  botName: string,
  conversation: chatAPIConversation
): Interaction => {
  const { serviceId, patientId, start } = interactionId
  const { context, messages } = conversation
  const interaction: Interaction = {
    patientId: patientId,
    serviceId: serviceId,
    start: parseISO(conversation.start),
    appointments: extractAppointments(start, conversation),
    branch: _.find(context, { target: 'sucursal_name' })?.value,
    phone,
    messages: messages.map(
      (message): Message => ({
        sender: message.type === 'bot' ? 'BOT' : 'USER',
        content: message.message,
        timestamp: parseISO(message.timestamp),
        type: 'TEXTO',
        id: message.type === 'bot' ? -1 : message.answer_id,
      })
    ),
    comments: [],
    botName,
    meta: context.map((meta) => ({
      label: meta.title,
      value: meta.value,
    })),
  }
  return interaction
}

const getSchedulingSystemURL = (
  conversation: chatAPIConversation
): string | undefined => {
  try {
    return conversation.context.find((v) =>
      ['dentalink_link', 'medilink_link'].includes(v.target)
    )?.value
  } catch (e) {
    console.log(e)
    return undefined
  }
}

const inferSchedulingSystem = (
  conversation: chatAPIConversation
): SchedulingSystem => {
  if (conversation.context.find((v) => v.target === 'dentalink_link')) {
    return 'Dentalink'
  }
  if (conversation.context.find((v) => v.target === 'medilink_link')) {
    return 'Medilink'
  }
  return 'Otro'
}

export default useChatQuery
