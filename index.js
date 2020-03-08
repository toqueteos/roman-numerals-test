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

// I've defined two helpers tok and terr to help me define test cases:
// - tok is for test cases that succeed, it requires the input value
// and the two expected results (number and roman)
// - terr is for test cases that fail, it only requires the input value

const tok = (value, roman, number) => ({
  description: `test ${value}`,
  error: false,
  value,
  roman,
  number
});

const terr = value => ({
  description: `test ${value}`,
  error: true,
  value
});

const testCases = [
  // Tests defined by the test
  terr(null),
  terr(""),
  terr(0),
  tok(1, "I", 1),
  tok(3, "III", 3),
  tok(4, "IV", 4),
  tok(5, "V", 5),
  tok("I", "I", 1),
  tok("III", "III", 3),
  terr("IIII"),
  tok("IV", "IV", 4),
  tok("V", "V", 5),
  tok(1968, "MCMLXVIII", 1968),
  terr("1473"),
  tok(2999, "MMCMXCIX", 2999),
  tok(3000, "MMM", 3000),
  terr(10000),
  tok("CDXXIX", "CDXXIX", 429),
  terr("CD1X"),
  terr("error"),
  tok("MCDLXXXII", "MCDLXXXII", 1482),
  tok("MCMLXXX", "MCMLXXX", 1980),
  terr("MMMMCMXCIX"),
  terr("MMMMDMXCIX"),
  // Tests defined by me
  tok(17, "XVII", 17),
  tok(20, "XX", 20),
  tok(1995, "MCMXCV", 1995),
  tok(3303, "MMMCCCIII", 3303),
  tok("XVII", "XVII", 17),
  tok("XL", "XL", 40),
  tok("MCMXCV", "MCMXCV", 1995),
  tok("MMMCCCIII", "MMMCCCIII", 3303)
];

const testRunner = tests => {
  const stats = { ok: 0, ko: 0, total: tests.length };

  for (const test of tests) {
    if (testRun(test)) {
      stats.ok++;
    } else {
      stats.ko++;
    }
  }

  if (stats.ok === stats.total) {
    console.log(`Success! ${stats.ok}/${stats.total} tests passed.`);
  } else {
    console.error(`Failure! ${stats.ko}/${stats.total} tests failed.`);
  }
};

const testRun = ({ description, error, value, number, roman }) => {
  let failed = false;
  let err;
  let gotNumber, gotRoman;

  try {
    const r = new RomanNumber(value);
    gotNumber = r.toInt();
    gotRoman = r.toString();
  } catch (ex) {
    failed = true;
    err = ex;
  }

  if (!failed && error) {
    console.error(
      `${description} didn't fail but an error ${err} was expected.`
    );
    return false;
  }

  if (failed && !error) {
    console.error(`${description} failed but an error ${err} wasn't expected.`);
    return false;
  }

  if (gotNumber !== number) {
    console.error(
      `${description} toInt() got ${gotNumber}, expected ${number}.`
    );
    return false;
  }

  if (gotRoman !== roman) {
    console.error(
      `${description} toString() got ${gotRoman}, expected ${roman}.`
    );
    return false;
  }

  return true;
};

testRunner(testCases);
