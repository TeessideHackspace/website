import { createHash } from "crypto";
import {
  Subscription,
  SubscriptionIntervalUnit,
  SubscriptionStatus,
} from "gocardless-nodejs";
import { GoCardlessClient } from "gocardless-nodejs/client";
import { Environments } from "gocardless-nodejs/constants";

export class GocardlessService {
  public client: GoCardlessClient;
  constructor() {
    if (!process.env.GOCARDLESS_KEY) {
      throw new Error("GOCARDLESS_KEY not set");
    }
    const environment = process.env.GOCARDLESS_KEY.includes("sandbox")
      ? Environments.Sandbox
      : Environments.Live;
    this.client = new GoCardlessClient(process.env.GOCARDLESS_KEY, environment);
  }

  async getCustomer(customerId: string) {
    const customer = await this.client.customers.find(customerId);
    return customer;
  }

  async getMandatesByCustomer(customer: string) {
    const mandates = await this.client.mandates.list({
      customer: customer,
    });
    return mandates.mandates;
  }

  async getMandate(mandateId: string) {
    const mandate = await this.client.mandates.find(mandateId);
    return mandate;
  }

  async getSubscription(subscriptionId: string) {
    const subscription = await this.client.subscriptions.find(subscriptionId);
    return subscription;
  }

  async getSubscriptionsByCustomer(customer: string) {
    const subscriptions = await this.client.subscriptions.list({
      customer: customer,
    });
    return subscriptions.subscriptions;
  }

  async getPayment(paymentId: string) {
    const payment = await this.client.payments.find(paymentId);
    return payment;
  }

  async setCustomerMetadata(customerId: string, metadata: any) {
    const customer = await this.client.customers.update(customerId, {
      metadata: metadata,
    });
    return customer;
  }

  async setMandateMetadata(customerId: string, metadata: any) {
    const customer = await this.client.mandates.update(customerId, {
      metadata: metadata,
    });
    return customer;
  }

  async confirmRedirect(userId: string, redirectFlowId: string) {
    const token = createHash("sha256").update(userId).digest("base64");
    const redirect = await this.client.redirectFlows.complete(redirectFlowId, {
      session_token: token,
    });
    return redirect;
  }

  async createSubscription(
    userId: string,
    amountInPounds: number,
    mandate: string
  ) {
    const subscription = await this.client.subscriptions.create({
      amount: `${amountInPounds * 100}`,
      currency: "GBP",
      name: "Teesside Hackspace Subscription",
      interval_unit: "monthly" as SubscriptionIntervalUnit,
      links: {
        mandate: mandate,
      },
      metadata: {
        hackspaceId: userId,
      },
    });
    return subscription;
  }

  async isSubcriptionActive(subscription: Subscription) {
    return subscription.status !== "cancelled";
  }

  async cancelSubscription(id: string) {
    const subscription = await this.client.subscriptions.cancel(id, {});
    return subscription;
  }

  async updateSubscriptionAmount(id: string, amount: number) {
    const subscription = await this.client.subscriptions.update(id, {
      amount: `${amount * 100}`,
    });
    return subscription;
  }

  async getActiveSubscriptions() {
    const subscriptions = await this.client.subscriptions.list({
      status: ["active" as SubscriptionStatus],
      limit: "500",
    });
    return subscriptions.subscriptions;
  }
}
