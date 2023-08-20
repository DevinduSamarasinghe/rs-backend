
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface FormattedRequest extends Request {
    user?: JwtPayload  | null | undefined;
}
