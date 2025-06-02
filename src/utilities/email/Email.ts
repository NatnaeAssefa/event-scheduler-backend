import nodemailer from "nodemailer";
import { env } from "../../config";
import { User } from "../../models/User";
import { PaymentMethod } from "../constants/Constants";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendMail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

// send verification email template
public static verificationEmail(
  name: string,
  verification_url: string,
  company: string
) {
  return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #333333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .logo {
            margin-bottom: 20px;
        }
        h1 {
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        p {
            color: #555555;
            line-height: 1.5;
            margin: 5px 0;
            font-size: 14px;
        }
        .greeting {
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .explanation {
            max-width: 350px;
            margin-left: auto;
            margin-right: auto;
        }
        .btn {
            display: inline-block;
            padding: 10px 25px;
            color: #ffffff;
            background-color: #D6B66D;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            margin: 20px 0;
            border: none;
            cursor: pointer;
        }
        .disclaimer {
            font-size: 13px;
            color: #666666;
            margin: 25px auto;
            max-width: 350px;
            line-height: 1.5;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 40px;
            padding-top: 20px;
            background-color: #f9f9f9;
            max-width: 100%;
            padding: 20px;
            line-height: 1.5;
        }
        .logo svg {
            height: 60px;
        }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#D6B66D" stroke-width="5" fill="none" />
                <text x="50%" y="55%" text-anchor="middle" fill="#D6B66D" font-size="20" font-family="Arial" dy=".3em">${company[0]}</text>
            </svg>
        </div>
        
        <h1>Please verify your email 😊</h1>
        
        <p class="greeting">Hi ${name},</p>
        
        <p class="explanation">To use ${company}, click the verification button. This helps keep your account secure.</p>
        
        <a href="${verification_url}" class="btn">Verify my account</a>
        
        <div class="disclaimer">
            You're receiving this email because you have an account with ${company}. If you are not sure why you're receiving this, please contact us by replying to this email.
        </div>
        
        <div class="footer">
            ${company} helps homeowners sell their properties faster and smarter with AI-powered insights, competitive market analysis, and personalized selling strategies.
        </div>
    </div>
  </body>
  </html>`;
}


  public static recoveryEmail(
    name: string,
    reset_url: string,
    company: string
  ) {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #666666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="text-align: center; color: #333;">Password Recovery</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Please click the button below to proceed with the password recovery process:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${reset_url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>Click on the link bellow the button is not working</p>
        <p>${reset_url}</p>
        <p></p>
        <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>For your security, this link will expire in 24 hours. If the link has expired, you can request a new one through the password recovery page.</p>
        <p>Thanks,<br>The ${company} Team</p>
    </div>
</body>
</html>
        `;
  }

  public static subscriptionCancellationEmail(
    name: string,
    company: string,
    support_url: string
  ) {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Cancellation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #666666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #dc3545;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Subscription Cancelled</h1>
        <p>Hello ${name},</p>
        <p>We’re sorry to see you go! Your subscription has been successfully cancelled. You will continue to have access to your subscription until the end of your billing cycle.</p>
        <p>If you have any questions or if there's anything we can do to improve your experience, please feel free to reach out to us.</p>
        <a href="${support_url}" class="btn">Contact Admin</a>
        <p>Thank you for being a valued member of ${company}. We hope to serve you again in the future.</p>
        <p>Best regards, <br>The ${company} Team</p>
    </div>
</body>
</html>
        `;
  }

  public static emailSubscriberWelcomeEmail(
    company: string,
    support_url: string
  ) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to ${company}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #666666;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .btn:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to ${company}!</h1>
            <p>Thank you for subscribing! We’re excited to have you on board.</p>
            <p>You'll receive updates, offers, and important news from us. Stay tuned for great content and valuable insights.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <a href="${support_url}" class="btn">Contact Support</a>
            <p>Best regards, <br>The ${company} Team</p>
          </div>
        </body>
      </html>
    `;
  }

  public static subscriptionCreatedEmail(
    name: string,
    company: string,
    dashboard_url: string
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Created</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #333333; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to ${company}!</h1>
            <p>Hello ${name},</p>
            <p>Your subscription has been successfully created. You can now start exploring your benefits.</p>
            <a href="${dashboard_url}" class="btn">Go to Dashboard</a>
            <p>Thank you for choosing ${company}!</p>
        </div>
    </body>
    </html>
  `;
  }


  public static subscriptionUpgradedEmail(name: string, company: string, newPlan: string, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Upgraded</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #333333; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #218838; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Subscription Upgraded!</h1>
            <p>Hello ${name},</p>
            <p>Your subscription at ${company} has been successfully upgraded to ${newPlan}.</p>
            <a href="${dashboard_url}" class="btn">View Subscription</a>
            <p>Enjoy your new benefits and thank you for choosing ${company}!</p>
        </div>
    </body>
    </html>
  `;
  }

  public static subscriptionDowngradedEmail(name: string, company: string, oldPlan: string, newPlan: string, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Downgraded</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #333333; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #ffc107; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #e0a800; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Subscription Downgraded</h1>
            <p>Hello ${name},</p>
            <p>Your subscription at ${company} has been downgraded from ${oldPlan} to ${newPlan}.</p>
            <a href="${dashboard_url}" class="btn">Review Plan</a>
            <p>If you have any concerns, feel free to reach out.</p>
        </div>
    </body>
    </html>
  `;
  }

  public static payoutProcessedEmail(
    name: string,
    amount: number,
    payoutMethod: string,
    transaction_url: string
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payout Processed</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #333333; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #17a2b8; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #138496; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payout Processed</h1>
            <p>Hello ${name},</p>
            <p>Your payout of $${amount} has been successfully processed via ${payoutMethod}.</p>
            <a href="${transaction_url}" class="btn">View Transaction</a>
            <p>Thank you for being a valued partner!</p>
        </div>
    </body>
    </html>
  `;
  }


  public static residencyCalendlyEmail(name: string, url: string) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Residency Completed - Schedule Your Call</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #666666;
              line-height: 1.6;
              margin-bottom: 20px;
            }           
            .btn {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .btn:hover {
              background-color: #0056b3;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Residency Completed</h1>
            <p>Hello ${name},</p>
            <p>Congratulations on completing your residency! You can now schedule your follow-up call at your convenience.</p>
             <a href="${url}" class="btn">Schedule Your Residency on Calendly</a>
            <p>Thank you for being a valued partner!</p>
          </div>
        </body>
      </html>
    `;
  }
  public static consultationCalendlyEmail(name: string, url: string) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Consultation Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #666666;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .btn:hover {
              background-color: #0056b3;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Consultation Book Completed</h1>
            <p>Hello ${name},</p>
            <p>Congratulations on completing your consultation book! You can now schedule your follow-up call at your convenience.</p>
            <a href="${url}" class="btn">Schedule Your Calendly Meeting</a>
            <p>Thank you for being a valued partner!</p>
          </div>
        </body>
      </html>
    `;
  }
  public static subscriptionExpiredEmail(name: string, company: string, expiredPlan: string, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Expired</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #d9534f; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #218838; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Subscription Expired</h1>
            <p>Hello ${name},</p>
            <p>We wanted to inform you that your subscription (${expiredPlan}) at ${company} has expired.</p>
            <p>To continue enjoying our services, please renew your subscription at your earliest convenience.</p>
            <a href="${dashboard_url}" class="btn">Renew Now</a>
            <p>If you need any assistance, feel free to contact us.</p>
        </div>
    </body>
    </html>
  `;
  }

  public static subscriptionExpiringEmail(name: string, company: string, currentPlan: string, daysLeft: string, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Expiring Soon</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          h1 { color: #f39c12; font-size: 24px; margin-bottom: 20px; }
          p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
          .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
          .btn:hover { background-color: #0056b3; }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Subscription Expiring Soon</h1>
          <p>Hello ${name},</p>
          <p>Your current subscription (${currentPlan}) at ${company} is set to expire in ${daysLeft} days.</p>
          <p>To avoid any interruptions, we recommend renewing your plan before the expiration date.</p>
          <a href="${dashboard_url}" class="btn">Renew Now</a>
          <p>If you have any questions, feel free to reach out.</p>
      </div>
  </body>
  </html>
`;
  }

  public static payoutApprovedEmail(name: string, amount: string = "$0", payoutMethod: string = PaymentMethod.STRIPE, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payout Approved</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #28a745; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payout Approved</h1>
            <p>Hello ${name},</p>
            <p>We’re happy to inform you that your payout request of <strong>${amount}</strong> via <strong>${payoutMethod}</strong> has been approved.</p>
            <p>You can review your payout details in your dashboard.</p>
            <a href="${dashboard_url}" class="btn">View Payout</a>
            <p>If you have any questions, feel free to contact us.</p>
        </div>
    </body>
    </html>
  `;
  }

  public static payoutRejectedEmail(name: string, amount: string = "$0", payoutMethod: string = PaymentMethod.STRIPE, dashboard_url: string = env.WEBSITE_BASE_URL + "/account") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payout Rejected</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #d9534f; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payout Rejected</h1>
            <p>Hello ${name},</p>
            <p>We regret to inform you that your payout request has been rejected.</p>
            <p>Please review the details in your dashboard and take any necessary action.</p>
            <a href="${dashboard_url}" class="btn">Review Request</a>
            <p>If you need further assistance, please reach out to our support team.</p>
        </div>
    </body>
    </html>
  `;
  }

  public static subscriptionRenewedEmail(
    name: string,
    company: string,
    renewedPlan: string,
    dashboard_url: string = env.WEBSITE_BASE_URL + "/account"
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Renewed</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #28a745; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Subscription Renewed Successfully!</h1>
            <p>Hello ${name},</p>
            <p>Great news! Your subscription (${renewedPlan}) at ${company} has been successfully renewed.</p>
            <p>You can continue enjoying our services without interruption.</p>
            <a href="${dashboard_url}" class="btn">Go to Dashboard</a>
            <p>If you have any questions, feel free to contact our support team.</p>
        </div>
    </body>
    </html>
    `;
  }

  public static refundApprovedEmail(
    name: string,
    company: string,
    refundAmount: string,
    dashboard_url: string = env.WEBSITE_BASE_URL + "/account"
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Approved</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #28a745; font-size: 24px; margin-bottom: 20px; }
            p { color: #666666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px; }
            .btn:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Refund Has Been Approved!</h1>
            <p>Hello ${name},</p>
            <p>We have processed your refund of <strong>${refundAmount}</strong> from ${company}. The refund has been approved and is on its way.</p>
            <p>Please note that it may take <strong>5-6 business days</strong> for the refund to reflect in your bank account, depending on your bank's processing time.</p>
            <a href="${dashboard_url}" class="btn">Go to Dashboard</a>
            <p>If you have any questions, feel free to contact our support team.</p>
        </div>
    </body>
    </html>
    `;
  }

}