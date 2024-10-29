"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenTrabajoService = void 0;
const common_1 = require("@nestjs/common");
let OrdenTrabajoService = class OrdenTrabajoService {
    create(createOrdenTrabajoDto) {
        return 'This action adds a new ordenTrabajo';
    }
    findAll() {
        return `This action returns all ordenTrabajo`;
    }
    findOne(id) {
        return `This action returns a #${id} ordenTrabajo`;
    }
    update(id, updateOrdenTrabajoDto) {
        return `This action updates a #${id} ordenTrabajo`;
    }
    remove(id) {
        return `This action removes a #${id} ordenTrabajo`;
    }
};
exports.OrdenTrabajoService = OrdenTrabajoService;
exports.OrdenTrabajoService = OrdenTrabajoService = __decorate([
    (0, common_1.Injectable)()
], OrdenTrabajoService);
//# sourceMappingURL=orden-trabajo.service.js.map