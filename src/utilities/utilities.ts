import crypto from "crypto";
import { isValid, parse } from "date-fns";
import { Op, Sequelize } from "sequelize";
import { Affiliate, AffiliateRegistry, Commission, StripeTransaction, SubscriptionType } from "../models/Affiliate";
import { ConfigNames, EmailType, NotificationType, NotificationCategory, SubscriptionPlan, SubscriptionStatus } from "./constants/Constants";
import { User } from "../models/User";
import LogService from "../services/Log/Log.service";
import { NotificationService } from "../services/System";
import { env } from "../config";
import { ConfigDAL } from "../dals/System";
import { SubscriptionService, SubscriptionPerListingService, CommissionService, SubscriptionTypeService } from "../services/Affiliate";
import { Sponsorship } from "../models/Sponsorship";
import { SponsorshipItemService } from "../services/Sponsorship";

export function generateRandomCode(length = 6) {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
}

export function getTripRoom(trip_id: string) {
  return `TripRoom_${trip_id}`
}


export function generateAffiliateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // 8-character random code
}

// Helper function to add a table to the PDF
export function addStyledTable(doc: PDFKit.PDFDocument, headers: string[], rows: (string | number)[][]) {
  const startX = 50;
  let y = doc.y + 20;

  doc.fontSize(12).font('Helvetica-Bold');

  const colWidths = [200, 150, 150];

  headers.forEach((header, i) => {
    doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
  });

  y += 25;
  doc.font('Helvetica');

  rows.forEach((row) => {
    row.forEach((cell, i) => {
      doc.text(cell.toString(), startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
    });
    y += 20;
  });
}

export function parseDate(dateString: string): Date | undefined {
  const formats = ['dd MM yyyy', 'dd MMMM yyyy'];
  for (const format of formats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) return parsedDate;
  }
  return undefined;
}

export async function getTotalRevenueByDate(fromDate?: Date, toDate?: Date): Promise<number> {
  try {
    const dateFilter: any = {};
    if (fromDate) dateFilter[Op.gte] = fromDate;
    if (toDate) dateFilter[Op.lte] = toDate;

    const result = (await StripeTransaction.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount_paid")), "totalRevenue"],
      ],
      where: fromDate || toDate ? { createdAt: dateFilter } : {},
      raw: true,
    })) as { totalRevenue?: string };

    return result?.totalRevenue ? parseFloat(result.totalRevenue) : 0;
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw new Error("Failed to calculate total revenue");
  }
}

export async function getTotalCommissionByDate(fromDate?: Date, toDate?: Date): Promise<number> {
  try {
    const dateFilter: any = {};
    if (fromDate) dateFilter[Op.gte] = fromDate;
    if (toDate) dateFilter[Op.lte] = toDate;

    const result = (await Commission.findOne({
      attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "totalCommission"]],
      where: fromDate || toDate ? { createdAt: dateFilter } : {},
      raw: true,
    })) as { totalCommission?: string };

    return result?.totalCommission ? parseFloat(result.totalCommission) : 0;
  } catch (error) {
    console.error("Error calculating total commission:", error);
    throw new Error("Failed to calculate total commission");
  }
}

export async function calculateCost(listings: number): Promise<number> {
  const subscriptionTypes = await SubscriptionType.findAll({
    where: {
      name: [
        SubscriptionPlan.PRO,
        SubscriptionPlan.PRO10,
        SubscriptionPlan.PRO50,
      ],
    },
  });

  // Create a map for easy access
  const planMap = new Map(
    subscriptionTypes.map((plan) => [plan.name, parseFloat(plan.price)])
  );

  // Set default prices if not found in DB
  const proPrice = planMap.get(SubscriptionPlan.PRO) ?? 9.99;
  const pro10Price = planMap.get(SubscriptionPlan.PRO10) ?? 7.99;
  const pro50Price = planMap.get(SubscriptionPlan.PRO50) ?? 5.99;

  if (listings <= 9) {
    return listings * proPrice;
  } else if (listings <= 49) {
    return 9 * proPrice + (listings - 9) * pro10Price;
  } else {
    return 9 * proPrice + 40 * pro10Price + (listings - 49) * pro50Price;
  }
}

