import React from 'react'
import { useSelector } from 'react-redux'
import { scrambleNombre, scrambleRut, scrambleSucursal, scrambleUsuario, scrambleTelefono } from './scramblers'

const Scrambler = ({ tipo, children: texto }) => {

  const { scrambled } = useSelector(state => state.opciones)

  const scramble = texto => {
    switch (tipo) {
      case 'usuario':
        return scrambleUsuario(texto)
      case 'rut':
        return scrambleRut(texto)
      case 'nombre':
      case 'name':
        return scrambleNombre(texto)
      case 'telefono':
      case 'phone':
        return scrambleTelefono(texto)
      case 'sucursal':
      case 'sucursal_name':
        return scrambleSucursal(texto)
      case '*':
        return Array(texto.length).fill('*').join('')
      default:
        return texto
    }
  }

  return (
    <>
      {scrambled ? scramble(texto) : texto}
    </>
  )
}

export default Scrambler
