import { juntarConfirmaYReagenda } from "./tagsCalculados";

test('juntarConfirmaYReagenda funciona bien', () => {
  const indiceConfirma = 0
  const indiceReagenda = 1
  const tagResultante = juntarConfirmaYReagenda(indiceConfirma, indiceReagenda)[0]
  const resultado = {
    nombre: 'tc1',
    texto: 'Respuesta',
    tipo: 'YESNO',
    f: r => {
      const confirma = r[indiceConfirma]
      const reagenda = r[indiceReagenda]
      if (reagenda?.tag === REAGENDA || reagenda?.tag === YES) {
        return {
          tag: REAGENDA,
          text: `${confirma.text} / ${reagenda.text}`
        }
      }
      return reagenda?.tag ? reagenda : confirma
    }
  }
  expect(tagResultante.nombre).toEqual(resultado.nombre)
  expect(tagResultante.texto).toEqual(resultado.texto)
  expect(tagResultante.tipo).toEqual(resultado.tipo)
})