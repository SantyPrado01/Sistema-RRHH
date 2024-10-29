"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrdenTrabajoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_orden_trabajo_dto_1 = require("./create-orden-trabajo.dto");
class UpdateOrdenTrabajoDto extends (0, mapped_types_1.PartialType)(create_orden_trabajo_dto_1.CreateOrdenTrabajoDto) {
}
exports.UpdateOrdenTrabajoDto = UpdateOrdenTrabajoDto;
//# sourceMappingURL=update-orden-trabajo.dto.js.map