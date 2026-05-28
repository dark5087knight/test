// Text utilities for TextLab

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

export function toSentenceCase(str) {
  // Capitalizes the first letter of each sentence
  return str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

export function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function toSnakeCase(str) {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function toKebabCase(str) {
  return str
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toAlternatingCase(str) {
  return str
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join('');
}

export function toInverseCase(str) {
  return str
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) return char.toLowerCase();
      return char.toUpperCase();
    })
    .join('');
}

export function removeExtraSpaces(str) {
  return str.replace(/\s+/g, ' ').trim();
}

export function removeLineBreaks(str) {
  return str.replace(/[\r\n]+/g, ' ');
}

export function stripHtml(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
}

export function removeDuplicates(str) {
  const lines = str.split(/\r?\n/);
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join('\n');
}

export function removeEmptyLines(str) {
  return str
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n');
}

export function trimLines(str) {
  return str
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n');
}

export function base64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return 'Error: Invalid characters for Base64 encoding';
  }
}

export function base64Decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return 'Error: Invalid Base64 string';
  }
}

export function urlEncode(str) {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    return 'Error: URL encoding failed';
  }
}

export function urlDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return 'Error: URL decoding failed';
  }
}

export function htmlEncode(str) {
  return str.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`);
}

export function htmlDecode(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent || '';
}

export function toBinary(str) {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export function fromBinary(str) {
  try {
    const cleanStr = str.replace(/\s+/g, '');
    if (cleanStr.length % 8 !== 0) return 'Error: Binary string length must be a multiple of 8';
    const bytes = cleanStr.match(/.{1,8}/g) || [];
    return bytes.map((byte) => String.fromCharCode(parseInt(byte, 2))).join('');
  } catch (e) {
    return 'Error: Invalid binary input';
  }
}

export function toHex(str) {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}

export function fromHex(str) {
  try {
    const cleanStr = str.replace(/\s+/g, '');
    if (cleanStr.length % 2 !== 0) return 'Error: Hex string length must be a multiple of 2';
    const bytes = cleanStr.match(/.{1,2}/g) || [];
    return bytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('');
  } catch (e) {
    return 'Error: Invalid hex input';
  }
}

export function formatJson(str, spacing = 2) {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, spacing);
  } catch (e) {
    return `Error: Invalid JSON - ${e.message}`;
  }
}

export function generateLoremIpsum(type, count) {
  const wordsList = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
    'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
    'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
    'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
    'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
    'est', 'laborum'
  ];

  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Morbi elementum, urna vel convallis condimentum, sem ipsum gravida justo, nec tempor felis dolor a diam.',
    'Praesent varius purus a lectus tempus rhoncus.',
    'Sed luctus imperdiet lacus, et pretium nisl dignissim sit amet.',
    'Donec eleifend egestas magna, at dictum lorem accumsan eget.',
    'Sed cursus pretium nibh id sodales.'
  ];

  if (type === 'words') {
    let words = [];
    for (let i = 0; i < count; i++) {
      words.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    return words.join(' ');
  } else if (type === 'sentences') {
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(sentences[Math.floor(Math.random() * sentences.length)]);
    }
    return result.join(' ');
  } else {
    // paragraphs
    let paragraphs = [];
    for (let p = 0; p < count; p++) {
      let pSentences = [];
      const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences
      for (let s = 0; s < sentenceCount; s++) {
        pSentences.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      paragraphs.push(pSentences.join(' '));
    }
    return paragraphs.join('\n\n');
  }
}

export function generatePassword(length = 16, { upper = true, lower = true, numbers = true, symbols = true } = {}) {
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-+=';

  let pool = '';
  if (upper) pool += uppers;
  if (lower) pool += lowers;
  if (numbers) pool += nums;
  if (symbols) pool += syms;

  if (!pool) return 'Select at least one character type';

  let password = '';
  // Guarantee at least one of each selected type
  if (upper) password += uppers[Math.floor(Math.random() * uppers.length)];
  if (lower) password += lowers[Math.floor(Math.random() * lowers.length)];
  if (numbers) password += nums[Math.floor(Math.random() * nums.length)];
  if (symbols) password += syms[Math.floor(Math.random() * syms.length)];

  while (password.length < length) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

export function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDiff(original, modified) {
  const origLines = original.split(/\r?\n/);
  const modLines = modified.split(/\r?\n/);
  const diffs = [];
  
  let i = 0, j = 0;
  while (i < origLines.length || j < modLines.length) {
    if (i < origLines.length && j < modLines.length) {
      if (origLines[i] === modLines[j]) {
        diffs.push({ type: 'unchanged', text: origLines[i] });
        i++;
        j++;
      } else {
        // Look ahead to see if there's a match
        let found = false;
        for (let k = 1; k <= 5; k++) {
          if (i + k < origLines.length && origLines[i + k] === modLines[j]) {
            // Lines were deleted
            for (let l = 0; l < k; l++) {
              diffs.push({ type: 'deleted', text: origLines[i + l] });
            }
            i += k;
            found = true;
            break;
          }
          if (j + k < modLines.length && origLines[i] === modLines[j + k]) {
            // Lines were added
            for (let l = 0; l < k; l++) {
              diffs.push({ type: 'added', text: modLines[j + l] });
            }
            j += k;
            found = true;
            break;
          }
        }
        if (!found) {
          diffs.push({ type: 'deleted', text: origLines[i] });
          diffs.push({ type: 'added', text: modLines[j] });
          i++;
          j++;
        }
      }
    } else if (i < origLines.length) {
      diffs.push({ type: 'deleted', text: origLines[i] });
      i++;
    } else if (j < modLines.length) {
      diffs.push({ type: 'added', text: modLines[j] });
      j++;
    }
  }
  return diffs;
}

