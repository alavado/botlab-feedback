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
  Vitalia;              2023-05-12
  Medisis;              2023-05-12
  DentalStudio;         2023-05-12
  LasCruces;            2023-05-12
  Beladent;             2023-05-12
  Facelab;              2023-05-12
  CEOLA Temuco;         2023-05-12
  Integral Linares;     2023-05-12
  CEOLA Vina;           2023-05-12
  EzioChiappe;          2023-05-12
  Falcon;               2023-05-12
  CEOLA Valdivia;       2023-05-12
  SonrieArica;          2023-05-12
  Citymed;              2023-05-12
  Bioreuma;             2023-05-12
  COP;                  2023-05-12
  ADICH;                2023-05-12
  Vitales;              2023-05-12
  UTC;                  2023-05-12
  CEOLA Concepcion;     2023-05-12
  uandes;               2023-05-12
  Vitasalud;            2023-05-12
  OYEDental;            2023-05-12
  FARR;                 2023-05-12
  SantaBlanca;          2023-05-12
  NucleoSalud;          2023-05-12
  FALP;                 2023-05-13
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
