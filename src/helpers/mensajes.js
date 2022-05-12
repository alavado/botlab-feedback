import React from "react"
import Scrambler from "../components/Scrambler/Scrambler"

export const marcarNegritas = texto => {
  return texto.map(t => {
    const partes = t.props.children[0].split('*')
    return {
      ...t,
      props: {
        ...t.props,
        children: [
          React.createElement(
            'span',
            [],
            partes.map((p, i) => i % 2 === 1
              ? <strong
                  className="MensajeWhatsapp__strong"
                  key={Date.now()}
                >
                  <Scrambler tipo="multi">{p}</Scrambler>
                </strong>
              : p
            )
          ),
          ...t.props.children.slice(1)
        ]
      }
    }
  })
}