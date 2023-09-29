export const getAlertButtonTitle = (solved: boolean): string => {
  return solved
    ? 'Marcar que esta alerta no ha sido resuelta'
    : 'Marcar que resolviste esta alerta'
}

export const getAlertButtonIcon = (solved: boolean): string => {
  return solved ? 'mdi:undo' : 'mdi:check-bold'
}

export const getAlertButtonLabel = (solved: boolean): string => {
  return solved ? 'Marcar pendiente' : 'Marcar resuelta'
}
