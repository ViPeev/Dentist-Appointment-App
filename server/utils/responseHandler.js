const { ValidationError } = require("./errorClass");

const rejectResponse = (res, error) => {
  let statusCode = 500;
  let message = "Internal server error!";

  if (error instanceof ValidationError) {
    [message, statusCode] = error.message.split(" - ");
  }

  return res.status(statusCode).json({ ok: false, message });
};

const responseHandler = async ({
  res,
  controller,
  deps,
  statusCode,
  hasDataTransfer,
  message,
}) => {
  const payload = { ok: true };

  try {
    
    if (hasDataTransfer) {
      const result = await controller(...deps);
      payload.result = result;
    } else {
      await controller(...deps);
      payload.message = message;
    }

    return res.status(statusCode || 200).json(payload);
  } catch (error) {
    return rejectResponse(res, error);
  }
};

module.exports = responseHandler;
