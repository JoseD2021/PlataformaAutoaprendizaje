import type { SalaRepository } from '../domain/sala-repository'

export class SalaMockRepository implements SalaRepository {
  async obtenerInformacion() {
    return {
      horarios: [
        { dias: 'Lunes a viernes', horas: '8:00 a.m. a 5:00 p.m.' },
        { dias: 'Sábado', horas: '9:00 a.m. a 12:00 m.' },
        { dias: 'Domingo y festivos', horas: 'Cerrado' },
      ],
      normas: [
        'Pide ayuda a un monitor si te pierdes.',
        'Cierra tu sesión de correo y redes al terminar.',
        'Mantén el volumen bajo o usa audífonos.',
        'No se permite comer ni beber junto a los computadores.',
      ],
    }
  }
}