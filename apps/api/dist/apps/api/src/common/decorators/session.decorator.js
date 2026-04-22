"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const common_1 = require("@nestjs/common");
exports.Session = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.session) {
        throw new Error("Session decorator used without SessionGuard");
    }
    return req.session;
});
//# sourceMappingURL=session.decorator.js.map