import { Tag, isTag } from '../../../../api/types/domain'

export const getPresentationForTag = ({
  tag,
}: {
  tag: Tag | unknown
}): { icon: string; label: string; colorVar: string } => {
  if (!isTag(tag)) {
    if (!tag) {
      return {
        icon: '',
        label: '',
        colorVar: '',
      }
    }
    return {
      icon: 'mdi:question-mark',
      label: 'Otro',
      colorVar: '--color-out',
    }
  }
  switch (tag) {
    case 'YES':
      return {
        icon: 'mdi:check',
        label: 'Sí',
        colorVar: '--color-si',
      }
    case 'NO':
      return {
        icon: 'mdi:cancel',
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
    default:
      return {
        icon: 'mdi:question-mark',
        label: tag,
        colorVar: '--color-out',
      }
  }
}
