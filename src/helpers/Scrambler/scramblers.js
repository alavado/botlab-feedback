import { nombresHombres, nombresMujeres } from './nombres'
import apellidos from './apellidos'

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
  let millones = hashearString(rut).toString()
  while (millones.length < 7) {
    millones += hashearString(millones).toString()[0]
  }
  const dv = hashearString(rut) % 10
  return `${(+millones).toLocaleString('de-DE')}-${dv}`
}

export const scrambleSucursal = sucursal => {
  const sucursales = comunasMenosPobladasDeChile.map(c => `Clínica ${c}`)
  return sucursales[hashearString(sucursal) % sucursales.length]
}

export const scrambleUsuario = usuario => {
  const usuarios = comunasMenosPobladasDeChile.map(c => `Salud ${c}`)
  return usuarios[hashearString(usuario.split(' ')[0]) % usuarios.length]
}

const obtenerNombre = nombre => {
 return nombresHombres[hashearString(nombre) % nombresHombres.length]
}

export const scrambleNombre = nombre => {
  return 'x'
  // const partes = nombre.split(' ')
  // return partes.slice(0, 3).map((p, i) => i < 2
  //   ? obtenerNombre(p)
  //   : apellidos[hashearString(p) % apellidos.length]
  // ).join(' ')
}

export const scrambleTelefono = telefono => {
  return telefono.split('').map(n => hashearString(n) % 10).join('')
}

export const scrambleDireccion = texto => {
  return texto.replace(/[A-Z]\S{3,} [0-9]+/g, 'Chinchillas 2021')
}

export const scrambleMulti = (texto, terminos) => {
  return scrambleDireccion(terminos.reduce((t, termino) => {
    return t.replace(new RegExp(termino[0], 'gi'), scramble(termino[0], termino[1]))
  }, texto))
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
    default:
      return texto
  }
}