export class ErrorWithDetail extends Error {
  detailSection?: JSX.Element;
  constructor(detailSection?: JSX.Element, message?: string) {
    super(message);
    this.detailSection = detailSection;
  }
}
