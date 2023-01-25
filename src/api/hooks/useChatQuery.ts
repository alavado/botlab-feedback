import { addHours, formatISO, isSameDay, parseISO } from 'date-fns'
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
  SchedulingSystem,
} from '../types/servicio'
import { get, parseAPIDate } from './utils'

const API_ROOT = process.env.REACT_APP_API_ROOT

type chatAPIInteractionID = {
  pollId: number
  userId: number
  start: Date
}

const useChatQuery = (
  id: chatAPIInteractionID
): UseQueryResult<
  {
    currentInteraction: Interaction
    pastInteractions: Interaction[]
    futureInteractions: Interaction[]
  },
  unknown
> => {
  const { pollId, userId, start } = id
  return useQuery<any, any, any>(
    ['interaction', pollId, userId, start],
    async () => {
      const { data }: { data: chatAPIResponse } = await get(
        `${API_ROOT}/chat/${pollId}/${userId}`
      )
      return splitInteractions(
        id,
        data.data.conversations,
        data.data.user.phone,
        data.data.bot.name
      )
    }
  )
}

const splitInteractions = (
  currentInteractionID: chatAPIInteractionID,
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
        conversations[0]
      ),
      pastInteractions: [],
      futureInteractions: conversations
        .slice(1)
        .map((c) =>
          conversationToInteraction(currentInteractionID, phone, botName, c)
        ),
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
      .map((c) =>
        conversationToInteraction(currentInteractionID, phone, botName, c)
      ),
    futureInteractions: conversations
      .slice(currentConversationIndex + 1)
      .map((c) =>
        conversationToInteraction(currentInteractionID, phone, botName, c)
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
          patientName: _.find(context, { target: nameTarget })?.value as string,
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
      patientName: _.find(context, { target: 'name' })?.value as string,
      url: getSchedulingSystemURL(conversation),
      schedulingSystem: inferSchedulingSystem(conversation),
    },
  ]
}

const conversationToInteraction = (
  interactionId: chatAPIInteractionID,
  phone: string,
  botName: string,
  conversation: chatAPIConversation
): Interaction => {
  const { pollId, userId, start } = interactionId
  const { context, messages } = conversation
  const interaction: Interaction = {
    userId,
    pollId,
    start: addHours(
      parseISO(conversation.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
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
    alerts: [],
    comments: [],
    botName,
  }
  return interaction
}

const getSchedulingSystemURL = (
  conversation: chatAPIConversation
): string | undefined => {
  return conversation.context.find((v) =>
    ['dentalink_link', 'medilink_link'].includes(v.target)
  )?.value
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
