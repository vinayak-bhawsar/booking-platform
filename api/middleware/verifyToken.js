import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

/* ================= VERIFY TOKEN ================= */

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(401, "Not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }

    req.user = user; // contains id + isAdmin
    next();
  });
};

/* ================= VERIFY USER ================= */
/* Allow: Own account OR Admin */

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

/* ================= VERIFY ADMIN ================= */
/* Allow: Only Admin */

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "Admin access only!"));
    }
  });
};