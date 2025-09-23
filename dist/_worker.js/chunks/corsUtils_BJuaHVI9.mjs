globalThis.process ??= {}; globalThis.process.env ??= {};
const createOPTIONSHandler = (allowedMethods = ["GET", "POST", "OPTIONS"]) => {
  return async () => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": allowedMethods.join(", "),
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Credentials": "false"
      }
    });
  };
};
const getCORSHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
});
const createErrorResponse = (message, status = 400, extra) => {
  const body = { error: message, ...extra ?? {} };
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...getCORSHeaders()
      }
    }
  );
};
const createSuccessResponse = (data, status = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...getCORSHeaders()
      }
    }
  );
};

export { createSuccessResponse as a, createErrorResponse as b, createOPTIONSHandler as c };
