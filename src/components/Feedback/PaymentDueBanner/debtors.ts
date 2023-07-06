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
  NuevaPanoramica; 2023-07-12
  YohananTherapeutes;  2023-07-12
  Vitasalud;  2023-07-12
  Vitalia;  2023-07-12
  Vitales;  2023-07-12
  Visum;  2023-07-12
  UTC;  2023-07-12
  SonrieArica; 2023-07-12
  SGFertility; 2023-07-12
  SantaCatalina; 2023-07-12
  SantaBlanca; 2023-07-12
  Rao;  2023-07-12
  OYEDental; 2023-07-12
  OrregoLuco;  2023-07-12
  NucleoSalud; 2023-07-12
  Medisis;  2023-07-12
  Marchesani; 2023-07-12
  Maitentes;  2023-07-12
  KinderSonrisa; 2023-07-12
  Isamedica;  2023-07-12
  IntegralLinares; 2023-07-12
  FARR; 2023-07-12
  EzioChiappe; 2023-07-12
  Everest;  2023-07-12
  Elquivision; 2023-07-12
  CTMelipilla;  2023-07-12
  CORE; 2023-07-12
  COP;  2023-07-12
  Clinica Astra;  2023-07-12
  Clinyco;  2023-07-12
  Citymed;  2023-07-12
  CEOLAVina; 2023-07-12
  CEOLAValdivia; 2023-07-12
  CEOLATemuco; 2023-07-12
  CEOLALaSerena;  2023-07-12
  CEOLAConcepcion; 2023-07-12
  BrisasSalud; 2023-07-12
  Avaria; 2023-07-12
  Almendrales;  2023-07-12
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
