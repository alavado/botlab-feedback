interface chatAPIUserMessage {
  answer_id: number,
  message: string,
  question_id: number,
  tag: string,
  timestamp: string,
  type: 'user'
}

interface chatAPIBotMessage {
  timestamp: string,
  message: string,
  type: 'bot'
}

export type chatAPIMessage = chatAPIUserMessage | chatAPIBotMessage

export interface chatAPIResponse {
  status: string,
  data: {
    bot: {
      name: string,
      phone: string
    },
    conversations: [{
      context: any,
      start: string,
      messages: chatAPIMessage[],
      reactions: [any],
      tags: [{
        question: string,
        question_id: string,
        tag: string
      }]
    }],
    user: {
      id: number,
      outsider: boolean,
      phone: string,
      timestamp: string
    }
  }
}

export interface reactionsAPIResponse {
  status: string,
  data: [{
    created_at: string,
    id: number,
    reaction_emoji: string,
    reaction_text: string,
  }]
}

export interface alertasAPIResponse {
  status: string,
  data: [{
    dismissal_by?: string,
    dismissal_by_username?: string,
    dismissal_updated_at?: string,
    dismissed: boolean,
    id: number,
    message: string,
    meta: any,
    poll_id: number,
    timestamp_first_effective_interaction: string,
    timestamp_poll_started: string,
    user_id: number,
    utc_timestamp: string,
  }]
}