import { useSelector } from 'react-redux'

function useWhatsappLink(phone) {
  const { abrirAppWhatsapp } = useSelector((state) => state.respuestas)

  if (!phone) {
    return ''
  }

  return abrirAppWhatsapp
    ? `https://wa.me/${phone}`
    : `https://web.whatsapp.com/send/?phone=${phone}`
}

export default useWhatsappLink
