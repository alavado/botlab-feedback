import nombres from './nombres'
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
  const millones = parseInt(1E7 + Math.random() * 9E6)
  const dv = parseInt(10 * Math.random())
  return `${millones.toLocaleString('de-DE')}-${dv}`
}

export const scrambleSucursal = sucursal => {
  const sucursales = comunasMenosPobladasDeChile.map(c => `Clínica ${c}`)
  return sucursales[hashearString(sucursal) % sucursales.length]
}

export const scrambleUsuario = usuario => {
  const usuarios = comunasMenosPobladasDeChile.map(c => `BuenaSalud ${c}`)
  return usuarios[hashearString(usuario) % usuarios.length]
}

export const scrambleNombre = nombre => {
  const partes = nombre.split(' ')
  return partes.slice(0, 3).map((p, i) => i < 1
    ? nombres[hashearString(p) % nombres.length]
    : apellidos[hashearString(p) % apellidos.length]
  ).join(' ')
}

export const scrambleTelefono = telefono => {
  return telefono.split('').map(n => hashearString(n) % 10).join('')
}

export const scrambleMulti = texto => {
  return texto.split(' ').map(p => p.charCodeAt(0) >= 65 && p.charCodeAt(0) <= 90 ? scrambleNombre(p) : p).join(' ')
}