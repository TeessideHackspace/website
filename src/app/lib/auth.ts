import { Response } from "express";
import { Request } from "express-jwt";

type RequestWithDefiniteUser = Request & {
  auth: {
    sub: string;
    email: string;
  };
};

export const checkAuth = (
  req: Request,
  res: Response
): req is RequestWithDefiniteUser => {
  if (!req.auth || !req.auth.sub) {
    res.status(401).json({
      errors: [
        {
          status: 401,
          code: "UNAUTHORISED",
          title: "You are not authorised to access this resource",
        },
      ],
    });
    return false;
  }
  return true;
};
