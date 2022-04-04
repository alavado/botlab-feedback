/* 
  onClick={() => dispatch(agregaFiltro({
    busqueda: 'Toluca',
    nombreHeader: 'sucursal_name',
    textoHeader: 'Sucursal',
    idEncuesta: 464,
    opciones: {
      filtroImplicito: true
    }
  }))} */

export const obtenerFiltrosExtra = idCliente => {
  switch (idCliente) {
    case 131:
      return [
        {
          etiqueta: 'Zona',
          nombreHeader: 'zona',
          textoHeader: 'Zona'
        }
      ]
    default:
      return []
  }
}