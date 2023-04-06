import { parse } from 'date-fns'

type Debtor = {
  clientName: string
  dueDate: Date
}

const debtorsData = `
  3DentOnce16;          2023-04-11
  Falcon;               2023-04-11
  CEOLA Temuco;         2023-04-11
  Citymed;              2023-04-11
  uandes;               2023-04-11
  CEOLA Concepcion;     2023-04-11
  COP;                  2023-04-11
  Vitasalud;            2023-04-11
  CTMelipilla;          2023-04-11
  Cegin;                2023-04-11
  Vitales;              2023-04-11
  UTC;                  2023-04-11
  EzioChiappe;          2023-04-11
  Integral Linares;     2023-04-11
  2020;                 2023-04-11
  BrisasSalud;          2023-04-11
  SantaBlanca;          2023-04-11
  Everest;              2023-04-11
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
