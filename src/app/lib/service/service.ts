import { createHash } from "crypto";
import { DataAccess } from "./db";
import { GocardlessService } from "./gocardless";
import { EmailClient } from "../email/email";

const MINIMUM_SUBSCRIPTION_POUNDS = 5;

export class MembershipApiService {
  public gocardless = new GocardlessService();
  public dbClient = new DataAccess();
  public email = new EmailClient();
  constructor() {}

  async completeRedirect(userId: string, redirectFlowId: string) {
    const redirectResult = await this.gocardless.confirmRedirect(
      userId,
      redirectFlowId
    );
    const customer = redirectResult.links?.customer;
    const mandate = redirectResult.links?.mandate;
    if (!customer || !mandate) {
      throw new Error("Failed to confirm redirect");
    }
    const user = await this.dbClient.updateUser({
      id: userId,
      gocardless_id: customer,
    });
    const customerUpdate = await this.gocardless.setCustomerMetadata(customer, {
      hackspaceId: userId,
    });
    const mandateUpdate = await this.gocardless.setMandateMetadata(mandate, {
      hackspaceId: userId,
    });
    if (!user) {
      throw new Error("Failed to update user");
    }

    await this.createSubscriptionFromSavedAmount(userId);

    return customerUpdate;
  }

  async createSubscriptionFromSavedAmount(userId: string) {
    const user = await this.dbClient.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.gocardless_id) {
      throw new Error("User does not have a Direct Debit Mandate");
    }
    const mandate = await this.gocardless.getMandatesByCustomer(
      user.gocardless_id
    );
    if (!mandate.length) {
      throw new Error("User does not have a Direct Debit Mandate");
    }
    if (mandate.length > 1) {
      throw new Error("User has multiple Direct Debit Mandates");
    }
    const firstMandate = mandate[0];
    if (!firstMandate.id) {
      throw new Error("Direct Debit Mandate has no ID");
    }

    const subscription = await this.gocardless.createSubscription(
      userId,
      user.subscription_amount,
      firstMandate.id
    );
    await this.changeUserRoles(userId, ["member"], []);
    await this.email.welcome(user.first_name, user.email);
    return subscription;
  }

  async gocardlessRedirectUrl(userId: string, redirectUrl?: string) {
    const user = await this.dbClient.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const url =
      redirectUrl ||
      "https://www.teessidehackspace.org.uk/members#/signup-confirm";
    const token = createHash("sha256").update(userId).digest("base64");
    const redirect = await this.gocardless.client.redirectFlows.create({
      description: "Teesside Hackspace Membership",
      session_token: token,
      success_redirect_url: url,
      prefilled_customer: {
        given_name: user.first_name,
        family_name: user.last_name,
        email: user.email,
        address_line1: user.billing_address1,
        address_line2: user.billing_address2
          ? user.billing_address2
          : undefined,
        city: user.billing_town,
        postal_code: user.billing_postcode,
      },
    });
    return redirect.redirect_url;
  }

  async getStats() {
    let subscriptionsRaw = await this.gocardless.getActiveSubscriptions();
    let subscriptions = subscriptionsRaw
      .filter((x) => x)
      .map((subscription) => {
        return {
          ...subscription,
          amount: parseInt(subscription.amount || "0", 10),
        };
      });
    const income = subscriptions.reduce((total, subscription) => {
      if (subscription) {
        total += subscription.amount;
      }
      return total;
    }, 0);
    const average = Math.floor(income / subscriptions.length);
    const num_less_average = subscriptions.filter(
      (x) => x.amount < average
    ).length;
    const all_amounts = subscriptions.map((x) => x.amount);
    let response = {
      income: income,
      num_members: subscriptions.length,
      average: average,
      num_less_average: num_less_average,
      all_amounts,
    };
    return response;
  }

  async getUserbyCustomer(customer: string) {
    const gocardlessCustomer = await this.gocardless.getCustomer(customer);
    if (!gocardlessCustomer.metadata?.hackspaceId) {
      return false;
    }
    return this.dbClient.getUser(
      gocardlessCustomer.metadata.hackspaceId as string
    );
  }

  async getUserbyMandate(mandate: string) {
    const gocardlessMandate = await this.gocardless.getMandate(mandate);
    if (!gocardlessMandate.links?.customer) {
      return false;
    }
    return this.getUserbyCustomer(gocardlessMandate.links.customer);
  }

  async getUserbySubscription(subscription: string) {
    const gocardlessSubscription = await this.gocardless.getSubscription(
      subscription
    );
    if (!gocardlessSubscription.links?.mandate) {
      return false;
    }
    return this.getUserbyMandate(gocardlessSubscription.links.mandate);
  }

  async getUserbyPayment(payment: string) {
    const gocardlessPayment = await this.gocardless.getPayment(payment);
    if (!gocardlessPayment.links?.subscription) {
      return false;
    }
    return this.getUserbySubscription(gocardlessPayment.links.subscription);
  }

  async updateMandateStatus(user: string, status: string) {
    await this.dbClient.updateUser({
      id: user,
      mandate_status: status,
    });
    return this.dbClient.getUser(user);
  }

  async updateSubscriptionStatus(user: string, status: string) {
    await this.dbClient.updateUser({
      id: user,
      subscription_status: status,
    });
    return this.dbClient.getUser(user);
  }

  async updatePaymentStatus(user: string, status: string) {
    await this.dbClient.updateUser({
      id: user,
      payment_status: status,
    });
    return this.dbClient.getUser(user);
  }

  async changeUserRoles(userId: string, add: string[], remove: string[]) {
    const user = await this.dbClient.getUser(userId);
    if (!user) {
      return false;
    }
    const roles = user.roles.filter((role) => !remove.includes(role));
    await this.dbClient.updateUser({
      id: userId,
      roles: Array.from(new Set([...roles, ...add])),
    });
    return this.dbClient.getUser(userId);
  }

  async handleCancelledMembership(id: string) {
    const user = await this.changeUserRoles(id, [], ["member"]);
    if (!user) {
      return false;
    }
    return this.email.subscriptionLapsed(user.first_name, user.email);
  }

  async getActiveSubscriptionForUser(userId: string) {
    const user = await this.dbClient.getUser(userId);
    if (!user || !user.gocardless_id) {
      throw new Error("User not found");
    }
    const subscriptions = await this.gocardless.getSubscriptionsByCustomer(
      user.gocardless_id
    );
    const activeSubscriptions = subscriptions.filter(
      (subscription) => subscription.status === "active"
    );
    if (!activeSubscriptions.length) {
      throw new Error("User has no active subscriptions");
    }
    if (activeSubscriptions.length > 1) {
      throw new Error("User has multiple active subscriptions");
    }

    return activeSubscriptions[0];
  }

  async getMinimumSubscriptionAmountPounds(): Promise<number> {
    return MINIMUM_SUBSCRIPTION_POUNDS;
  }
}
