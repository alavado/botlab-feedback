import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getNameOfLocation, LocationType } from '../../helpers/locations'
import { getIconByPlaceType, translatePlaceTypeSlug, formatPlaceType, formatHQ, formatLine, formatCategory, formatLivestockSuppliesLine, formatPoultry } from '../../helpers/places'
import { parseISO, format, isDate } from 'date-fns'
import { es } from 'date-fns/locale'

export const placeApi = createApi({
  reducerPath: 'placeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://trazabilidadsenasa.cl/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('access-token', token)
      }
      return headers
    },
  }),
  endpoints: builder => ({
    place: builder.query({
      query: ({ id, spanishType }) => `/${translatePlaceTypeSlug(spanishType, 'es')}/${id}`,
      transformResponse: res => {
        const data = res.data[0]
        const placeData = {
          name: data.name,
          padron: data.id || '',
          ruc: data.ruc || '',
          address: data.address_legal || data.address || '-',
          category: formatCategory(data.category) || '-',
          type: data.type,
          hq: formatHQ(data.hq),
          displayType: formatPlaceType(data.type),
          nameDepartamento: getNameOfLocation(data.department, LocationType.Departamento),
          nameProvincia: getNameOfLocation([data.province, data.codi_prov_tpr], LocationType.Provincia),
          nameDistrito: getNameOfLocation([data.district, data.codi_prov_tpr, data.codi_dist_tdi], LocationType.Distrito),
          icon: getIconByPlaceType(data.type)
        }
        switch (data.type) {
          case 'agricultural-supplies': 
            placeData.extraData = {
              'Giro': formatLine(data.line),
              'Año de registro': data.year || '-',
              'Número de expediente': data.file_code || data.document_code || '-'
            }
            break
          case 'feed-processing': 
            placeData.extraData = {
              'Dirección real': data.address_real || '-',
            }
            placeData.contactData = {
              'RUC responsable': data.ruc_profesional || '-',
            }
            break
          case 'livestock-supplies': 
            placeData.extraData = {
              'Giro(s)': formatLivestockSuppliesLine(data),
              'Dirección real': data.address_real,
              'Año de registro': data.year || '-',
              'Número de expediente': data.document_code || '-'
            }
            placeData.contactData = {
              'Documento responsable': data.document_code ? `${data.document_code} (${data.document_type})` : '-'
            }
            break
          case 'poultry-farm': 
            placeData.extraData = {
              'Giro': data.giro_granja || '-',
              'Año de registro': data.year || '-',
              'Tipos de ave': formatPoultry(data.tipos_ave) || '-',
              'Código de autorización de construcción': data.solicitud_construccion || '-',
              'Código de autorización de funcionamiento': data.autorizacion_funcionamiento || '-',
              'Fecha vencimiento autorización': data.fecha_vencimiento_autorizacion ? format(parseISO(data.fecha_vencimiento_autorizacion), `dd MMMM yyyy`, { locale: es }) : '-',
              'Código único': data.file_code || '-',
              'Código predio': data.estate_code || '-',
              'Código expediente': data.ccodexp || '-',
              'Capacidad diaria': data.capacidad_diaria?.toLocaleString('de-DE') || '-',
              'Capacidad instalada': data.capacidad_instalada?.toLocaleString('de-DE') || '-',
              'Número de galpones': data.numero_galpones || '-'
            }
            placeData.contactData = {
              'Solicitante': `${data.nombres_solicitante} ${data.apellido_paterno_solicitante} ${data.apellido_materno_solicitante}` || '-',
              'Documento': `${data.dni} (${data.tipo_documento_interesado})`,
              'Teléfono establecimiento': data.telefono_establecimiento || '-',
              'Fax': data.fax_interesado || '-',
              'E-mail establecimiento 1': data.correo_establecimiento || '-',
              'E-mail establecimiento 2': data.email_interesado || '-',
              'Domicilio interesado': data.domicilio_legal_interesado || '-',
              'Persona de contacto': data.contacto || '-'
            }
            break
          case 'slaughterhouse':
            placeData.extraData = {
              'Giro': 'Matadero',
              'Año de registro': isDate(data.date) ? format(parseISO(data.date), 'yyyy') : '-',
              'Código de autorización': data.auth_code || '-'
            }
            break
          case 'primary-processing':
            placeData.extraData = {
              'Tipo de alimento': data.food_type,
              'Estado': data.state,
              'Identificador establecimiento': data.id_establishment,
              'Identificador archivo': data.id_file,
              'Identificador solicitud': data.request_id,
              'Identificador reporte': data.id_report,
              'Identificador reporte AUI': data.id_report_aui,
            }
            break
          default:
            placeData.extraData = {}
        }
        return placeData
      }
    })
  }),
})

export const {
  usePlaceQuery
} = placeApi