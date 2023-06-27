export const getHueForLabel = (label: string): Number => {
  const min = 'a'.charCodeAt(0),
    max = 'z'.charCodeAt(0)
  const position = Math.floor(label.length / 2)
  return (360 * (label.toLowerCase().charCodeAt(position) - min)) / (max / min)
}
