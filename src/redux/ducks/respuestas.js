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
      state.filtros.length = 0
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
      const terminoNormalizado = normalizar(action.payload)
      state.busqueda = action.payload
      state.pagina = 1
      const indiceFiltroGlobal = state.filtros.findIndex(f => f.headers === '*')
      const filtro = {
        headers: '*',
        busqueda: action.payload,
        descripcion: `Filtro global: "${action.payload}"`,
        f: r => r.respuestaString.indexOf(terminoNormalizado) >= 0
      }
      if (indiceFiltroGlobal >= 0) {
        if (terminoNormalizado.length > 0) {
          state.filtros[indiceFiltroGlobal] = filtro
        }
        else {
          state.filtros.splice(indiceFiltroGlobal, 1)
        }
      }
      else if (terminoNormalizado.length > 0) {
        state.filtros.push(filtro)
      }
      state.respuestasVisibles = state.respuestas
        ? state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
        : []
    },
    agregaFiltro(state, action) {
      const [indiceHeader, busqueda, nombreHeader] = action.payload
      const terminoNormalizado = normalizar(busqueda)
      const indiceFiltro = state.filtros.findIndex(f => f.headers.length === 1 && f.headers[0] === indiceHeader)
      const filtro = {
        headers: [indiceHeader],
        nombresHeaders: [nombreHeader],
        busqueda: [busqueda],
        descripcion: `"${busqueda}" en ${nombreHeader}`,
        f: r => r.respuestaNormalizada[indiceHeader].indexOf(terminoNormalizado) >= 0
      }
      if (indiceFiltro >= 0) {
        if (terminoNormalizado.length > 0) {
          state.filtros[indiceFiltro] = filtro
        }
        else {
          state.filtros.splice(indiceFiltro, 1)
        }
      }
      else {
        state.filtros.push(filtro)
      }
      state.respuestasVisibles = state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
      state.pagina = 1
    },
    combinaFiltros(state, action) {
      const [i, j] = action.payload
      if (i === j) {
        return
      }
      const indiceFiltroGlobal = state.filtros.findIndex(f => f.headers === '*')
      if (i === indiceFiltroGlobal || j === indiceFiltroGlobal) {
        return
      }
      const fi = state.filtros[i].f
      const fj = state.filtros[j].f
      const headers = [...state.filtros[j].headers, ...state.filtros[i].headers]
      const nombresHeaders = [...state.filtros[j].nombresHeaders, ...state.filtros[i].nombresHeaders]
      const busqueda = [...state.filtros[j].busqueda, ...state.filtros[i].busqueda]
      state.filtros[j] = {
        headers,
        busqueda,
        nombresHeaders,
        descripcion: nombresHeaders.map((h, i) => `"${busqueda[i]}" en ${h}`).join(' o '),
        f: r => fi(r) || fj(r)
      }
      state.filtros.splice(i, 1)
      state.respuestasVisibles = state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
    },
    remueveFiltro(state, action) {
      const indiceFiltro = action.payload
      const indiceFiltroGlobal = state.filtros.findIndex(f => f.headers === '*')
      if (indiceFiltro === indiceFiltroGlobal) {
        state.busqueda = ''
      }
      state.filtros.splice(indiceFiltro, 1)
      state.respuestasVisibles = state.respuestas.filter(r => state.filtros.reduce((res, { f }) => res && f(r), true))
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
  agregaFiltro,
  remueveFiltro,
  combinaFiltros
} = sliceRespuestas.actions

export default sliceRespuestas.reducer
