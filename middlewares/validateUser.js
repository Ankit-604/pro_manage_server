const { body, validationResult } = require("express-validator");

const validateUser = async (req, res, next) => {
  // Validate email
  await body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .customSanitizer((value) => value?.toLowerCase())
    .run(req);

  // Validate password
  await body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*\d)(?=.*[a-zA-Z])/)
    .withMessage("Password must be alphanumeric")
    .run(req);

  // Validate new password
  await body("newPassword")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*\d)(?=.*[a-zA-Z])/)
    .withMessage("Password must be alphanumeric")
    .run(req);

  // Validate name
  await body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .run(req);

  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: errors.array()[0].msg,
    });
  }

  next();
};

module.exports = validateUser;
