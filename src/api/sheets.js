import axios from 'axios'
import { formatISO } from 'date-fns'

export const agregarIssueAExcel = (nombreUsuario, cuenta, encuesta, tipo, descripcion) => {
  const body = {
    'parent': {
      'database_id': process.env.REACT_APP_NOTION_DATABASE_ID
    },
    'properties': {
      'Descripción': {
        'rich_text': [{
          'text': {
            'content': descripcion
          }
        }]
      },
      'Cuenta': {
        'rich_text': [{
          'text': {
            'content': cuenta
          }
        }]
      },
      'Encuesta': {
        'rich_text': [{
          'text': {
            'content': encuesta
          }
        }]
      },
      'Fecha': {
        'date': {
          'start':  formatISO(Date.now())
        }
      },
      'Tipo': {
        'select': {
          'name': tipo
        }
      },
      'Feedback URL': {
        'url': window.location.href
      },
      'Cliente': {
        'title': [{
          'text': {
            'content': nombreUsuario
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