export interface ResponseError {
  kind: "Error";
  id: string;
  href: string;
  code: string;
  reason: string;
}

export class ErrorWithDetail extends Error {
  detailSection?: JSX.Element;
  constructor(detailSection?: JSX.Element, message?: string) {
    super(message);
    this.detailSection = detailSection;
  }
}
