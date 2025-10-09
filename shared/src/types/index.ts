export type ApiResponse = {
  message: string;
  success: true;
};

export type ValidationErrorResponse = {
  error: string;
  fields: {
    field: string;
    message: string;
  }[];
};
