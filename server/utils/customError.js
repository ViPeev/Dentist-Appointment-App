class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

const rejectResponse = (res, error) => {
  let code = 500;
  let message = "Internal server error!";

  if (error instanceof ValidationError) {
    [message, code] = error.message.split(" - ");
  }

  return res.status(code).json({ ok: false, message });
};

module.exports = { ValidationError, rejectResponse };
