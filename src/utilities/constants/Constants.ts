import { Model } from "sequelize";
import { User } from "../../models/User";
import { Event } from "../../models/Event/Event";

// Define the user type for better type safety
export interface FacebookUserProfile {
  id: string;
  displayName: string;
  emails: { value: string }[];
}

export const Currency = {
  AED: "د.إ", // United Arab Emirates Dirham
  AFN: "؋", // Afghan Afghani
  ALL: "L", // Albanian Lek
  AMD: "֏", // Armenian Dram
  ANG: "ƒ", // Netherlands Antillean Guilder
  AOA: "Kz", // Angolan Kwanza
  ARS: "$", // Argentine Peso
  AUD: "$", // Australian Dollar
  AWG: "ƒ", // Aruban Florin
  AZN: "₼", // Azerbaijani Manat
  BAM: "KM", // Bosnia-Herzegovina Convertible Mark
  BBD: "$", // Barbadian Dollar
  BDT: "৳", // Bangladeshi Taka
  BGN: "лв", // Bulgarian Lev
  BHD: ".د.ب", // Bahraini Dinar
  BIF: "FBu", // Burundian Franc
  BMD: "$", // Bermudian Dollar
  BND: "$", // Brunei Dollar
  BOB: "Bs.", // Bolivian Boliviano
  BOV: "Mvdol", // Bolivian Mvdol
  BRL: "R$", // Brazilian Real
  BSD: "$", // Bahamian Dollar
  BTN: "Nu.", // Bhutanese Ngultrum
  BWP: "P", // Botswana Pula
  BYN: "Br", // Belarusian Ruble
  BZD: "$", // Belize Dollar
  CAD: "$", // Canadian Dollar
  CDF: "FC", // Congolese Franc
  CHE: "CHE", // WIR Euro
  CHF: "Fr.", // Swiss Franc
  CHW: "CHW", // WIR Franc
  CLF: "UF", // Chilean Unit of Account (UF)
  CLP: "$", // Chilean Peso
  CNY: "¥", // Chinese Yuan
  COP: "$", // Colombian Peso
  COU: "COU", // Unidad de Valor Real
  CRC: "₡", // Costa Rican Colón
  CUP: "₱", // Cuban Peso
  CVE: "$", // Cape Verdean Escudo
  CZK: "Kč", // Czech Koruna
  DJF: "Fdj", // Djiboutian Franc
  DKK: "kr.", // Danish Krone
  DOP: "$", // Dominican Peso
  DZD: "د.ج", // Algerian Dinar
  EGP: "£", // Egyptian Pound
  ERN: "Nfk", // Eritrean Nakfa
  ETB: "Br", // Ethiopian Birr
  EUR: "€", // Euro
  FJD: "$", // Fijian Dollar
  FKP: "£", // Falkland Islands Pound
  GBP: "£", // British Pound Sterling
  GEL: "₾", // Georgian Lari
  GHS: "₵", // Ghanaian Cedi
  GIP: "£", // Gibraltar Pound
  GMD: "D", // Gambian Dalasi
  GNF: "FG", // Guinean Franc
  GTQ: "Q", // Guatemalan Quetzal
  GYD: "$", // Guyanese Dollar
  HKD: "$", // Hong Kong Dollar
  HNL: "L", // Honduran Lempira
  HTG: "G", // Haitian Gourde
  HUF: "Ft", // Hungarian Forint
  IDR: "Rp", // Indonesian Rupiah
  ILS: "₪", // Israeli New Shekel
  INR: "₹", // Indian Rupee
  IQD: "ع.د", // Iraqi Dinar
  IRR: "﷼", // Iranian Rial
  ISK: "kr", // Icelandic Króna
  JMD: "$", // Jamaican Dollar
  JOD: "د.ا", // Jordanian Dinar
  JPY: "¥", // Japanese Yen
  KES: "KSh", // Kenyan Shilling
  KGS: "лв", // Kyrgyzstani Som
  KHR: "៛", // Cambodian Riel
  KMF: "CF", // Comorian Franc
  KPW: "₩", // North Korean Won
  KRW: "₩", // South Korean Won
  KWD: "د.ك", // Kuwaiti Dinar
  KYD: "$", // Cayman Islands Dollar
  KZT: "₸", // Kazakhstani Tenge
  LAK: "₭", // Lao Kip
  LBP: "ل.ل", // Lebanese Pound
  LKR: "Rs", // Sri Lankan Rupee
  LRD: "$", // Liberian Dollar
  LSL: "L", // Lesotho Loti
  LYD: "ل.د", // Libyan Dinar
  MAD: "د.م.", // Moroccan Dirham
  MDL: "L", // Moldovan Leu
  MGA: "Ar", // Malagasy Ariary
  MKD: "ден", // Macedonian Denar
  MMK: "K", // Myanmar Kyat
  MNT: "₮", // Mongolian Tugrik
  MOP: "MOP$", // Macanese Pataca
  MRU: "UM", // Mauritanian Ouguiya
  MUR: "₨", // Mauritian Rupee
  MVR: "ރ.", // Maldivian Rufiyaa
  MWK: "MK", // Malawian Kwacha
  MXN: "$", // Mexican Peso
  MYR: "RM", // Malaysian Ringgit
  MZN: "MT", // Mozambican Metical
  NAD: "$", // Namibian Dollar
  NGN: "₦", // Nigerian Naira
  NIO: "C$", // Nicaraguan Córdoba
  NOK: "kr", // Norwegian Krone
  NPR: "₨", // Nepalese Rupee
  NZD: "$", // New Zealand Dollar
  OMR: "ر.ع.", // Omani Rial
  PAB: "B/.", // Panamanian Balboa
  PEN: "S/.", // Peruvian Sol
  PGK: "K", // Papua New Guinean Kina
  PHP: "₱", // Philippine Peso
  PKR: "₨", // Pakistani Rupee
  PLN: "zł", // Polish Złoty
  PYG: "₲", // Paraguayan Guaraní
  QAR: "ر.ق", // Qatari Riyal
  RON: "lei", // Romanian Leu
  RSD: "дин.", // Serbian Dinar
  RUB: "₽", // Russian Ruble
  RWF: "FRw", // Rwandan Franc
  SAR: "﷼", // Saudi Riyal
  SBD: "$", // Solomon Islands Dollar
  SCR: "₨", // Seychellois Rupee
  SDG: "£", // Sudanese Pound
  SEK: "kr", // Swedish Krona
  SGD: "$", // Singapore Dollar
  SHP: "£", // Saint Helena Pound
  SLE: "Le", // Sierra Leonean Leone
  SOS: "Sh", // Somali Shilling
  SRD: "$", // Surinamese Dollar
  SSP: "£", // South Sudanese Pound
  STN: "Db", // São Tomé and Príncipe Dobra
  SVC: "$", // Salvadoran Colón
  SYP: "£", // Syrian Pound
  SZL: "L", // Swazi Lilangeni
  THB: "฿", // Thai Baht
  TJS: "ЅМ", // Tajikistani Somoni
  TMT: "T", // Turkmenistani Manat
  TND: "د.ت", // Tunisian Dinar
  TOP: "T$", // Tongan Paʻanga
  TRY: "₺", // Turkish Lira
  TTD: "$", // Trinidad and Tobago Dollar
  TWD: "NT$", // New Taiwan Dollar
  TZS: "Sh", // Tanzanian Shilling
  UAH: "₴", // Ukrainian Hryvnia
  UGX: "Sh", // Ugandan Shilling
  USD: "$", // United States Dollar
  UYU: "$U", // Uruguayan Peso
  UZS: "лв", // Uzbekistani Som
  VES: "Bs.", // Venezuelan Bolívar
  VND: "₫", // Vietnamese Dong
  VUV: "VT", // Vanuatu Vatu
  WST: "T", // Samoan Tala
  XAF: "FCFA", // Central African CFA Franc
  XCD: "$", // East Caribbean Dollar
  XOF: "CFA", // West African CFA Franc
  XPF: "₣", // CFP Franc
  YER: "﷼", // Yemeni Rial
  ZAR: "R", // South African Rand
  ZMW: "ZK", // Zambian Kwacha
  ZWL: "Z$", // Zimbabwean Dollar
};

