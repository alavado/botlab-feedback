import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useScrambler from '../../hooks/useScrambler'
import { scramble } from './scramblers'

const Scrambler = ({ tipo, children: texto, propagar }) => {

  const { scrambled, terminos } = useSelector(state => state.scrambler)
  const agregarAScrambler = useScrambler()

  useEffect(() => {
    if (propagar) {
      if ([
        'nombre',
        'name',
        'dentist_name',
        'specialist_name_1',
        'specialist_name_2',
        'specialist_name_3',
        'specialist_name_4',
      ].includes(tipo)) {
        agregarAScrambler([texto, tipo])
        agregarAScrambler([texto.split(' ')[0], tipo])
      }
      else if (tipo === 'usuario') {
        agregarAScrambler([texto.split(' ')[0], tipo])
      }
      else {
        agregarAScrambler([texto, tipo])
      }
    }
  }, [agregarAScrambler, tipo, texto, propagar])

  return (
    <>
      {scrambled ? scramble(texto, tipo, terminos) : texto}
    </>
  )
}

export default Scrambler
