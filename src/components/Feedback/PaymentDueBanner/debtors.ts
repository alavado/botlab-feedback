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
  Interclínica;          2023-04-11
  Maitenes;          2023-04-11
  uandes;          2023-04-11
  Almendrales;          2023-04-11
  CEOLAConcepcion;          2023-04-11
  CEOLAValdivia;          2023-04-11
  Citymed;          2023-04-11
  CTMelipilla;          2023-04-11
  Everest;          2023-04-11
  SantaBlanca;          2023-04-11
  Vitalia;          2023-04-11
  YohananTherapeutes;          2023-04-11
  OYEDental;          2023-04-11
  UTC;          2023-04-11
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
