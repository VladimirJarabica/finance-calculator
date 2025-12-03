declare module "exact-math" {
  type NumericValue = number;

  interface Config {
    /** Return result as string instead of number */
    returnString?: boolean;
    /** Character used as decimal separator (default: '.') */
    decimalChar?: string;
    /** Characters recognized as division sign (default: ['/', ':', '÷']) */
    divChar?: string[];
    /** Characters recognized as multiplication sign (default: ['*', 'x', '×', '⋅']) */
    mulChar?: string[];
    /** Minimum exponent for exponential notation for negative exponents */
    eMinus?: number;
    /** Minimum exponent for exponential notation for positive exponents */
    ePlus?: number;
    /** Maximum decimal places in result */
    maxDecimal?: number;
    /** Throw error on divide by zero (default: true) */
    divideByZeroError?: boolean;
    /** Throw error on invalid input (default: true) */
    invalidError?: boolean;
    /** Trim trailing zeros from result */
    trim?: boolean;
  }

  type Callback = (error: Error | null, result: number) => void;

  /**
   * Addition - adds all passed numeric values
   * @param values - Two or more numeric values to add
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The sum of all values
   */
  export function add(...args: [...NumericValue[], Config?, Callback?]): number;
  export function add(
    x: NumericValue,
    y: NumericValue,
    ...rest: NumericValue[]
  ): number;
  export function add(x: NumericValue, y: NumericValue, config: Config): number;
  export function add(
    x: NumericValue,
    y: NumericValue,
    callback: Callback
  ): number;
  export function add(
    x: NumericValue,
    y: NumericValue,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Subtraction - subtracts values from left to right
   * @param values - Two or more numeric values to subtract
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The result of subtraction
   */
  export function sub(...args: [...NumericValue[], Config?, Callback?]): number;
  export function sub(
    x: NumericValue,
    y: NumericValue,
    ...rest: NumericValue[]
  ): number;
  export function sub(x: NumericValue, y: NumericValue, config: Config): number;
  export function sub(
    x: NumericValue,
    y: NumericValue,
    callback: Callback
  ): number;
  export function sub(
    x: NumericValue,
    y: NumericValue,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Multiplication - multiplies all passed numeric values
   * @param values - Two or more numeric values to multiply
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The product of all values
   */
  export function mul(...args: [...NumericValue[], Config?, Callback?]): number;
  export function mul(
    x: NumericValue,
    y: NumericValue,
    ...rest: NumericValue[]
  ): number;
  export function mul(x: NumericValue, y: NumericValue, config: Config): number;
  export function mul(
    x: NumericValue,
    y: NumericValue,
    callback: Callback
  ): number;
  export function mul(
    x: NumericValue,
    y: NumericValue,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Division - divides values from left to right
   * @param values - Two or more numeric values to divide
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The result of division
   */
  export function div(...args: [...NumericValue[], Config?, Callback?]): number;
  export function div(
    x: NumericValue,
    y: NumericValue,
    ...rest: NumericValue[]
  ): number;
  export function div(x: NumericValue, y: NumericValue, config: Config): number;
  export function div(
    x: NumericValue,
    y: NumericValue,
    callback: Callback
  ): number;
  export function div(
    x: NumericValue,
    y: NumericValue,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Formula - evaluates a string arithmetic formula
   * @param formula - String arithmetic formula (e.g., '5.55*(7/.33)-2')
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The result of the formula
   */
  export function formula(formula: string): number;
  export function formula(formula: string, config: Config): number;
  export function formula(formula: string, callback: Callback): number;
  export function formula(
    formula: string,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Round - rounds value to specified decimal places
   * @param value - Numeric value to round
   * @param places - Number of decimal places (negative for decimals, positive for integers). Default: 1
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The rounded value
   */
  export function round(value: NumericValue): number;
  export function round(value: NumericValue, places: number): number;
  export function round(value: NumericValue, config: Config): number;
  export function round(
    value: NumericValue,
    places: number,
    config: Config
  ): number;
  export function round(
    value: NumericValue,
    places: number,
    callback: Callback
  ): number;
  export function round(
    value: NumericValue,
    places: number,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Ceil - rounds value up to specified decimal places
   * @param value - Numeric value to ceil
   * @param places - Number of decimal places (negative for decimals, positive for integers). Default: 1
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The ceiled value
   */
  export function ceil(value: NumericValue): number;
  export function ceil(value: NumericValue, places: number): number;
  export function ceil(value: NumericValue, config: Config): number;
  export function ceil(
    value: NumericValue,
    places: number,
    config: Config
  ): number;
  export function ceil(
    value: NumericValue,
    places: number,
    callback: Callback
  ): number;
  export function ceil(
    value: NumericValue,
    places: number,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Floor - rounds value down to specified decimal places
   * @param value - Numeric value to floor
   * @param places - Number of decimal places (negative for decimals, positive for integers). Default: 1
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The floored value
   */
  export function floor(value: NumericValue): number;
  export function floor(value: NumericValue, places: number): number;
  export function floor(value: NumericValue, config: Config): number;
  export function floor(
    value: NumericValue,
    places: number,
    config: Config
  ): number;
  export function floor(
    value: NumericValue,
    places: number,
    callback: Callback
  ): number;
  export function floor(
    value: NumericValue,
    places: number,
    config: Config,
    callback: Callback
  ): number;

  /**
   * Power - raises base to exponent
   * @param base - Base numeric value
   * @param exponent - Exponent value
   * @param config - Optional configuration object
   * @param callback - Optional callback function
   * @returns The result of base^exponent
   */
  export function pow(base: NumericValue, exponent: NumericValue): number;
  export function pow(
    base: NumericValue,
    exponent: NumericValue,
    config: Config
  ): number;
  export function pow(
    base: NumericValue,
    exponent: NumericValue,
    callback: Callback
  ): number;
  export function pow(
    base: NumericValue,
    exponent: NumericValue,
    config: Config,
    callback: Callback
  ): number;

  const exactMath: {
    add: typeof add;
    sub: typeof sub;
    mul: typeof mul;
    div: typeof div;
    formula: typeof formula;
    round: typeof round;
    ceil: typeof ceil;
    floor: typeof floor;
    pow: typeof pow;
  };

  export default exactMath;
}
