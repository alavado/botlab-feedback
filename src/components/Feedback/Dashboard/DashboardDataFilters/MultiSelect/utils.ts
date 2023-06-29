export const getHueForLabel = (label: string): Number => {
  const min = 'a'.charCodeAt(0),
    max = 'z'.charCodeAt(0)
  const position = Math.floor(label.length / 2)
  return (360 * (label.toLowerCase().charCodeAt(position) - min)) / (max / min)
}

export const getPillStyle = (value: string) => ({
  // backgroundColor: `hsl(${getHueForLabel(value)}, 70%, 95%)`,
  // border: `1px solid hsl(${getHueForLabel(value)}, 70%, 85%)`,
  backgroundColor: `hsl(250, 70%, 95%)`,
  border: `1px solid hsl(250, 70%, 85%)`,
})