export const FeatureValueType = {
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  BOOLEAN: "BOOLEAN",
  JSON: "JSON",
  STRING: "STRING",
};

export const ListingStatus = {
  AVAILABLE: "Available",
  NOT_AVAILABLE: "Not Available",
  PENDING: "Pending",
  SOLD: "Sold",
  UNDER_CONTRACT: "Under Contract",
};

export const listingMethod = {
  MANUAL: "Manual",
  EXTERNAL: "External",
  WEBSITE: "Website",
  BULK: "Bulk",
};

export const LeadSource = {
  SEARCH_RESULT: "Search Result",
  EMAIL_CAMPAIGN: "Email Campaign",
  SOCIAL_MEDIA: "Social Media",
  FEATURED_LISTING: "Featured Listing",
};

export const LeadInqueryStatus = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  VIEWING_SCHEDULED: "Viewing Scheduled",
  OFFER_MADE: "Offer Made",
  CLOSED: "Closed",
};

export const AccessType = {
  SYSTEM: "System",
  ADMIN: "Admin",
  BROKER: "Broker",
  USER: "User",
  BUYER: "Buyer",
  RENTER: "Renter",
  PROPERTY_MANAGER: "Property Manager",
  PROPERTY_OWNER: "Property Owner",
  AGENT: "Agent",
  OTHER: "Other",
};

