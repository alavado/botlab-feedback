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
  Medisis;              2023-05-13
  DentalStudio;         2023-05-13
  LasCruces;            2023-05-13
  Beladent;             2023-05-13
  Integral Linares;     2023-05-13
  CEOLA Vina;           2023-05-13
  Falcon;               2023-05-13
  CEOLA Valdivia;       2023-05-13
  Citymed;              2023-05-13
  Bioreuma;             2023-05-13
  COP;                  2023-05-13
  ADICH;                2023-05-13
  Vitales;              2023-05-13
  CEOLA Concepcion;     2023-05-13
  uandes;               2023-05-13
  OYEDental;            2023-05-13
  SantaBlanca;          2023-05-13
  FALP;                 2023-05-14
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
