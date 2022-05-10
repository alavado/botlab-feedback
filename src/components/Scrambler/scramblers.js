import { nombresHombres, nombresMujeres } from './nombres'
import apellidos from './apellidos'
import _ from 'lodash'

const hashearString = s => s.length > 0 ? s.split('').reduce((sum, v) => sum + v.charCodeAt(0), 0) : 0

const comunasMenosPobladasDeChile = [
  'Antártica',
  'Laguna Blanca',
  'Ollagüe',
  'Timaukel',
  'Tortel',
  'Río Verde',
  'O\'Higgins',
  'General Lagos',
  'San Gregorio',
  'Lago Verde',
  'Juan Fernández',
  'Primavera',
  'Torres del Paine',
  'Camiña',
  'Camarones',
  'Palena',
  'Colchane',
  'Guaitecas',
  'Cabo de Hornos',
  'Futaleufú'
]

export const scrambleRut = rut => {
  if (!rut) {
    return rut
  }
  let millones = hashearString(rut).toString()
  while (millones.length < 7) {
    millones += hashearString(millones).toString()[0]
  }
  const dv = hashearString(rut) % 10
  return `${(+millones).toLocaleString('de-DE')}-${dv}`
}

const sucursalesFalsas = comunasMenosPobladasDeChile.map(c => `Clínica ${c}`)

export const scrambleSucursal = sucursal => {
  return sucursalesFalsas[hashearString(sucursal) % sucursalesFalsas.length]
}

const usuariosFalsos = comunasMenosPobladasDeChile.map(c => `Salud ${c}`)

export const scrambleUsuario = usuario => {
  if (!usuario) {
    return ''
  }
  const soloPrimeraParte = usuario.split(/(?=[A-Z ])/)[0]
  return usuariosFalsos[hashearString(soloPrimeraParte) % usuariosFalsos.length]
}

const obtenerNombre = nombre => {
  const i = hashearString(nombre)
  if (nombresHombres.indexOf(nombre) >= 0) {
    return nombresHombres[i % nombresHombres.length]
  }
  else if (nombresMujeres.indexOf(nombre) >= 0) {
    return nombresMujeres[i % nombresMujeres.length]
  }
  else {
    const nombresUnisex = ['Ariel', 'Alex', 'Cameron', 'Cris', 'Denis', 'Robin', 'Santana', 'Zoel']
    return nombresUnisex[i % nombresUnisex.length]
  }
}

export const scrambleNombre = nombre => {
  const partes = nombre.split(' ').slice(0, 3)
  return partes.slice(0, 3).map((p, i) => i < 1
    ? obtenerNombre(p)
    : apellidos[hashearString(p) % apellidos.length]
  ).join(' ')
}

export const scrambleTelefono = () => {
  return '+56 9 25555 1234'
}

export const scrambleDireccion = texto => {
  return texto.replace(/[A-Z]\S{3,} [0-9]+/g, 'Chinchillas 2021')
}

export const scrambleMulti = (textoOriginal, terminos) => {
  console.log(textoOriginal)
  const textoCompleto = _.isArray(textoOriginal)
    ? textoOriginal.reduce((acc, p) => acc + _.isString(p) ? p : p.props.children, '')
    : textoOriginal
  return scrambleDireccion(terminos.reduce((texto, termino) => {
    return texto.replace(new RegExp(termino[0], 'gi'), scramble(termino[0], termino[1]))
  }, textoCompleto))
}

export const scramble = (texto, tipo, terminos) => {
  switch (tipo) {
    case 'usuario':
      return scrambleUsuario(texto)
    case 'rut':
      return scrambleRut(texto)
    case 'address':
    case 'direccion':
      return scrambleDireccion(texto)
    case 'nombre':
    case 'name':
    case 'dentist_name':
    case 'specialist_name_1':
    case 'specialist_name_2':
    case 'specialist_name_3':
    case 'specialist_name_4':
      return scrambleNombre(texto)
    case 'telefono':
    case 'phone':
      return scrambleTelefono(texto)
    case 'sucursal':
    case 'sucursal_name':
      return scrambleSucursal(texto)
    case '*':
      return Array(texto.length).fill('*').join('')
    case 'multi':
      return scrambleMulti(texto, terminos)
    // case 'dentalink_link':
    // case 'medilink_link':
    //   return 'link.software.com'
    default:
      return texto
  }
}