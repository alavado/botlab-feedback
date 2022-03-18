import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useScrambler from '../../hooks/useScrambler'
import { scramble } from './scramblers'
import './Scrambler.css'

const esURL = posibleURL => {
  try {
    return new URL(posibleURL) && posibleURL.startsWith('http')
  } catch (_) {
    return false
  }
}

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
        agregarAScrambler([texto.split(/(?=[A-Z])/).join(' '), tipo])
        texto.split(' ').forEach(t => agregarAScrambler([t, tipo]))
        agregarAScrambler([texto, tipo])
      }
      else {
        agregarAScrambler([texto, tipo])
      }
    }
  }, [agregarAScrambler, tipo, texto, propagar])

  const componente = esURL(texto)
    ? <a
        className="Scrambler__link"
        target='_blank'
        href={scrambled ? 'https://google.com' : texto}
        rel="noreferrer noopener"
        onClick={e => e.stopPropagation()}
      >
        {new URL(texto).hostname}
      </a>
    : (scrambled ? scramble(texto, tipo, terminos) : (texto ?? ''))

  return componente
}

export default Scrambler
