import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  onModuleInit() {
    const currentTime = new Date();
    console.log(`[SomeService] Hora actual al inicializar el módulo: ${currentTime.toISOString()}`);
    console.log(`[SomeService] Hora actual formateada para Argentina: ${currentTime.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`);
  }
}
