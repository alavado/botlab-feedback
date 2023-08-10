import { tagPreffix } from '../../../../api/types/domain'

export const getPresentationForTag = ({
  tag,
}: {
  tag?: string
}): { icon: string; label: string; colorVar: string } => {
  if (!tag) {
    return {
      icon: '',
      label: '',
      colorVar: '',
    }
  }
  let tagWithoutPreffix = tag
  if (tag.startsWith(tagPreffix)) {
    tagWithoutPreffix = tag.substring(tagPreffix.length)
  }
  switch (tagWithoutPreffix) {
    case '':
      return {
        icon: '',
        label: '',
        colorVar: '',
      }
    case 'YES':
      return {
        icon: 'mdi:check',
        label: 'Sí',
        colorVar: '--color-si',
      }
    case 'NO':
      return {
        icon: 'mdi:close',
        label: 'No',
        colorVar: '--color-no',
      }
    case 'REAGENDA':
      return {
        icon: 'mdi:arrow-right',
        label: 'Reagenda',
        colorVar: '--color-reagenda',
      }
    case 'OUT':
      return {
        icon: 'mdi:question-mark',
        label: 'Out',
        colorVar: '--color-out',
      }
    case 'SIN RESPUESTA':
      return {
        icon: 'mdi:chat-outline',
        label: 'Sin respuesta',
        colorVar: '--color-unanswered',
      }
    case 'UNREACHABLE':
      return {
        icon: 'mdi:alert',
        label: 'Sin Whatsapp',
        colorVar: '--color-no',
      }
    default:
      return {
        icon: 'mdi:question-mark',
        label: tagWithoutPreffix,
        colorVar: '--color-out',
      }
  }
}
