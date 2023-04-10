import { parse } from 'date-fns'

type Debtor = {
  clientName: string
  dueDate: Date
}

// ejemplo
// const debtorsData = `
//   3DentOnce16;          2023-04-11
//   Falcon;               2023-04-11
// `

const debtorsData = `
  3DentOnce16;          2023-04-11
  Falcon;               2023-04-11
  uandes;               2023-04-11
  CEOLA Concepcion;     2023-04-11
  Vitasalud;            2023-04-11
  CTMelipilla;          2023-04-11
  Cegin;                2023-04-11
  Vitales;              2023-04-11
  EzioChiappe;          2023-04-11
  Integral Linares;     2023-04-11
  NucleoSalud;          2023-04-11
  Maitenes;             2023-04-11
  Sanasalud;            2023-04-11
`

const debtors = debtorsData
  .split(`\n`)
  .filter((x) => x.trim())
  .map((client): Debtor => {
    const [name, date] = client.split(';')
    return {
      clientName: name.trim(),
      dueDate: parse(date.trim(), 'yyyy-MM-dd', new Date()),
    }
  })

export const isDebtor = (clientName: string): Debtor | false => {
  const debtor = debtors.find((d) => d.clientName === clientName)
  if (!debtor) {
    return false
  }
  return debtor
}
