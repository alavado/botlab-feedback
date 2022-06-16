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