export const QuestionType = {
  BOOLEAN: "Boolean",
  MULTIPLE_CHOICE: "Multiple Choice",
};

export const UserType = {
  SYSTEM: "System",
  ADMIN: "Admin",
  BROKER: "Broker",
  USER: "User",
  BUYER: "Buyer",
  RENTER: "Renter",
  PROPERTY_MANAGER: "Property Manager",
  PROPERTY_OWNER: "Property Owner",
  AGENT: "Agent",
  OTHER: "Other",
};

export const UserNotificationStatus = {
  L1: "L1",
  L2: "L2",
  L3: "L3",
  L4: "L4",
  L5: "L5",
  OFF: "Off",
};

export const ConfigType = {
  BOOLEAN: "Boolean",
  INTEGER: "Integer",
  DOUBLE: "Double",
  STRING: "String",
};

export const LogActions = {
  INIT: "Init",
  CREATE: "Create",
  UPDATE: "Update",
  SOFT_DELETE: "Soft Delete",
  HARD_DELETE: "Hard Delete",
  RESTORE: "Restore",
  FAILURE: "Failure",
  FETCH: "Fetch",
};

export const LogTypes = {
  REQUEST: "Request",
  ERROR: "Error",
  ACTION: "Action",
  INFO: "Info",
};

export const UserStatus = {
  PENDING: "Pending",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  BLOCKED: "Blocked",
  ARCHIVED: "Archived",
};
export const UserEligibilityStatus = {
  ELIGIBLE: "Eligilbe",
  INELIGIBLE: "Ineligible",
};

export const UserResidencyStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const ScrapedListingStatus = {
  UNCHANGED: "Unchanged",
  CHANGED: "Changed",
  APPLIED: "Applied",
  IGNORED: "Ignored",
};

export const ScrapingTargetStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PAUSED: "Paused",
};

export const ScrapingResultStatus = {
  IN_PROGRESS: "In Progress",
  FAILED: "Failed",
  SUCCESS: "Success",
};

export const ScrapingAgentStatus = {
  QUEUED: "Queued",
  SUCCESS: "Success",
  ERROR: "Error",
  PAUSED: "Paused",
};

export const ScrapingFrequency = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

export const ListingSourceStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const ListingSourceGroupConfigType = {
  LISTING: "Listing",
  SITE: "Site",
};

export const SubscriptionPlan = {
  BASIC: "Basic",
  PRO: "Pro",
  PRO10: "Pro-10",
  PRO50: "Pro-50",
};

