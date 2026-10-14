import { HttpClient } from '@angular/common/http';
import { RipsSinFacturaService } from './rips-sin-factura.service';

describe('RipsSinFacturaService', () => {
  let service: RipsSinFacturaService;

  beforeEach(() => {
    service = new RipsSinFacturaService({} as HttpClient);
  });

  it('builds a no-invoice payload with RS note and per-user service consecutive', () => {
    const payload = service.build({
      numDocumentoIdObligado: '900123456',
      numNota: 'RS-0001',
      usuarios: [{
        tipoDocumentoIdentificacion: 'CC',
        numDocumentoIdentificacion: '123456789',
        tipoUsuario: '01',
        fechaNacimiento: '1990-01-01',
        codSexo: 'F',
        codPaisResidencia: '170',
        codMunicipioResidencia: '05001',
        codZonaTerritorialResidencia: '01',
        incapacidad: 'NO',
        codPaisOrigen: '170',
        registroSIRAS: '',
        servicios: [{
          type: 'consulta',
          codPrestador: '123456789001',
          fechaInicioAtencion: '2026-10-13T09:30',
          numAutorizacion: '',
          idMIPRES: '',
          codCups: '890201',
          viaIngresoServicioSalud: '',
          modalidadGrupoServicioTecSal: '01',
          grupoServicios: '01',
          codServicio: '130',
          finalidadTecnologiaSalud: '16',
          causaMotivoAtencion: '38',
          codDiagnosticoPrincipal: 'K021',
          codDiagnosticoRelacionado1: '',
          codDiagnosticoRelacionado2: '',
          codDiagnosticoRelacionado3: '',
          codDiagnosticoRelacionado: '',
          codComplicacion: '',
          tipoDiagnosticoPrincipal: '01',
          profesionalTipoDocumento: 'CC',
          profesionalNumeroDocumento: '123456789',
          vrServicio: '50000',
          conceptoRecaudo: '05',
          valorPagoModerador: '0',
          numFEVPagoModerador: ''
        }]
      }]
    });

    expect(payload.numFactura).toBeNull();
    expect(payload.tipoNota).toBe('RS');
    expect(payload.usuarios[0].consecutivo).toBe(1);
    expect(payload.usuarios[0].servicios.consultas[0].fechaInicioAtencion).toBe('2026-10-13 09:30');
    expect(payload.usuarios[0].servicios.consultas[0].consecutivo).toBe(1);
    expect(payload.usuarios[0].servicios.consultas[0].numAutorizacion).toBeNull();
  });
});
