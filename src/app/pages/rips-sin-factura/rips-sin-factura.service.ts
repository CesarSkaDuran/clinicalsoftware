import { Injectable } from '@angular/core';

export interface RipsServiceInput {
  type: 'consulta' | 'procedimiento';
  codPrestador: string;
  fechaInicioAtencion: string;
  numAutorizacion: string;
  idMIPRES: string;
  codCups: string;
  viaIngresoServicioSalud: string;
  modalidadGrupoServicioTecSal: string;
  grupoServicios: string;
  codServicio: string;
  finalidadTecnologiaSalud: string;
  causaMotivoAtencion: string;
  codDiagnosticoPrincipal: string;
  codDiagnosticoRelacionado1: string;
  codDiagnosticoRelacionado2: string;
  codDiagnosticoRelacionado3: string;
  codDiagnosticoRelacionado: string;
  codComplicacion: string;
  tipoDiagnosticoPrincipal: string;
  profesionalTipoDocumento: string;
  profesionalNumeroDocumento: string;
  vrServicio: string;
  conceptoRecaudo: string;
  valorPagoModerador: string;
  numFEVPagoModerador: string;
}

export interface RipsUserInput {
  tipoDocumentoIdentificacion: string;
  numDocumentoIdentificacion: string;
  tipoUsuario: string;
  fechaNacimiento: string;
  codSexo: string;
  codPaisResidencia: string;
  codMunicipioResidencia: string;
  codZonaTerritorialResidencia: string;
  incapacidad: string;
  codPaisOrigen: string;
  registroSIRAS: string;
  servicios: RipsServiceInput[];
}

export interface RipsSinFacturaInput {
  numDocumentoIdObligado: string;
  numNota: string;
  usuarios: RipsUserInput[];
}

@Injectable({ providedIn: 'root' })
export class RipsSinFacturaService {
  build(input: RipsSinFacturaInput): any {
    return {
      numDocumentoIdObligado: input.numDocumentoIdObligado.trim(),
      numFactura: null,
      tipoNota: 'RS',
      numNota: input.numNota.trim(),
      usuarios: input.usuarios.map((user, userIndex) => {
        let serviceConsecutive = 0;
        const consultas = [];
        const procedimientos = [];

        user.servicios.forEach(service => {
          serviceConsecutive += 1;
          const common = {
            codPrestador: service.codPrestador.trim(),
            fechaInicioAtencion: this.formatDateTime(service.fechaInicioAtencion),
            numAutorizacion: this.nullIfEmpty(service.numAutorizacion),
            modalidadGrupoServicioTecSal: service.modalidadGrupoServicioTecSal.trim(),
            grupoServicios: service.grupoServicios.trim(),
            codServicio: Number(service.codServicio),
            finalidadTecnologiaSalud: service.finalidadTecnologiaSalud.trim(),
            tipoDocumentoIdentificacion: service.profesionalTipoDocumento.trim(),
            numDocumentoIdentificacion: service.profesionalNumeroDocumento.trim(),
            codDiagnosticoPrincipal: service.codDiagnosticoPrincipal.trim(),
            vrServicio: Number(service.vrServicio),
            conceptoRecaudo: service.conceptoRecaudo.trim(),
            valorPagoModerador: Number(service.valorPagoModerador),
            numFEVPagoModerador: this.nullIfEmpty(service.numFEVPagoModerador),
            consecutivo: serviceConsecutive
          };

          if (service.type === 'consulta') {
            consultas.push({
              ...common,
              codConsulta: service.codCups.trim(),
              causaMotivoAtencion: service.causaMotivoAtencion.trim(),
              codDiagnosticoRelacionado1: this.nullIfEmpty(service.codDiagnosticoRelacionado1),
              codDiagnosticoRelacionado2: this.nullIfEmpty(service.codDiagnosticoRelacionado2),
              codDiagnosticoRelacionado3: this.nullIfEmpty(service.codDiagnosticoRelacionado3),
              tipoDiagnosticoPrincipal: service.tipoDiagnosticoPrincipal.trim()
            });
          } else {
            procedimientos.push({
              ...common,
              idMIPRES: this.nullIfEmpty(service.idMIPRES),
              codProcedimiento: service.codCups.trim(),
              viaIngresoServicioSalud: service.viaIngresoServicioSalud.trim(),
              codDiagnosticoRelacionado: this.nullIfEmpty(service.codDiagnosticoRelacionado),
              codComplicacion: this.nullIfEmpty(service.codComplicacion)
            });
          }
        });

        return {
          tipoDocumentoIdentificacion: user.tipoDocumentoIdentificacion.trim(),
          numDocumentoIdentificacion: user.numDocumentoIdentificacion.trim(),
          tipoUsuario: user.tipoUsuario.trim(),
          fechaNacimiento: user.fechaNacimiento,
          codSexo: user.codSexo.trim(),
          codPaisResidencia: user.codPaisResidencia.trim(),
          codMunicipioResidencia: user.codMunicipioResidencia.trim(),
          codZonaTerritorialResidencia: user.codZonaTerritorialResidencia.trim(),
          incapacidad: user.incapacidad.trim(),
          consecutivo: userIndex + 1,
          codPaisOrigen: user.codPaisOrigen.trim(),
          registroSIRAS: this.nullIfEmpty(user.registroSIRAS),
          servicios: { consultas, procedimientos }
        };
      })
    };
  }

  private formatDateTime(value: string): string {
    return value.replace('T', ' ');
  }

  private nullIfEmpty(value: string): string | null {
    const normalized = value && value.trim();
    return normalized ? normalized : null;
  }
}
