"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrdenTrabajoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createOrdenTrabajo_dto_1 = require("./createOrdenTrabajo.dto");
class UpdateOrdenTrabajoDto extends (0, mapped_types_1.PartialType)(createOrdenTrabajo_dto_1.CreateOrdenTrabajoDto) {
}
exports.UpdateOrdenTrabajoDto = UpdateOrdenTrabajoDto;
//# sourceMappingURL=updateOrdenTrabajo.dto.js.map