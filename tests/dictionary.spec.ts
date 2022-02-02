import Dictionary from "../src/app/dictionary";

describe("Dictionary", () => {
  it ("should be a singleton", () => {
    const dictionary1 = Dictionary.getInstance();
    const dictionary2 = Dictionary.getInstance();
    expect(dictionary1).toBe(dictionary2);
  });

  it ("should read words from file", () => {
    const dictionary = Dictionary.getInstance();
    const words = dictionary.getValidWords();
    expect(words.length).toBeGreaterThan(0);
  });

  it ("should read secrets from file", () => {
    const dictionary = Dictionary.getInstance();
    const secrets = dictionary.getSecrets();
    expect(secrets.length).toBeGreaterThan(0);
    console.log([dictionary.getRandomSecret()]);
  });

  it ("should get a random secret", () => {
    const dictionary = Dictionary.getInstance();
    const secret = dictionary.getRandomSecret();
    expect(dictionary.getSecrets()).toContain(secret);
  });

  it ("all valid words should be 5 characters long", () => {
    const dictionary = Dictionary.getInstance();
    const words = dictionary.getValidWords();
    words.forEach(word => {
      expect(word.length).toBe(5);
    });
  });
});