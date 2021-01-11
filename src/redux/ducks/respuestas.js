import { createSlice } from "@reduxjs/toolkit"
import { diccionarioTags } from "../../helpers/tags"

const normalizar = s => (s.tag ?? s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const sliceRespuestas = createSlice({
  name: 'respuestas',
  initialState: {
    fechaInicio: process.env.NODE_ENV !== 'development' ? Date.now() : new Date(2020, 7, 1),
    fechaTermino: process.env.NODE_ENV !== 'development' ? Date.now() : new Date(2020, 7, 7),
    busqueda: '',
    orden: 'ASC',
    pagina: 1,
    filtros: [],
    cacheInvalido: true
  },
  reducers: {
    limpiaRespuestas(state) {
      state.respuestas = undefined
      state.respuestasVisibles = undefined
      state.respuestaSeleccionada = undefined
      state.busqueda = ''
      state.filtros = []
    },
    guardaRespuestas(state, action) {
      const jsonRespuestas = action.payload
      const respuestas = jsonRespuestas.data.data.map(r => {
        const respuestaString = Object.keys(r)
          .reduce((prev, k) => {
            let slug = ''
            if (typeof r[k] === 'string') {
              slug = normalizar(r[k])
            }
            else if (r[k].tag) {
              slug = normalizar(diccionarioTags[r[k].tag].texto)
            }
            return prev + slug
          }, '')
        const respuestaNormalizada = Object.keys(r)
          .reduce((prev, k) => {
            if (typeof r[k] === 'string') {
              prev.push(normalizar(r[k]))
            }
            else if (r[k].tag) {
              prev.push(normalizar(diccionarioTags[r[k].tag].texto))
            }
            return prev
          }, [])
        return {
          ...r,
          respuestaString,
          respuestaNormalizada
        }
      }).reverse()
      state.respuestas = respuestas
      state.respuestasVisibles = respuestas
      state.pagina = 1
      state.cacheInvalido = false
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
      const termino = normalizar(action.payload)
      state.busqueda = action.payload
      state.pagina = 1
      const indiceFiltroGlobal = state.filtros.findIndex(f => f.headers === '*')
      if (indiceFiltroGlobal >= 0) {
        state.filtros[indiceFiltroGlobal] = { headers: '*', f: r => r.respuestaString.indexOf(termino) >= 0 }
      }
      else {
        state.filtros.push({ headers: '*', termino, f: r => r.respuestaString.indexOf(termino) >= 0 })
      }
      state.respuestasVisibles = state.respuestas
        ? state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
        : []
    },
    agregaFiltro(state, action) {
      const [indiceHeader, busqueda] = action.payload
      const terminoNormalizado = normalizar(busqueda)
      const indiceFiltro = state.filtros.findIndex(f => f.headers?.indexOf(indiceHeader) >= 0)
      const filtro = {
        headers: [indiceHeader],
        busqueda,
        f: r => r.respuestaNormalizada[indiceHeader].indexOf(terminoNormalizado) >= 0
      }
      if (indiceFiltro >= 0) {
        state.filtros[indiceFiltro] = filtro
      }
      else {
        state.filtros.push(filtro)
      }
      state.respuestasVisibles = state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
      state.pagina = 1
    },
    guardaEstaRespuesta(state, action) {
      if (Array.isArray(action.payload)) {
        const [respuesta, indice] = action.payload
        state.respuestaSeleccionada = respuesta
        state.indiceRespuestaSeleccionada = indice
      }
      else {
        state.respuestaSeleccionada = action.payload
        state.indiceRespuestaSeleccionada = undefined
      }
    },
    ordenaRespuestas(state, action) {
      const header = action.payload
      if (state.orden === 'ASC') {
        state.orden = 'DESC'
        state.ordenHeader = action.payload
        state.respuestas = state.respuestas.slice().sort((r1, r2) => normalizar(r1[header]) < normalizar(r2[header]) ? -1 : 1)
        state.respuestasVisibles = state.respuestasVisibles.slice().sort((r1, r2) => normalizar(r1[header]) < normalizar(r2[header]) ? -1 : 1)
      }
      else {
        state.orden = 'ASC'
        state.ordenHeader = action.payload
        state.respuestas = state.respuestas.slice().sort((r1, r2) => normalizar(r1[header]) > normalizar(r2[header]) ? -1 : 1)
        state.respuestasVisibles = state.respuestasVisibles.slice().sort((r1, r2) => normalizar(r1[header]) > normalizar(r2[header]) ? -1 : 1)
      }
    },
    avanzaPagina(state) {
      state.pagina++
    },
    retrocedePagina(state) {
      state.pagina--
    },
    actualizaRespuestas(state) {
      state.cacheInvalido = true
    }
  }
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
  agregaFiltro
} = sliceRespuestas.actions

export default sliceRespuestas.reducer
