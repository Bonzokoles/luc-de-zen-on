import type { APIRoute } from "astro";
import { createErrorResponse } from "../../utils/corsUtils";

export const POST: APIRoute = async () => {
  return createErrorResponse(
    "This endpoint is deprecated. Please use /api/generate-image.",
    410
  );
};

export const GET: APIRoute = async () => {
    return createErrorResponse(
      "This endpoint is deprecated. Please use /api/generate-image.",
      410
    );
  };