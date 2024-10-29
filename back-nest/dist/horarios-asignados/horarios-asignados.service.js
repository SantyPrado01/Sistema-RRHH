"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorariosAsignadosService = void 0;
const common_1 = require("@nestjs/common");
let HorariosAsignadosService = class HorariosAsignadosService {
    create(createHorariosAsignadoDto) {
        return 'This action adds a new horariosAsignado';
    }
    findAll() {
        return `This action returns all horariosAsignados`;
    }
    findOne(id) {
        return `This action returns a #${id} horariosAsignado`;
    }
    update(id, updateHorariosAsignadoDto) {
        return `This action updates a #${id} horariosAsignado`;
    }
    remove(id) {
        return `This action removes a #${id} horariosAsignado`;
    }
};
exports.HorariosAsignadosService = HorariosAsignadosService;
exports.HorariosAsignadosService = HorariosAsignadosService = __decorate([
    (0, common_1.Injectable)()
], HorariosAsignadosService);
//# sourceMappingURL=horarios-asignados.service.js.map