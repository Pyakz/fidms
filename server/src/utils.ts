import { z } from "zod";
import type { ValidationErrorResponse } from "shared";

export const mappedValidationErrors = (
  error: z.core.$ZodError
): ValidationErrorResponse => {
  const errorMap: Array<ValidationErrorResponse["fields"][number]> = [];

  const processErrors = (issues: z.core.$ZodIssue[]) => {
    for (const issue of issues) {
      errorMap.push({
        field: issue.path.join("."),
        message: issue.message || "Unknown error",
      });
    }
  };

  processErrors(error.issues);

  return {
    error: "Validation Error",
    fields: errorMap,
  };
};
