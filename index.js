const TYPE_STRING = "string";
const TYPE_NUMBER = "number";

class RomanNumber {
  constructor(input) {
    this.input = input;
    this.inputType = typeof input;

    this._validate();
    this._parse();
  }

  toInt = () => this.number;
  toString = () => this.roman;

  _validate() {
    if (this.input == null) {
      throw new Error("value required");
    }

    if (this.inputType !== TYPE_NUMBER && this.inputType !== TYPE_STRING) {
      throw new Error("invalid value");
    }

    if (this.inputType === TYPE_NUMBER) {
      const inputNotInRange = this.input < 1 || this.input > 3999;
      if (inputNotInRange) {
        throw new Error("invalid range");
      }
    }

    if (this.inputType === TYPE_STRING) {
      const hasInvalidCharacters = [...this.input].some(
        ch => !allowedCharacters.includes(ch)
      );
      if (hasInvalidCharacters) {
        throw new Error("invalid value");
      }
    }
  }

  _parse() {
    this.roman =
      this.inputType === TYPE_STRING
        ? this.input
        : this._parseRoman(this.input);

    this.number =
      this.inputType === TYPE_NUMBER
        ? this.input
        : this._parseNumber(this.input);
  }

  _parseRoman(input) {
    const symbols = [];
    while (input > 0) {
      for (const { symbol, value } of table) {
        if (input >= value) {
          symbols.push(symbol);
          input -= value;
          continue;
        }
      }
    }

    return symbols.join("");
  }

  _parseNumber(input) {
    let number = 0;
    for (const { symbol, value, reps } of table) {
      for (let r = 0; r < reps; r++) {
        if (input.startsWith(symbol)) {
          number += value;
          input = input.slice(symbol.length);
        }
      }
    }

    if (input.length !== 0) {
      throw new Error("invalid value");
    }

    return number;
  }
}

const allowedCharacters = ["M", "D", "C", "L", "X", "V", "I"];

const table = [
  { symbol: "M", value: 1000, reps: 3 },
  { symbol: "CM", value: 900, reps: 1 },
  { symbol: "D", value: 500, reps: 1 },
  { symbol: "CD", value: 400, reps: 1 },
  { symbol: "C", value: 100, reps: 3 },
  { symbol: "XC", value: 90, reps: 1 },
  { symbol: "L", value: 50, reps: 1 },
  { symbol: "XL", value: 40, reps: 1 },
  { symbol: "X", value: 10, reps: 3 },
  { symbol: "IX", value: 9, reps: 1 },
  { symbol: "V", value: 5, reps: 1 },
  { symbol: "IV", value: 4, reps: 1 },
  { symbol: "I", value: 1, reps: 3 }
];

// ---

var romanNumber1 = new RomanNumber("XX");
var romanNumber2 = new RomanNumber(40);

console.log(romanNumber1.toInt()); // => 20
console.log(romanNumber1.toString()); // => 'XX'
console.log(romanNumber2.toInt()); // => 40
console.log(romanNumber2.toString()); // => 'XL'
