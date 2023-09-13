import { createSlice } from '@reduxjs/toolkit'
import { formatISO9075, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import diccionarioTags from '../../helpers/tags'
import { obtenerTagsCalculados } from '../../helpers/tagsCalculados'
import { CANAL_HEADER_NAME } from './encuestas'

export const normalizar = (s) =>
  (s.tag ?? s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const funcionFiltro = (
  r,
  nombreHeader,
  terminoNormalizado,
  idEncuesta,
  calceExacto = false
) => {
  const tagCalculado = obtenerTagsCalculados(idEncuesta)?.find(
    (t) => t.nombre === nombreHeader
  )
  if (tagCalculado) {
    const tagEnDiccionario = diccionarioTags(tagCalculado.f(r).tag)
    if (tagEnDiccionario) {
      return normalizar(tagEnDiccionario.id).indexOf(terminoNormalizado) >= 0
    } else if (!isNaN(tagCalculado.f(r).tag)) {
      return normalizar(tagCalculado.f(r).tag).indexOf(terminoNormalizado) >= 0
    } else {
      return normalizar(tagCalculado.f(r).text).indexOf(terminoNormalizado) >= 0
    }
  }
  if (nombreHeader === 'sucursal_name') {
    return r.respuestaNormalizada[nombreHeader] === terminoNormalizado
  }
  if (calceExacto) {
    return r.respuestaNormalizada[nombreHeader] === terminoNormalizado
  }
  return r.respuestaNormalizada[nombreHeader].indexOf(terminoNormalizado) >= 0
}

const ordenarPorFechaCita =
  (orden = 'ASC') =>
  (r1, r2) => {
    try {
      const propHora = r1.time
        ? 'time'
        : r1.time_1
        ? 'time_1'
        : 'time_truncated'
      const propFecha = r1.time || r1.time_truncated ? 'date' : 'date_1'
      const formato = r1[propHora].includes('M')
        ? "d 'de' MMMM h:m a"
        : "d 'de' MMMM H:m"
      const fecha1 = parse(
        `${r1[propFecha]} ${r1[propHora]}`,
        formato,
        new Date(),
        { locale: es }
      )
      const fecha2 = parse(
        `${r2[propFecha]} ${r2[propHora]}`,
        formato,
        new Date(),
        { locale: es }
      )
      return orden === 'ASC'
        ? fecha1 > fecha2
          ? 1
          : -1
        : fecha1 < fecha2
        ? 1
        : -1
    } catch (e) {
      console.log(e)
      return 1
    }
  }

const funcionDeOrdenamiento = (header, orden = 'ASC') => {
  if (header.includes('time') || header.includes('date')) {
    return ordenarPorFechaCita(orden)
  }
  return orden === 'ASC'
    ? (r1, r2) => (normalizar(r1[header]) < normalizar(r2[header]) ? -1 : 1)
    : (r1, r2) => (normalizar(r1[header]) > normalizar(r2[header]) ? -1 : 1)
}

const sliceRespuestas = createSlice({
  name: 'respuestas',
  initialState: {
    fechaInicio: Date.now(),
    fechaTermino: Date.now(),
    busqueda: '',
    orden: 'ASC',
    pagina: 1,
    filtros: [],
    categorias: [],
    cacheInvalido: true,
    columnaDestacada: undefined,
    columnaDestacadaFija: false,
    tablaDestacada: false,
    nombreEncuestaFiltrada: undefined,
    scrollTabla: 0,
    filaTablaDestacada: undefined,
    fechaActualizacion: Date.now(),
  },
  reducers: {
    fijaScrollTabla(state, action) {
      state.scrollTabla = action.payload
    },
    fijaFilaTablaDestacada(state, action) {
      state.filaTablaDestacada = action.payload
    },
    limpiaRespuestas(state) {
      state.respuestas = undefined
      state.respuestasVisibles = undefined
      state.respuestaSeleccionada = undefined
    },
    guardaRespuestas(state, action) {
      const { jsonRespuestas, idEncuesta } = action.payload
      const respuestas = jsonRespuestas.data.data
        .filter((r) => r.started === 'True')
        .map((r) => {
          const respuestaString = Object.keys(r).reduce((prev, k) => {
            let slug = ''
            if (typeof r[k] === 'string') {
              slug = normalizar(r[k])
            } else if (r[k]?.tag) {
              slug = normalizar(diccionarioTags(r[k].tag)?.id || r[k].tag)
            }
            return prev + slug
          }, '')
          r[CANAL_HEADER_NAME] = !r.is_unreachable.whatsapp
            ? { icon: 'whatsapp', label: 'Whatsapp' }
            : !r.is_unreachable.phone
            ? { icon: 'phone', label: 'Teléfono' }
            : { icon: 'cellphone-off', label: 'No pudo ser contactado' }
          const respuestaNormalizada = Object.keys(r).reduce((prev, k) => {
            if (typeof r[k] === 'string') {
              prev[k] = normalizar(r[k])
            } else if (r[k]?.tag || r[k]?.tag === '') {
              prev[k] = normalizar(diccionarioTags(r[k].tag)?.id || r[k].tag)
            } else if (r[k]?.icon) {
              prev[k] = normalizar(r[k].label)
            }
            return prev
          }, {})
          return {
            ...r,
            respuestaString,
            respuestaNormalizada,
          }
        })
        .reverse()
      try {
        let categorias = Object.keys(respuestas[0]).map((propiedad) =>
          respuestas[0][propiedad]?.tag !== undefined
            ? {
                propiedad,
                esTag: true,
                niveles: [
                  ...new Set(respuestas.map((r) => r[propiedad].tag)),
                ].sort((x, y) => (x > y ? 1 : -1)),
              }
            : respuestas[0][propiedad]?.icon
            ? {
                propiedad,
                esTag: false,
                niveles: [
                  ...new Set(respuestas.map((r) => r[propiedad].label)),
                ].sort((x, y) => (x > y ? 1 : -1)),
              }
            : {
                propiedad,
                esTag: false,
                niveles: [...new Set(respuestas.map((r) => r[propiedad]))].sort(
                  (x, y) => (x > y ? 1 : -1)
                ),
              }
        )
        const tagsCalculados = obtenerTagsCalculados(idEncuesta)
        if (tagsCalculados) {
          categorias = categorias.concat(
            tagsCalculados.map((tag) => ({
              propiedad: tag.nombre,
              esTag: true,
              niveles: [...new Set(respuestas.map((r) => tag.f(r).tag))].sort(
                (x, y) => (x > y ? 1 : -1)
              ),
            }))
          )
        }
        state.categorias = categorias
      } catch (e) {
        state.categorias = []
      }
      state.respuestas = respuestas
      state.respuestasVisibles = state.respuestas.filter((r) =>
        state.filtros.reduce((res, { f }) => res && f(r), true)
      )
      state.pagina = 1
      state.cacheInvalido = false
      state.fechaActualizacion = Date.now()
    },
    guardaFechaInicio(state, action) {
      state.fechaInicio = action.payload
      state.cacheInvalido = true
    },
    guardaFechaTermino(state, action) {
      state.fechaTermino = action.payload
      if (state.fechaInicio > action.payload) {
        state.fechaInicio = action.payload
      }
      state.cacheInvalido = true
    },
    guardaRangoFechas(state, action) {
      const [fechaInicio, fechaTermino] = action.payload
      state.fechaInicio = fechaInicio
      state.fechaTermino = fechaTermino
      state.cacheInvalido = true
    },
    buscaEsto(state, action) {
      const terminoNormalizado = normalizar(action.payload)
      state.busqueda = action.payload
      state.pagina = 1
      const indiceFiltroGlobal = state.filtros.findIndex(
        (f) => f.headers === '*'
      )
      const filtro = {
        headers: '*',
        busqueda: action.payload,
        descripcion: `Filtro global: "${action.payload}"`,
        f: (r) => r.respuestaString.indexOf(terminoNormalizado) >= 0,
      }
      if (indiceFiltroGlobal >= 0) {
        if (terminoNormalizado.length > 0) {
          state.filtros[indiceFiltroGlobal] = filtro
        } else {
          state.filtros.splice(indiceFiltroGlobal, 1)
        }
      } else if (terminoNormalizado.length > 0) {
        state.filtros.push(filtro)
      }
      state.respuestasVisibles = state.respuestas
        ? state.respuestas.filter((r) =>
            state.filtros.reduce((res, { f }) => res && f(r), true)
          )
        : []
    },
    agregaFiltro(state, action) {
      const { busqueda, nombreHeader, textoHeader, idEncuesta, opciones } =
        action.payload
      const { filtroImplicito, calceExacto, titulo, temporal, mismaColumna } =
        opciones || {}
      const terminoNormalizado = normalizar(busqueda)
      const filtro = {
        headers: [nombreHeader],
        nombresHeaders: [textoHeader],
        busqueda: [busqueda],
        terminosNormalizados: [terminoNormalizado],
        descripcion: `"${busqueda}" en ${textoHeader}`,
        oculto: filtroImplicito,
        temporal,
        f: (r) =>
          funcionFiltro(
            r,
            nombreHeader,
            terminoNormalizado,
            idEncuesta,
            calceExacto
          ),
      }
      const indiceFiltro = state.filtros.findIndex((f) =>
        f.headers.every((h) => h === nombreHeader)
      )
      if (indiceFiltro >= 0) {
        const filtroExistente = state.filtros[indiceFiltro]
        if (mismaColumna) {
          const indiceTerminoExistente = filtroExistente.busqueda.findIndex(
            (t) => t === busqueda
          )
          if (indiceTerminoExistente < 0) {
            const nombresHeaders = [
              ...filtroExistente.nombresHeaders,
              textoHeader,
            ]
            const terminosNormalizados = [
              ...filtroExistente.terminosNormalizados,
              terminoNormalizado,
            ]
            const headers = [...filtroExistente.headers, nombreHeader]
            state.filtros[indiceFiltro] = {
              headers: [...filtroExistente.headers, nombreHeader],
              busqueda: [...filtroExistente.busqueda, busqueda],
              terminosNormalizados,
              nombresHeaders,
              descripcion: nombresHeaders
                .map((h, i) => `"${busqueda[i]}" en ${h}`)
                .join(' o '),
              f: (r) =>
                headers.some((h, i) =>
                  funcionFiltro(r, h, terminosNormalizados[i], idEncuesta)
                ),
            }
          } else {
            if (
              filtroExistente.busqueda.length === 1 &&
              filtroExistente.busqueda[0] === busqueda
            ) {
              state.filtros.splice(indiceFiltro, 1)
            } else {
              state.filtros[indiceFiltro].nombresHeaders.splice(
                indiceTerminoExistente,
                1
              )
              state.filtros[indiceFiltro].terminosNormalizados.splice(
                indiceTerminoExistente,
                1
              )
              state.filtros[indiceFiltro].headers.splice(
                indiceTerminoExistente,
                1
              )
              state.filtros[indiceFiltro].busqueda.splice(
                indiceTerminoExistente,
                1
              )
              state.filtros[indiceFiltro].descripcion = state.filtros[
                indiceFiltro
              ].nombresHeaders
                .map((h, i) => `"${busqueda[i]}" en ${h}`)
                .join(' o ')
              state.filtros[indiceFiltro].f = (r) =>
                state.filtros[indiceFiltro].headers.some((h, i) =>
                  funcionFiltro(
                    r,
                    h,
                    state.filtros[indiceFiltro].terminosNormalizados[i],
                    idEncuesta
                  )
                )
            }
          }
        } else if (
          terminoNormalizado.length > 0 &&
          state.filtros[indiceFiltro].busqueda[0] !== busqueda
        ) {
          state.filtros[indiceFiltro] = filtro
        } else if (!filtroImplicito) {
          state.filtros.splice(indiceFiltro, 1)
        }
      } else if (busqueda !== '') {
        state.filtros.push(filtro)
      }
      if (filtroImplicito) {
        state.nombreEncuestaFiltrada = titulo
      }
      state.respuestasVisibles = state.respuestas.filter((r) =>
        state.filtros.reduce((res, { f }) => res && f(r), true)
      )
      state.pagina = 1
    },
    combinaFiltros(state, action) {
      const [i, j] = action.payload
      if (i === j) {
        return
      }
      const indiceFiltroGlobal = state.filtros.findIndex(
        (f) => f.headers === '*'
      )
      if (i === indiceFiltroGlobal || j === indiceFiltroGlobal) {
        return
      }
      const fi = state.filtros[i].f
      const fj = state.filtros[j].f
      const headers = [...state.filtros[j].headers, ...state.filtros[i].headers]
      const nombresHeaders = [
        ...state.filtros[j].nombresHeaders,
        ...state.filtros[i].nombresHeaders,
      ]
      const busqueda = [
        ...state.filtros[j].busqueda,
        ...state.filtros[i].busqueda,
      ]
      state.filtros[j] = {
        headers,
        busqueda,
        nombresHeaders,
        descripcion: nombresHeaders
          .map((h, i) => `"${busqueda[i]}" en ${h}`)
          .join(' o '),
        f: (r) => fi(r) || fj(r),
      }
      state.filtros.splice(i, 1)
      state.respuestasVisibles = state.respuestas.filter((r) =>
        state.filtros.reduce((res, { f }) => res && f(r), true)
      )
    },
    remueveFiltro(state, action) {
      const indiceFiltro = action.payload
      const indiceFiltroGlobal = state.filtros.findIndex(
        (f) => f.headers === '*'
      )
      if (indiceFiltro === indiceFiltroGlobal) {
        state.busqueda = ''
      }
      state.filtros.splice(indiceFiltro, 1)
      state.respuestasVisibles = state.respuestas.filter((r) =>
        state.filtros.reduce((res, { f }) => res && f(r), true)
      )
    },
    remueveFiltroPorNombre(state, action) {
      const nombreFiltro = action.payload
      state.filtros = state.filtros.filter(
        (f) => f.headers.indexOf(nombreFiltro) < 0
      )
      state.respuestasVisibles = state.respuestas.filter((r) =>
        state.filtros.reduce((res, { f }) => res && f(r), true)
      )
    },
    remueveFiltrosTemporales(state) {
      state.filtros = state.filtros.filter((f) => !f.temporal)
      if (state.respuestas) {
        state.respuestasVisibles = state.respuestas.filter((r) =>
          state.filtros.reduce((res, { f }) => res && f(r), true)
        )
      }
    },
    limpiaFiltros(state) {
      state.filtros = state.filtros.filter((f) => f.oculto)
      state.respuestasVisibles = state.respuestas
      state.nombreEncuestaFiltrada = undefined
      state.busqueda = ''
    },
    guardaEstaRespuesta(state, action) {
      if (Array.isArray(action.payload)) {
        const [respuesta, indice] = action.payload
        state.respuestaSeleccionada = respuesta
        state.filaTablaDestacada += indice - state.filaTablaDestacada
        state.indiceRespuestaSeleccionada = indice
      } else {
        state.respuestaSeleccionada = action.payload
        state.indiceRespuestaSeleccionada = undefined
      }
    },
    ordenaRespuestas(state, action) {
      const { header, idEncuesta } = action.payload
      state.ordenHeader = header
      const tagCalculado = obtenerTagsCalculados(idEncuesta)?.find(
        (t) => t.nombre === header
      )
      if (tagCalculado) {
        if (state.orden === 'ASC') {
          state.orden = 'DESC'
          state.respuestas.sort((r1, r2) =>
            normalizar(tagCalculado.f(r1)) < normalizar(tagCalculado.f(r2))
              ? -1
              : 1
          )
          state.respuestasVisibles.sort((r1, r2) =>
            normalizar(tagCalculado.f(r1)) < normalizar(tagCalculado.f(r2))
              ? -1
              : 1
          )
        } else {
          state.orden = 'ASC'
          state.respuestas.sort((r1, r2) =>
            normalizar(tagCalculado.f(r1)) > normalizar(tagCalculado.f(r2))
              ? -1
              : 1
          )
          state.respuestasVisibles.sort((r1, r2) =>
            normalizar(tagCalculado.f(r1)) > normalizar(tagCalculado.f(r2))
              ? -1
              : 1
          )
        }
      } else {
        if (state.orden === 'ASC') {
          state.orden = 'DESC'
          state.respuestas.sort(funcionDeOrdenamiento(header, 'DESC'))
          state.respuestasVisibles.sort(funcionDeOrdenamiento(header, 'DESC'))
        } else {
          state.orden = 'ASC'
          state.respuestas.sort(funcionDeOrdenamiento(header, 'ASC'))
          state.respuestasVisibles.sort(funcionDeOrdenamiento(header, 'ASC'))
        }
      }
    },
    avanzaPagina(state) {
      state.pagina++
      state.filaTablaDestacada = undefined
    },
    retrocedePagina(state) {
      state.pagina--
      state.filaTablaDestacada = undefined
    },
    actualizaRespuestas(state) {
      state.cacheInvalido = true
    },
    destacaColumna(state, action) {
      if (!state.columnaDestacadaFija) {
        state.columnaDestacada = action.payload
      }
    },
    yaNoDestaquesColumna(state) {
      if (!state.columnaDestacadaFija) {
        state.columnaDestacada = undefined
      }
    },
    fijaColumna(state, action) {
      state.columnaDestacadaFija = action.payload
      if (!action.payload) {
        state.columnaDestacada = undefined
      }
    },
    fijaTablaDestacada(state, action) {
      state.tablaDestacada = action.payload
    },
    agregaReaccionARespuesta(state, action) {
      if (!state.respuestasVisibles) {
        return
      }
      const { idUsuario, emoji, comentario } = action.payload
      const nuevaReaccion = {
        created_at: formatISO9075(Date.now()),
        reaction_emoji: emoji,
        reaction_text: comentario,
      }
      for (let i = 0; i < state.respuestasVisibles.length; i++) {
        if (state.respuestasVisibles[i].user_id === Number(idUsuario)) {
          state.respuestasVisibles[i].reactions.push(nuevaReaccion)
          break
        }
      }
      for (let i = 0; i < state.respuestas.length; i++) {
        if (state.respuestas[i].user_id === Number(idUsuario)) {
          state.respuestas[i].reactions.push(nuevaReaccion)
          break
        }
      }
    },
    eliminaReaccionDeRespuesta(state, action) {
      const { idUsuario, fecha } = action.payload
      for (let i = 0; i < state.respuestasVisibles.length; i++) {
        if (state.respuestasVisibles[i].user_id === Number(idUsuario)) {
          for (
            let j = 0;
            j < state.respuestasVisibles[i].reactions.length;
            j++
          ) {
            if (state.respuestasVisibles[i].reactions[j].created_at === fecha) {
              state.respuestasVisibles[i].reactions.splice(j, j)
              break
            }
          }
          break
        }
      }
      for (let i = 0; i < state.respuestas.length; i++) {
        if (state.respuestas[i].user_id === Number(idUsuario)) {
          for (let j = 0; j < state.respuestas[i].reactions.length; j++) {
            if (state.respuestas[i].reactions[j].created_at === fecha) {
              state.respuestas[i].reactions.splice(j, j)
              break
            }
          }
          break
        }
      }
    },
  },
})

export const {
  limpiaRespuestas,
  guardaRespuestas,
  guardaFechaInicio,
  guardaFechaTermino,
  guardaRangoFechas,
  buscaEsto,
  guardaEstaRespuesta,
  ordenaRespuestas,
  avanzaPagina,
  retrocedePagina,
  actualizaRespuestas,
  agregaFiltro,
  remueveFiltro,
  remueveFiltroPorNombre,
  combinaFiltros,
  destacaColumna,
  yaNoDestaquesColumna,
  fijaTablaDestacada,
  fijaColumna,
  limpiaFiltros,
  agregaReaccionARespuesta,
  eliminaReaccionDeRespuesta,
  fijaScrollTabla,
  fijaFilaTablaDestacada,
  remueveFiltrosTemporales,
} = sliceRespuestas.actions

export default sliceRespuestas.reducer
