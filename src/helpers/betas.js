export const encuestaTieneEmojisHabilitados = idEncuesta => {
  if (process.env.REACT_APP_REACCIONES_HABILITADAS == '0') {
    return false
  }
  const idsEncuestasConEmojis = process.env.REACT_APP_IDS_POLLS_REACCIONES_HABILITADAS?.split(',').map(Number) || []
  return idsEncuestasConEmojis.includes(Number(idEncuesta))
}