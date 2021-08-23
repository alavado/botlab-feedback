import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { agregaTerminos, remueveTerminos } from '../redux/ducks/scrambler'

function useScrambler(terminosIniciales) {

  const [terminos, setTerminos] = useState(terminosIniciales || [])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(agregaTerminos(terminos))
    return () => {
      dispatch(remueveTerminos(terminos))
    }
  }, [terminos, dispatch, terminosIniciales])

  const agregarTermino = termino => {
    if (!terminos.some(t => t[0] === termino[0])) {
      setTerminos([...terminos, termino])
    }
  }

  return agregarTermino
}

export default useScrambler