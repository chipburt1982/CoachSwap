const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

const validateListingCreation = [
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('description').trim().notEmpty().isLength({ min: 10 }),
  body('category').trim().notEmpty(),
  body('condition').trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('location').trim().notEmpty(),
  handleValidationErrors
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().notEmpty().isLength({ max: 1000 }),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateListingCreation,
  validateReview,
  handleValidationErrors
};
