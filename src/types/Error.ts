export interface ResponseError {
  kind: "Error";
  id: string;
  href: string;
  code: string;
  reason: string;
}
