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
            const segmentacion = Array(data.length).fill(0)
            const promedios = Array(data.length / 4).fill(0)
            const segmentacionProm = Array(data.length / 4).fill(0)
            for (let i = 0; i < data.length; i += 4) {
              promedios[Math.floor(i / 4)] = (data[i] + data[i + 1] + data[i + 2]) / 3
              segmentacionProm[Math.floor(i / 4)] = promedios[Math.floor(i / 4)] === 0
              segmentacion[i] = segmentacion[i + 1] = segmentacion[i + 2] = promedios[Math.floor(i / 4)] === 0
              segmentacion[i + 3] = 255
            }
            for (let i = 0; i < data.length; i++) {
              data[i] = segmentacionProm[Math.floor(i / 4)] * 100
            }
            const bits = []
            out: for (let i = 0; i < this.width; i++) {
              for (let j = 0; j < this.height; j++) {
                if (segmentacionProm[i + j * this.width]) {
                  data[(i + j * this.width) * 4] = 255
                  for (let k = this.height - 1; k > j && k > 0; k--) {
                    if (segmentacionProm[i + k * this.width]) {
                      const d = Math.ceil((k - j) / 32)
                      data[(i + k * this.width) * 4] = 255
                      if (d > 1) {
                        for (let l = 0; l < 32; l++) {
                          data[(i + (j + d * l) * this.width) * 4] = 255
                          bits.push(segmentacionProm[i + (j + d * l) * this.width] ? '0' : '1')
                        }
                        break out
                      }
                    }
                  }
                }
              }
            }
            const numeroChat = parseInt(bits.slice(0, -1).join(''), 2).toString()
            ctx.putImageData(imageData, 0, 0)
            history.push(`/chat/${numeroChat.slice(0, 3)}/${numeroChat.slice(3)}`)
          }
          img.src = window.URL.createObjectURL(imageBlob)
        }
      })
    }, false)
  }, [history])

  const buscar = e => {
    e.preventDefault()
    history.push(`/busqueda/${termino}`)
  }

  return (
    <div className="CuadroBusqueda">
      <canvas style={{ border: '1px solid grey', display: 'none' }} id="mycanvas" />
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