export const BillingCycle = {
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export const SubscriptionStatus = {
  ACTIVE: "active",
  CANCELED: "canceled",
  EXPIRED: "expired",
  PAUSED: "paused",
  PENDING: "pending",
};

export const PaymentMethod = {
  STRIPE: "Stripe",
  PAYPAL: "PayPal",
};

export const AffiliateType = {
  PROMO: "promo_code",
  INVITE: "invite",
};

export const CommissionStatus = {
  PENDING: "pending",
  ONGOING: "ongoing",
  STOPPED: "stopped",
};

export const StripeAccountType = {
  CUSTOM: "custom",
  STANDARD: "standard",
  EXPRESS: "express",
};

export const NotificationType = {
  INFO: "Info",
  WARNING: "Warning",
  SUCCESS: "Success",
  ALERT: "Alert",
};

export const NotificationCategory = {
  INFO: "Info",
  SUBSCRIPTION: "Subscription",
  AFFILIATE: "Affiliate",
  WARNING: "Warning",
  LISTING: "Listing",
};

export const RefundStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const PaymentStatus = {
  PAID: "paid",
  UNPAID: "unpaid",
  FAILED: "failed",
};

export const RefundStatusStripe = {
  NOT_REQUESTED: "not_requested",
  REQUESTED: "requested",
  PROCESSED: "processed",
};

export const EmailType = {
  SUBSCRIPTION_CANCELLED: "subscriptionCanceled",
  SUBSCRIPTION_CREATED: "subscriptionCreated",
  SUBSCRIPTION_UPGRADE: "autoUpgrade",
  SUBSCRIPTION_DOWNGRADE: "autoDowngrade",
  PASSWORD_RECOVERY: "passwordRecovery",
  EMAIL_VERIFICATION: "verification",
  SUBSCRIPTION_EXPIRING: "expiring",
  SUBSCRIPTION_EXPIRED: "expired",
  SUBSCRIPTION_RENEWED: "renewed",
  PAYOUT_APPROVED: "payoutApproved",
  PAYOUT_REJECTED: "payoutRejected",
  REFUND_APPROVED: "refundApproved"
}

export type EmailTypeValues = (typeof EmailType)[keyof typeof EmailType];

export const AffiliatePayoutStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
};

export const SubscriptionCancellationReasons = {
  TOO_EXPENSIVE: "Too expensive",
  NOT_USING_ENOUGH: "Not using the service enough",
  MISSING_FEATURES: "Missing features",
  OTHER_REASON: "Other reason",
  FOUND_ALTERNATIVE: "Found alternative",
  TECHNICAL_ISSUES: "Technical issues",
};

export type SubscriptionCancellationReason =
  (typeof SubscriptionCancellationReasons)[keyof typeof SubscriptionCancellationReasons];


[
  "Too expensive",
  "Not using the service enough",
  "Missing features",
  "Other reason",
  "Found alternative",
  "Technical issues",
];

export const ConfigNames = {
  COMMISSION_RULE: "commission_rule",
  SHARE_PERCENTAGE: "share_percentage",
  HEALTH_STATUS: "Health Status",
  PAYOUT_TRESHOLD: "payout_threshold",
  CANCELLATION_REASONS: "cancellation_reasons"
}

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other"
}

export const PayoutStatus = {
  UNPAID: "unpaid",
  PENDING: "pending",
  PAID: "paid"
}

export const EngagementMetricsType = {
  IMPRESSION: "impression",
  VIEW: "view"
};

export const PREFERRED_CONTACT_METHOD = {
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  PHONE_CALL: "Phone Call",
  SMS: "SMS",
  NO_PREFERENCE: "No Preference"
}

export const PasswordMessage =
  "Password must be at least 8 and at most 16 characters and must contain at least one lower case, one upper case, one special character and one number";
export const PasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,16}$/;
export const PhoneNumberRegex = /^\+[1-9]\d{1,14}$/;
export const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const LatitudeValueRegex = /^(\+|-)?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
export const LongtudeValueRegex =
  /^(\+|-)?(180(\.0+)?|1?[0-7]?\d(\.\d+)?|\d{1,2}(\.\d+)?)$/;
export const WebsiteUrlRegex =
  /^https:\/\/(www\.)?[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*([/?#][\w-.~!*'();:@&=+$,/?%#[\]]*)*$/;

  export const Sponsorship_Error_Messages = {
    SPONSORSHIP_ACCESS_DENIED: "Access denied. Only the sponsorship owner can view this content.",
    LISTING_NOT_SPONSORED: "This listing does not have an active sponsorship.",
    SPONSORSHIP_ANALYTICS_RESTRICTED: "Analytics are only available for sponsored listings.",
  };
  

const ModelType: Map<string, typeof Model> = new Map<string, typeof Model>();


ModelType.set("user", User);
ModelType.set("event", Event);

export { ModelType };

export const SponsorshipStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELED: "CANCELED",
  PAUSED: "PAUSED"
}

export enum SponsoredListingStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum AdminApproval {
  PENDING = "Pending",
  REJECTED = "Rejected",
  APPROVED = "Approved"
}

export enum SponsorshipTier {
  PRO = "PRO",
  PRO10 = "PRO10",
  PRO50 = "PRO50"
}

export const SponsorshipPricing = {
  [SponsorshipTier.PRO]: 9.99,
  [SponsorshipTier.PRO10]: 7.99,
  [SponsorshipTier.PRO50]: 5.99
};
