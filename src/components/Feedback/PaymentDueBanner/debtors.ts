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
  SonrieArica; 2023-07-12
  KinderSonrisa; 2023-07-12
  Interclínica;  2023-07-12
  Isamedica;  2023-07-12
  CTMelipilla;  2023-07-12
  CEOLAValdivia; 2023-07-12
  CEOLALaSerena;  2023-07-12
  OAS;  2023-07-12
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
