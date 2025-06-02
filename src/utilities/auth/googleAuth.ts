import { env } from "../../config";
import axios from "axios";
import jwt from "jsonwebtoken";
import { importJWK } from "jose";

let cachedGoogleKeys: any = null;
let cachedGoogleKeysExpiration = 0;

// Helper function to fetch Google's public keys
const getGooglePublicKeys = async () => {
  const currentTime = Date.now() / 1000;

  if (cachedGoogleKeys && currentTime < cachedGoogleKeysExpiration) {
    return cachedGoogleKeys;
  }

  const response = await axios.get(env.GOOGLE_CERTS_URL);
  if (response.status !== 200) {
    throw new Error("Unable to fetch Google public keys");
  }

  cachedGoogleKeys = response.data;
  cachedGoogleKeysExpiration = currentTime + 3600; // Cache for 1 hour
  return cachedGoogleKeys;
};

// Function to import the JWK and return a usable key object
const getKeyObject = async (key: {
  kty: string;
  n: string;
  e: string;
}): Promise<any> => {
  if (!key || key.kty !== "RSA") {
    throw new Error("Invalid JWK key. Expected RSA key.");
  }

  // Convert JWK to a usable key object using the jose library
  const keyObject = await importJWK(
    {
      kty: key.kty,
      n: key.n,
      e: key.e,
    },
    "RS256"
  ); // Specify the algorithm (RS256) during import

  return keyObject;
};

export const verifyCode = (code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const unverifiedHeader = jwt.decode(code, { complete: true })?.header;
      if (unverifiedHeader) {
        const kid = unverifiedHeader.kid;
        getGooglePublicKeys()
          .then(async (publicKeys) => {
            if (publicKeys) {
              const key = publicKeys.keys.find((k: any) => k.kid === kid);

              if (!key) {
                throw new Error("Invalid token: No kid found");
              }

              const key_object = await getKeyObject(key);
              
              resolve(jwt.verify(code, key_object, {
                algorithms: ["RS256"],
                audience: env.GOOGLE_CLIENT_ID,
                issuer: "https://accounts.google.com",
              }));
            }
            throw new Error("Failed to verify code (1008)");
          })
          .catch((e) => reject(e));
      } else {
        throw new Error("Failed to verify code (1009)");
      }
    } catch (e) {
      console.log("Error", e);
      reject(e);
    }
  });
};
