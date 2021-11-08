import axios from 'axios'

export const agregarIssueADBNotion = () => {
  const body = {
    'parent': {
      'database_id': process.env.REACT_APP_NOTION_DATABASE_ID
    },
    'properties': {
        'Descripción': {
            'rich_text': [{
                'text': {
                    'content': 'd'
                }
            }]
        },
        'Cuenta': {
            'rich_text': [{
                'text': {
                    'content': 'c'
                }
            }]
        },
        'Encuesta': {
            'rich_text': [{
                'text': {
                    'content': 'e'
                }
            }]
        },
        'Fecha': {
            'date': {
                'start': '2021-11-08T11:00:00-03'
            }
        },
        'Tipo': {
            'select': {
                'name': 's'
            }
        },
        'Feedback URL': {
            'url': 'http://f'
        },
        'Cliente': {
            'title': [{
                'text': {
                    'content': 'c'
                }
            }]
        }
    }
  }
  return axios.post(
    'https://api.notion.com/v1/pages',
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_NOTION_TOKEN}`,
        'Notion-Version': '2021-08-16'
      },
    }
  )
}