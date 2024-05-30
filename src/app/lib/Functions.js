export const encrypt = (data) => {
  // Your encryption logic here
  // Used md5 to encrypt the input and return encrypted value back.
  const crypto = require("crypto");
  const hash = crypto.createHash("md5");
  const encryptedData = hash.update(data).digest("hex");
  return encryptedData;
};

export const decrypt = (data) => {
  // Your decryption logic here
  // Used md5 to decrypt the input and return decrypted value back.
  const crypto = require("crypto");
  const hash = crypto.createHash("md5");
  const decryptedData = hash.update(data).digest("hex");
  return decryptedData;
};


/**
 * 
 * @param data object
 * @param validation array 
 * @returns object
 */
export const validateData = (data, validation) => {
  // Pre-process validation rules for efficiency
  let validData = {}

  for (const field in validation) {
    let match = true;
    const rules = validation[field].split("|").map((rule) => {
      if (rule.includes(":")) {
        const [funcName, params] = rule.split(":");
        match = validatoreFunctions[`is_${funcName}`](params, data[field]);
      }
      match = validatoreFunctions[`is_${funcName}`](data[field]);
      if (!match) {
        validData.push({ field: { error: errors.funcName } });
      };
      validData.push({ field: data.field });
    });
  }
  return validData;
};



const validatoreFunctions = {
  is_required: (value) => value !== undefined && value !== null && value !== "",
  is_email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  is_phone: (value) => /^[0-9]{10,15}$/.test(value),
  is_password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
  is_url: (value) => /^(http|https):\/\/[^\s]+$/gm.test(value),
  is_number: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  is_boolean: (value) => typeof value === "boolean",
  is_array: (value) => Array.isArray(value),
  is_object: (value) => typeof value === "object" && !Array.isArray(value),
  is_string: (value) => typeof value === "string",
  is_date: (value) => !isNaN(Date.parse(value)),
  is_regex: (value) => value instanceof RegExp,
  is_function: (value) => typeof value === "function",
  is_primitive: (value) => (typeof value !== "object" && typeof value !== "function"),
  is_positive: (value) => value > 0,
  is_negative: (value) => value < 0,
  is_match: (regex, value) => regex.test(value),
  is_greater_than: (range, value) => value > range,
  is_less_than: (range, value) => value < range,
  is_min: (range, value) => value.length > range,
  is_max: (range, value) => value.length < range,
  is_between: (range, value) => {
    [min, max] = range.split(',');
    return value >= min && value <= max;
  },
  is_nullable: () => true,
};

