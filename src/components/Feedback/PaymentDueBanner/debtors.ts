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
  CEOLAValdivia;          2023-04-11
  Citymed;          2023-04-11
  Facelab;          2023-04-11
  Interclínica;          2023-04-11
  Maitenes;          2023-04-11
  KinderSonrisa;          2023-04-11
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
