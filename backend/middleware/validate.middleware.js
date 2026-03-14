const validate = (schema) => async (req, res, next) => {
  try {
    const result = await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (result.body) req.body = result.body;
    if (result.params) req.params = result.params;

    next();
  } catch (error) {
    if (error.issues) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formattedErrors,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: [{ message: error.message }],
    });
  }
};

export default validate;