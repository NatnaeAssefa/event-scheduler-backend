import { AccessType, UserType } from "../utilities/constants/Constants";

export const DB_TYPES = {
  MYSQL: "mysql",
  POSTGRES: "postgres",
};

const getDBType = (type?: string) => {
  if (type) {
    if (Object.values(DB_TYPES).indexOf(type) !== -1) return type;
  }
  return DB_TYPES.POSTGRES;
};

export const env: any = {
  // Database
  DB_TYPE: getDBType(process.env.DB_TYPE),
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || "5432",
  DB_NAME: process.env.DB_NAME || "test",
  DB_USERNAME: process.env.DB_USERNAME || "test",
  DB_PASSWORD: process.env.DB_PASSWORD || "test",

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",

  // Auth
  AUTH_KEY: process.env.AUTH_KEY || "sample_key",

  AUTH_KEY_EXPIRY: process.env.AUTH_KEY_EXPIRY || "6h",

  // Server
  PORT: process.env.PORT || 3000,
  PRODUCTION: process.env.PRODUCTION === "true",

  // Swagger
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED === "true",

  // Email
  SMTP_HOST: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  SMTP_PORT: process.env.SMTP_PORT || "587",
  SMTP_USER: process.env.SMTP_USER || "test",
  SMTP_PASS: process.env.SMTP_PASS || "password",

  // System
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
  VERIFICATION_EXPIRY: process.env.VERIFICATION_EXPIRY || 24, // Hours
  RECOVERY_EXPIRY: process.env.RECOVERY_EXPIRY || 24, // Hours

  // Company
  COMPANY_NAME: process.env.COMPANY_NAME || "Boingo AI",
  COMPANY_EMAIL: process.env.SMTP_USER || "support@boingo.ai",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@boingo.ai",

  ROOT_DIR: "",

  GOOGLE_CERTS_URL: process.env.GOOGLE_CERTS_URL || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_AUTH_URL: process.env.GOOGLE_AUTH_URL || "",
  GOOGLE_TOKEN_URL: process.env.GOOGLE_TOKEN_URL || "",
  GOOGLE_USER_INFO_URL: process.env.GOOGLE_USER_INFO_URL || "",

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || "",
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || "",

  WATER_MARK_IMAGE: process.env.WATER_MARK_IMAGE || "",
  WATER_MARK_IMAGE_DARK: process.env.WATER_MARK_IMAGE_DARK || "",

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_SECRET_KEY_TEST_MODE: process.env.STRIPE_SECRET_KEY_TEST_MODE || "",
  RESIDENCY_STRIPE_PRICE_ID: process.env.RESIDENCY_STRIPE_PRICE_ID || "",
  CONSULTATION_STRIPE_PRICE_ID: process.env.CONSULTATION_STRIPE_PRICE_ID || "",
  BASE_URL: process.env.BASE_URL || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  WEBSITE_BASE_URL: process.env.WEBSITE_BASE_URL || "",
  STRIPE_GRADUATED_PRODUCT_PRICE_ID: process.env.STRIPE_GRADUATED_PRODUCT_PRICE_ID || "",

  CALENDLY_RESIDENCY_LINK: process.env.CALENDLY_RESIDENCY_LINK || "",
  CALENDLY_CONSULTATION_LINK: process.env.CALENDLY_CONSULTATION_LINK || "",
  CALENDLY_API_KEY: process.env.CALENDLY_API_KEY || "",

  // Opean AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
};
export const constants: any = {
  SYSTEM_CONFIG_KEY: "System Init",
  SYSTEM_CONFIG_TYPE: "string",
  SYSTEM_CONFIG_VALUE: "True",
  BASE_FIRST_NAME: "Boingo",
  BASE_LAST_NAME: "Super Admin",
  BASE_PHONE_NUMBER: "251930538714",
  BASE_ROLE: "Super Admin",
  BASE_ROLE_ID: "e48f7ed1-db16-4511-be6a-87ef32aab99d",
  DEFAULT_USER_ID: "e48f7ed1-db16-4611-be3a-87ef32aab99d",
  BASE_TYPE: UserType.SYSTEM,
  BASE_EMAIL: "boingoaisuperadmin@gmail.com",
  BASE_PASSWORD: "1q2w3e4sr5t6ey7u8i9o0p",

  BROKER_ROLE: "Broker Role",
  USER_ROLE: "User Role",

  SUPER_ADMIN_ROLE_ID: "e48f7ed1-db16-4511-be6a-87ef32aab99d",
  ADMIN_ROLE_ID: "8edbc138-affb-476f-8917-0d5b66e26a50"
};

export type AccessRules = {
  group: string;
  rules: { name: string; type: string }[];
};

export const access_rules: AccessRules[] = [
  //  System
  {
    group: "Global",
    rules: [{ name: "access_paranoid", type: AccessType.SYSTEM }],
  },
  {
    group: "Access Log",
    rules: [
      { name: "read_action_log", type: AccessType.SYSTEM },
      { name: "write_action_log", type: AccessType.SYSTEM },
      { name: "delete_action_log", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Config",
    rules: [
      { name: "read_config", type: AccessType.SYSTEM },
      { name: "write_config", type: AccessType.SYSTEM },
      { name: "delete_config", type: AccessType.SYSTEM },
    ],
  },
  // Shared
  {
    group: "File",
    rules: [
      { name: "read_file", type: AccessType.BROKER },
      { name: "write_file", type: AccessType.BROKER },
      { name: "delete_file", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Access Rule",
    rules: [
      { name: "read_access_rule", type: AccessType.BROKER },
      { name: "write_access_rule", type: AccessType.SYSTEM },
      { name: "delete_access_rule", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Role",
    rules: [
      { name: "read_role", type: AccessType.BROKER },
      { name: "write_role", type: AccessType.BROKER },
      { name: "delete_role", type: AccessType.BROKER },
    ],
  },
  {
    group: "User",
    rules: [
      { name: "read_user", type: AccessType.BROKER },
      { name: "revoke_user_token", type: AccessType.SYSTEM },
      { name: "change_user_password", type: AccessType.SYSTEM },
      { name: "write_user", type: AccessType.BROKER },
      { name: "delete_user", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Refund",
    rules: [
      { name: "read_refund", type: AccessType.BROKER },
      { name: "write_refund", type: AccessType.BROKER },
      { name: "delete_refund", type: AccessType.SYSTEM },
      { name: "approve_refund", type: AccessType.SYSTEM },
      { name: "reject_refund", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Payout",
    rules: [
      { name: "read_payout", type: AccessType.BROKER },
      { name: "write_payout", type: AccessType.BROKER },
      { name: "delete_payout", type: AccessType.SYSTEM },
      { name: "approve_payout", type: AccessType.SYSTEM },
      { name: "reject_payout", type: AccessType.SYSTEM },
    ],
  },
  {
    group: "Listing Favorite",
    rules: [
      { name: "delete_listing_favorite", type: AccessType.BROKER },
      { name: "write_listing_favorite", type: AccessType.BROKER },
      { name: "read_listing_favorite", type: AccessType.BROKER }
    ]
  },
  {
    group: "Listing",
    rules: [
      { name: "write_listing", type: AccessType.BROKER },
      { name: "write_listing", type: AccessType.SYSTEM }
    ]
  }
];

export default { env, constants, access_rules };
