import parser from 'fast-xml-parser'

export const parsearXMLDeGuion = texto => {
  if (!parser.validate(texto)) {
    throw new SyntaxError('XML inválido, por favor revísalo')
  }
  const json = parser.parse(
    texto,
    {
      attrNodeName: 'attr',
      attributeNamePrefix : "@_",
      ignoreAttributes: false
    }
  )
  if (!json) {
    throw new TypeError('XML inválido: resultado vacío')
  }
  if (!json?.poll?.question?.find(q => q.attr['@_id'] === '0')) {
    throw new TypeError('XML inválido: no encontré pregunta inicial (id=0)')
  }
  return json
}