const TYPE_STRING = "string";
const TYPE_NUMBER = "number";

// RomanNumber implements a two-way number converter from/to integers to roman numerals.
// I've used underscore prefixed method names for private methods.
// I know the hashtag syntax exists but seing it's still at Stage 3 I haven't
// used it.
class RomanNumber {
  constructor(input) {
    this.input = input;
    this.inputType = typeof input;

    this._validate();
    this._parse();
  }

  toInt = () => this.number;
  toString = () => this.roman;

  // _validate is the first private method to be called when the RomanNumber
  // constructor is called, it performs all validations and ensures input and
  // inputType are filled correctly which are necessary for the _parse method.
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

  // _parse assigns the final value of roman and number properties
  // Only one conversion will ever be needed no matter the input.
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

  // _parseRoman takes a number and attempts to get its roman numeral
  // representation by traversing a table that goes from the biggest possible
  // value to the lowest one.
  // No repetition checks are needed because of the table's order.
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

  // parseNumber takes a string (a roman numeral) and attempts to get its
  // decimal representation by traversing a table that goes from the biggest
  // possible value to the lowest one.
  // To avoid issues with two letter numbers we check symbols against the "head"
  // of the string and remove letters from the start of the input until none
  // are left or we are done traversing our symbol table.
  // If inputs are malformed we might have symbols left in the input string
  // in this casae we error out.
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

// allowedCharacters is the list of allowed characters a roman numeral can have
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
