import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import iconoBuscar from '@iconify/icons-mdi/search'
import './CuadroBusqueda.css'
import Icon from '@iconify/react'
import { useDispatch } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'

const retrieveImageFromClipboardAsBlob = (pasteEvent, callback) => {
	if (pasteEvent.clipboardData === false) {
    if (typeof(callback) === "function") {
        callback(undefined)
    }
  }
  const items = pasteEvent.clipboardData.items
  if (items === undefined){
    if (typeof(callback) == "function") {
        callback(undefined)
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") === -1) {
      continue
    }
    const blob = items[i].getAsFile()
    callback(blob)
  }
}

const CuadroBusqueda = () => {

  const inputRef = useRef()
  const [termino, setTermino] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    inputRef.current.focus()
    dispatch(limpiaBusqueda())
  }, [dispatch])

  useEffect(() => {
    inputRef.current.addEventListener('paste',  e => {
      retrieveImageFromClipboardAsBlob(e, imageBlob => {
        if (imageBlob) {
          var canvas = document.getElementById("mycanvas")
          var ctx = canvas.getContext('2d')
          var img = new Image()
          img.onload = function() {
            canvas.width = this.width
            canvas.height = this.height
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const grises = Array(data.length / 4).fill(0)
            for (let i = 0; i < data.length; i += 4) {
              const promedio = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3)
              grises[i / 4] = promedio > 200 ? 255 : 0
            }
            const dx = Array(data.length / 4).fill(0)
            for (let i = 0; i < dx.length; i++) {
              dx[i] = grises[i + 1] - grises[i]
            }
            const bordes = Array(data.length / 4).fill(0)
            bordes[0] = false
            for (let i = 1; i < bordes.length; i++) {
              bordes[i] = !bordes[i - 1] && (Math.sign(dx[i + 1]) !== Math.sign(dx[i]))
              data[4 * i] = data[4 * i + 1] = data[4 * i + 2] = bordes[i] * 255
              data[4 * i + 3] = 255
            }
            const proporciones = bordes.map(v => v ? '1' : '0').join('').split('1').map(v => v.length)
            const largoPatron = 5
            const delimitadores = proporciones
              .map((v, i) => {
                return i < (proporciones.length - largoPatron) && (
                  v / proporciones[i + 1] === 1 &&
                  Math.floor(proporciones[i + 2] / v) === 3 &&
                  v / proporciones[i + 3] === 1 &&
                  v / proporciones[i + 4] === 1
                ) ? i : false
              })
              .filter(v => v)
            if (delimitadores) {
              const sliceDatos = proporciones.slice(delimitadores[0] + largoPatron, delimitadores[1])
              const tamañoBit = proporciones[delimitadores[0]] * 1.33
              const binario = sliceDatos
                .map((v, i) => Array(Math.floor(v / tamañoBit)).fill(Number(i % 2 > 0)))
                .flat()
                .join('')
              console.log(parseInt(binario, 2))
            }
            ctx.putImageData(imageData, 0, 0)
          }
          img.src = window.URL.createObjectURL(imageBlob)
        }
      })
    }, false)
  }, [])

  const buscar = e => {
    e.preventDefault()
    history.push(`/busqueda/${termino}`)
  }

  return (
    <div className="CuadroBusqueda">
      <canvas style={{ border: '1px solid grey' }} id="mycanvas" />
      <form
        className="CuadroBusqueda__formulario"
        onSubmit={buscar}
      >
        <input
          className="CuadroBusqueda__input"
          type="text"
          spellCheck="false"
          ref={inputRef}
          value={termino}
          onChange={e => setTermino(e.target.value)}
          placeholder="RUT, nombre, teléfono..."
        />
        <Icon
          icon={iconoBuscar}
          className="CuadroBusqueda__icono_buscar"
        />
        <button
          type="submit"
          className="CuadroBusqueda__boton_buscar"
        >
          Buscar
        </button>
      </form>
      <p className="CuadroBusqueda__explicacion">
        La búsqueda entrega hasta 100 resultados más relevantes de cualquier encuesta asociada al término ingresado.
        Los resultados pueden tener un desfase de hasta 15 minutos.
      </p>
    </div>
  )
}

export default CuadroBusqueda
