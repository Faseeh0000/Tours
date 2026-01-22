// middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formatted = result.error.format();
    return res.status(400).json({ status: "fail", errors: formatted });
  }
  req.validated = result.data;
  next();
};