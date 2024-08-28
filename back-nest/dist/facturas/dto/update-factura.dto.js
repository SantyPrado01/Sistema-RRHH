"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFacturaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_factura_dto_1 = require("./create-factura.dto");
class UpdateFacturaDto extends (0, mapped_types_1.PartialType)(create_factura_dto_1.CreateFacturaDto) {
}
exports.UpdateFacturaDto = UpdateFacturaDto;
//# sourceMappingURL=update-factura.dto.js.map