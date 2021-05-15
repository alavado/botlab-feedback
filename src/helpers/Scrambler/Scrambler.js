import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useScrambler from '../../hooks/useScrambler'
import { scrambleNombre, scrambleRut, scrambleSucursal, scrambleUsuario, scrambleTelefono, scrambleMulti } from './scramblers'

const Scrambler = ({ tipo, children: texto, propagar }) => {

  const { scrambled } = useSelector(state => state.scrambler)
  const agregarAScrambler = useScrambler()

  useEffect(() => {
    if (propagar) {
      agregarAScrambler([texto, tipo])
    }
  }, [agregarAScrambler, tipo, texto, propagar])

  const scramble = texto => {
    let textoRevuelto
    switch (tipo) {
      case 'usuario':
        textoRevuelto = scrambleUsuario(texto)
        break
      case 'rut':
        textoRevuelto = scrambleRut(texto)
        break
      case 'nombre':
      case 'name':
      case 'dentist_name':
      case 'specialist_name_1':
      case 'specialist_name_2':
      case 'specialist_name_3':
      case 'specialist_name_4':
        textoRevuelto = scrambleNombre(texto)
        break
      case 'telefono':
      case 'phone':
        textoRevuelto = scrambleTelefono(texto)
        break
      case 'sucursal':
      case 'sucursal_name':
        textoRevuelto = scrambleSucursal(texto)
        break
      case 'multi':
        textoRevuelto = scrambleMulti(texto)
        break
      case '*':
        textoRevuelto = Array(texto.length).fill('*').join('')
        break
      default:
        textoRevuelto = texto
    }
    return textoRevuelto
  }

  return (
    <>
      {scrambled ? scramble(texto) : texto}
    </>
  )
}

export default Scrambler