export async function calculateAndShareCommission(user: User, sponsorship: Sponsorship, end_date: Date, total_price_on_renewal: string) {
  try {
    if (!sponsorship) {
      return {
        status_code: 404,
        data: null,
        message: "Sponsorship not found",
        date: new Date(),
        error: "Sponsorship not found"
      };
    }

    const commission_rule = await ConfigDAL.findOne({ where: { key: ConfigNames.COMMISSION_RULE } });
    const listingTypeIds: string[] = commission_rule ? JSON.parse(commission_rule.value) : ["c878f868-c4b8-45c1-bfd3-eb6f388463e0", "3b1c8d68-a166-4221-a694-2eb41110f5ce"]
    const share_percentage = await ConfigDAL.findOne({ where: { key: ConfigNames.SHARE_PERCENTAGE } });
    const commissionRate = share_percentage ? parseFloat(share_percentage.value) : 0.8; // Default 10% if not set


    const affiliateRegistry = await AffiliateRegistry.findOne({
      where: { user_id: user.id },
    });

    if (!affiliateRegistry) {
      LogService.LogInfo("No affiliate registry!, No Commission!")
      return {
        status_code: 404,
        data: null,
        message: "Affiliate registry not found",
        date: new Date(),
        error: "Affiliate registry not found"
      };
    }

    const affiliate = await Affiliate.findByPk(affiliateRegistry.affiliate_id);
    if (!affiliate) {
      LogService.LogInfo("No Affiliate!, No Commission!")
      return {
        status_code: 404,
        data: null,
        message: "Affiliate not found",
        date: new Date(),
        error: "Affiliate not found"
      };
    }

    // Step 2: Ensure the affiliate has an active subscription
    const activeSubscription = await SubscriptionService.findOne(user, {
      where: { user_id: affiliate.user_id, status: SubscriptionStatus.ACTIVE },
    });
    if (!activeSubscription) {
      LogService.LogInfo("No active subscription!, No Commission!")
      return {
        status_code: 404,
        data: null,
        message: "No active subscription found for the affiliate.",
        date: new Date(),
        error: "No active subscription found for the affiliate."
      };
    }

    // Step 3: Fetch all rental listings linked to this subscription (without filtering by listingTypeIds)
    const sponsorshipPerListings = await SponsorshipItemService.findMany(user, {
      where: {
        sponsorship_id: sponsorship.id,
      },
      order: [["createdAt", "ASC"]], // Sort listings by date (oldest first)
    });

    if (!sponsorshipPerListings) {
      return {
        status_code: 404,
        data: null,
        message: "No subscription per listing found for the referral.",
        date: new Date(),
        error: "No subscription per listing found for the referral."
      };
    }

    // Fetch subscription prices from DB
    const subscriptionTypes = await SubscriptionType.findAll({
      where: { name: [SubscriptionPlan.PRO, SubscriptionPlan.PRO10, SubscriptionPlan.PRO50] }
    });

    // Create a price map from subscription plans
    const planMap = new Map(subscriptionTypes.map(plan => [plan.id, parseFloat(plan.price)]));

    let totalCommissionAmount = 0;
    let totalPrice = 0

    // Step 5: Loop through listings and calculate commission **only for matching listingTypeIds**
    sponsorshipPerListings.rows.forEach((listing, idx) => {

      const planPrice = planMap.get(sponsorship.subscription_type_id);

      totalPrice += planPrice!
    });
    totalCommissionAmount = totalPrice * commissionRate;

    // Step 6: Update commission record
    const commission = await CommissionService.findOne(user, { where: { affiliate_id: affiliate.id } });
    if (commission) {
      const updatedCommission = await CommissionService.update(user, commission.id, {
        amount: commission.amount + totalCommissionAmount,
      } as any);

      LogService.LogInfo(`Commission updated for ${affiliate.id}: $${totalCommissionAmount}`);
      LogService.LogInfo("Sponsorship renewed successfully")
      return {
        status_code: 200,
        data: {
          end_date,
          total_commission_amount: totalCommissionAmount
        },
        message: "Sponsorship renewed successfully",
        date: new Date(),
      };
    }

  } catch (error) {
    return {
      status_code: 500,
      data: null,
      message: "Internal Server Error",
      date: new Date(),
      error,
    };
  }
}

export function getMillisecondsInMonth(year: number, month: number): number {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  return end.getTime() - start.getTime();
}

// Helper function to ensure error messages are always strings, never objects
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  if (error instanceof Error) {
    return error.message || 'Unknown error';
  }

  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch (e) {
      try {
        return Object.entries(error)
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              try {
                return `${key}: ${JSON.stringify(value)}`;
              } catch (e) {
                return `${key}: [Complex Object]`;
              }
            } else {
              return `${key}: ${value}`;
            }
          })
          .join(', ');
      } catch (e) {
        return 'Unknown error (failed to stringify object)';
      }
    }
  }

  return String(error);
};

export default { generateRandomCode };
