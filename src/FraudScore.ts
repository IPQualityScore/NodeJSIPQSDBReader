export default class FraudScore {
  public raw: number[] = [];

  public setFraudScore(strictness: number, value: number) {
    this.raw[strictness] = value;
  }

  public getFraudScore(strictness: number) {
    if (this.raw[strictness] === undefined) {
      throw new Error(
        "Invalid or nonexistant strictness. Please check the call and try again."
      );
    }

    return this.raw[strictness];
  }
}
