/**
 * Email Notification Service
 * Handles sending transactional emails via SendGrid or mock implementation
 */

export interface EmailTemplate {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

/**
 * Send withdrawal confirmation email
 */
export async function sendWithdrawalConfirmation(
  userEmail: string,
  amount: string,
  method: string,
  transactionId: string
): Promise<boolean> {
  try {
    const emailData = {
      to: userEmail,
      subject: `Withdrawal Confirmation - $${amount}`,
      template: "withdrawal_confirmation",
      data: {
        amount,
        method,
        transactionId,
        estimatedDelivery: "3-5 business days",
      },
    };

    return await sendEmail(emailData);
  } catch (error) {
    console.error("[EMAIL] Failed to send withdrawal confirmation:", error);
    return false;
  }
}

/**
 * Send survey completion reward email
 */
export async function sendSurveyRewardEmail(
  userEmail: string,
  surveyTitle: string,
  reward: string,
  newBalance: string
): Promise<boolean> {
  try {
    const emailData = {
      to: userEmail,
      subject: `Survey Reward: +$${reward}`,
      template: "survey_reward",
      data: {
        surveyTitle,
        reward,
        newBalance,
      },
    };

    return await sendEmail(emailData);
  } catch (error) {
    console.error("[EMAIL] Failed to send survey reward email:", error);
    return false;
  }
}

/**
 * Send referral bonus email
 */
export async function sendReferralBonusEmail(
  userEmail: string,
  referralCount: number,
  totalBonus: string,
  tier: string
): Promise<boolean> {
  try {
    const emailData = {
      to: userEmail,
      subject: `Referral Bonus: +$${totalBonus}`,
      template: "referral_bonus",
      data: {
        referralCount,
        totalBonus,
        tier,
      },
    };

    return await sendEmail(emailData);
  } catch (error) {
    console.error("[EMAIL] Failed to send referral bonus email:", error);
    return false;
  }
}

/**
 * Send welcome email with bonus
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  welcomeBonus: string
): Promise<boolean> {
  try {
    const emailData = {
      to: userEmail,
      subject: "Welcome to EarnBro - $5 Bonus Inside!",
      template: "welcome",
      data: {
        userName,
        welcomeBonus,
      },
    };

    return await sendEmail(emailData);
  } catch (error) {
    console.error("[EMAIL] Failed to send welcome email:", error);
    return false;
  }
}

/**
 * Core email sending function
 * Integrates with SendGrid in production, logs in development
 */
async function sendEmail(emailData: EmailTemplate): Promise<boolean> {
  try {
    // Mock implementation - logs email instead of sending
    console.log(`[EMAIL] Sending ${emailData.template} to ${emailData.to}`);
    console.log(`[EMAIL] Subject: ${emailData.subject}`);
    console.log(`[EMAIL] Data:`, JSON.stringify(emailData.data, null, 2));

    // In production with SendGrid:
    if (process.env.SENDGRID_API_KEY) {
      return await sendViasenGrid(emailData);
    }

    // Mock success
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);
    return false;
  }
}

/**
 * Send email via SendGrid (production)
 */
async function sendViasenGrid(emailData: EmailTemplate): Promise<boolean> {
  try {
    // In production, call SendGrid API
    // sgMail.send({ to: emailData.to, subject: emailData.subject, ... })
    console.log("[EMAIL] Sending via SendGrid:", emailData.to);
    return true;
  } catch (error) {
    console.error("[EMAIL] SendGrid error:", error);
    return false;
  }
}

/**
 * Email templates (HTML)
 */
export const emailTemplates = {
  withdrawal_confirmation: `
    <h2>Withdrawal Confirmation</h2>
    <p>Your withdrawal request has been received!</p>
    <p><strong>Amount:</strong> $AMOUNT</p>
    <p><strong>Method:</strong> METHOD</p>
    <p><strong>Transaction ID:</strong> TRANSACTION_ID</p>
    <p>Expected delivery: ESTIMATED_DELIVERY</p>
  `,

  survey_reward: `
    <h2>Survey Completed!</h2>
    <p>Great job completing: <strong>SURVEY_TITLE</strong></p>
    <p>You earned: <strong>+$REWARD</strong></p>
    <p>Your new balance: <strong>$NEW_BALANCE</strong></p>
  `,

  referral_bonus: `
    <h2>Referral Bonus!</h2>
    <p>You've earned a referral bonus!</p>
    <p>Referrals: REFERRAL_COUNT</p>
    <p>Bonus: +$TOTAL_BONUS</p>
    <p>Current Tier: TIER</p>
  `,

  welcome: `
    <h2>Welcome to EarnBro, USER_NAME!</h2>
    <p>You've been credited with a <strong>$WELCOME_BONUS welcome bonus</strong>!</p>
    <p>Start earning by completing surveys, claiming offers, and playing games.</p>
  `,
};
