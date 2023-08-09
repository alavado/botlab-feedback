import { formatISO, isSameDay, parseISO } from 'date-fns'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import {
  ChatAPIConversation,
  ChatAPIConversationContextField,
  ChatAPIResponse,
  MetaTarget,
} from '../types/responses'
import {
  Appointment,
  Interaction,
  InteractionId,
  Message,
  SchedulingSystem,
} from '../types/domain'
import {
  get,
  API_ROOT,
  parseAPIDate,
  getStatusFromChatConversation,
  getInteractionStatus,
} from './utils'

const useChatQuery = (
  interactionId?: InteractionId
): UseQueryResult<
  {
    currentInteraction: Interaction
    pastInteractions: Interaction[]
    futureInteractions: Interaction[]
  },
  unknown
> => {
  return useQuery<any, any, any>(
    ['interaction', interactionId],
    async () => {
      if (!interactionId) {
        return []
      }
      const { serviceId, patientId } = interactionId
      const { data }: { data: ChatAPIResponse } = await get(
        `${API_ROOT}/chat/${serviceId}/${patientId}`
      )
      return splitInteractions(
        interactionId,
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
  currentInteractionID: InteractionId,
  conversations: ChatAPIConversation[],
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

const getPatientName = (
  context: ChatAPIConversationContextField[],
  appointmentIndex?: number
) => {
  if (!appointmentIndex) {
    const nameTarget = `name` as MetaTarget
    const nameMeta = _.find(context, { target: nameTarget })
    if (!nameMeta) {
      let givenNameTarget = `Nombre` as MetaTarget
      let familyNameTarget = `Apellidos` as MetaTarget
      const givenName = _.trim(
        _.find(context, { target: givenNameTarget })?.value || ''
      )
      const familyName = _.trim(
        _.find(context, { target: familyNameTarget })?.value || ''
      )
      return _.startCase(_.lowerCase(`${givenName} ${familyName}`))
    } else {
      return _.startCase(_.lowerCase(_.trim(nameMeta.value as string)))
    }
  }
  const nameTarget = `patient_name_${appointmentIndex}` as MetaTarget
  const nameMeta = _.find(context, { target: nameTarget })
  if (!nameMeta) {
    let givenNameTarget = `Nombre ${appointmentIndex}` as MetaTarget
    let familyNameTarget = `Apellidos ${appointmentIndex}` as MetaTarget
    const givenName = _.trim(
      _.find(context, { target: givenNameTarget })?.value || ''
    )
    const familyName = _.trim(
      _.find(context, { target: familyNameTarget })?.value || ''
    )
    return _.startCase(_.lowerCase(`${givenName} ${familyName}`))
  } else {
    return _.startCase(_.lowerCase(_.trim(nameMeta.value as string)))
  }
}

const extractAppointments = (
  start: Date,
  conversation: ChatAPIConversation
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
        const dateTarget = `date_${appointmentIndex}` as MetaTarget
        const timeTarget = `time_${appointmentIndex}` as MetaTarget
        const rutTarget = `rut_${appointmentIndex}` as MetaTarget
        return {
          datetime: parseAPIDate(
            (_.find(context, { target: dateTarget })?.value ||
              _.find(context, { target: 'date_1' })?.value) as string,
            _.find(context, { target: timeTarget })?.value as string,
            formatISO(start)
          ),
          rut: _.find(context, { target: rutTarget })?.value as string,
          patientName: getPatientName(context, appointmentIndex),
          url: getSchedulingSystemURL(conversation),
          schedulingSystem: inferSchedulingSystem(conversation),
          status: getStatusFromChatConversation(conversation),
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
      patientName: getPatientName(context),
      url: getSchedulingSystemURL(conversation),
      schedulingSystem: inferSchedulingSystem(conversation),
      status: getStatusFromChatConversation(conversation),
    },
  ]
}

const conversationToInteraction = (
  interactionId: InteractionId,
  phone: string,
  botName: string,
  conversation: ChatAPIConversation
): Interaction => {
  const { serviceId, patientId, start } = interactionId
  const { context, messages } = conversation
  const appointments = extractAppointments(start, conversation)
  const interaction = {
    id: {
      patientId: patientId,
      serviceId: serviceId,
      start: parseISO(conversation.start),
    },
    appointments,
    branch: _.find(context, { target: 'sucursal_name' })?.value,
    phone,
    messages: messages.map(
      (message): Message => ({
        sender: message.type === 'bot' ? 'BOT' : 'USER',
        content: message.message,
        timestamp: parseISO(message.timestamp),
        type: 'TEXTO',
        id: message.type === 'bot' ? -1 : message.answer_id,
        tag: message.type === 'user' ? message.tag : undefined,
      })
    ),
    comments: [],
    botName,
    extraData: context.map((meta) => ({
      header: meta.title,
      value: meta.value,
    })),
    status: getInteractionStatus(appointments),
  }
  return {
    ...interaction,
    normalized: JSON.stringify(interaction).toLowerCase(),
  }
}

const getSchedulingSystemURL = (
  conversation: ChatAPIConversation
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
  conversation: ChatAPIConversation
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
