import { useSelector } from "react-redux";
import "./AlertaDeudores.css";

const usuariosDeudores = [
  // 'BiobioSalud'

  "AltoTobalaba",
  "Redental",
  "EzioChiappe",
  "BeHappy",
  "Facelab",
  "3DentOnce16",
  "AltosDelValle",
  "Falcon",
  "Tabilo",
  "Tobalaba",
  "CATH",
  "RAO",
  "Made",
  "BDental",
  "Cesmed",
  "YohananTherapeutes",
  "AyVDental",
  "CTMelipilla",
  "RoaDent",
  "MAZ",
  "SonrieArica",
  "CerroGrande",
  "Santis",
  "OYEDental",
  "Norden",
  "SantaBlanca",
  "Everest",
  "LeCiel",
  "Sanasalud",
  "Maitenes",
];

const AlertaDeudores = () => {
  const { nombreUsuario } = useSelector((state) => state.login);
  const usuario = usuariosDeudores.find((u) => u === nombreUsuario);

  if (!usuario) {
    return null;
  }

  const correoPrincipal = `finanzas@cero.ai`;

  return (
    <div className="AlertaDeudores">
      Tienes facturas vencidas en espera de pago. Regulariza tu deuda
      comunicándote al +56942773233 o en {correoPrincipal}
    </div>
  );
};

export default AlertaDeudores;
