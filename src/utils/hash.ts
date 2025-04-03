import { createHash } from "crypto";

export const createMd5Hash = (inputString: string): string => {
  return createHash("md5").update(inputString).digest("hex");
};

export function md5(input: string): string {
  // Convert string to UTF-8 bytes
  function strToUtf8Bytes(str: string): number[] {
    const utf8 = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < utf8.length; i++) {
      bytes.push(utf8.charCodeAt(i));
    }
    return bytes;
  }

  // Convert number to little-endian hex string
  function numToHexLe(num: number): string {
    let hex = "";
    for (let i = 0; i < 4; i++) {
      const byte = (num >>> (i * 8)) & 0xff;
      hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
  }

  const msg = strToUtf8Bytes(input);
  const len = msg.length;

  // Append padding
  const padded = [...msg];
  padded.push(0x80);
  while (padded.length % 64 !== 56) {
    padded.push(0x00);
  }

  // Append length in bits as 64-bit little-endian
  const totalLengthBits = len * 8;
  let lo = totalLengthBits >>> 0;
  let hi = (totalLengthBits / 0x100000000) >>> 0;

  for (let i = 0; i < 4; i++) {
    padded.push(lo & 0xff);
    lo >>>= 8;
  }
  for (let i = 0; i < 4; i++) {
    padded.push(hi & 0xff);
    hi >>>= 8;
  }

  // Initialize state variables
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  // Constants
  const T = new Array(64);
  for (let i = 0; i < 64; i++) {
    T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
    9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
    16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
    15, 21,
  ];

  // Process each 64-byte block
  for (let i = 0; i < padded.length; i += 64) {
    const block = padded.slice(i, i + 64);
    const M = new Array(16);

    // Convert bytes to 32-bit words
    for (let j = 0; j < 16; j++) {
      const offset = j * 4;
      M[j] =
        (block[offset] |
          (block[offset + 1] << 8) |
          (block[offset + 2] << 16) |
          (block[offset + 3] << 24)) >>>
        0;
    }

    let [A, B, C, D] = [a, b, c, d];

    for (let i = 0; i < 64; i++) {
      let F, g;

      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = F >>> 0;

      // Update F with parameters
      F = (F + A + T[i] + M[g]) >>> 0;
      const shifted = ((F << s[i]) | (F >>> (32 - s[i]))) >>> 0;
      const newB = (B + shifted) >>> 0;

      // Rotate variables
      [A, B, C, D] = [D, newB, B, C];
    }

    // Update state variables
    a = (a + A) >>> 0;
    b = (b + B) >>> 0;
    c = (c + C) >>> 0;
    d = (d + D) >>> 0;
  }

  // Combine state variables and return as hex string
  return numToHexLe(a) + numToHexLe(b) + numToHexLe(c) + numToHexLe(d);
}
