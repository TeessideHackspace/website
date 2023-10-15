import { NextRequest } from "next/server";
import { InvalidSignatureError, parse } from "gocardless-nodejs/webhooks";
import { Event } from "gocardless-nodejs";
import { MembershipApiService } from "../lib/service/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("Webhook-Signature");
    if (!signature) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!process.env.GOCARDLESS_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
    const events: Event[] = parse(
      body,
      process.env.GOCARDLESS_WEBHOOK_SECRET,
      signature
    );
    console.log(events);
    const service = new GocardlessWebhookService();
    for (const event of events) {
      if (event.resource_type === "mandates") {
        await service.handleMandateEvent(event);
      } else if (event.resource_type === "subscriptions") {
        await service.handleSubscriptionEvent(event);
      } else if (event.resource_type === "payments") {
        await service.handlePaymentEvent(event);
      }
    }
  } catch (e) {
    if (e instanceof InvalidSignatureError) {
      return new Response("Unauthorized", { status: 401 });
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
}

class GocardlessWebhookService {
  private service = new MembershipApiService();
  async handleMandateEvent(event: Event) {
    let mandate = event.links?.mandate;
    if (!mandate) {
      return false;
    }
    const user = await this.service.getUserbyMandate(mandate);
    if (!user) {
      return false;
    }
    await this.service.updateMandateStatus(user.id, event.action!);
    if (event.action === "created") {
      return true;
    }
    if (event.action === "active") {
      return true;
    } else if (event.action === "cancelled") {
      return this.service.handleCancelledMembership(user.id);
    } else if (event.action === "failed") {
      return this.service.handleCancelledMembership(user.id);
    }
    return false;
  }

  async handleSubscriptionEvent(event: Event) {
    let subscription = event.links?.subscription;
    if (!subscription) {
      return false;
    }
    const user = await this.service.getUserbySubscription(subscription);
    if (!user) {
      return false;
    }
    await this.service.updateSubscriptionStatus(user.id, event.action!);
    if (event.action === "cancelled") {
      return this.service.handleCancelledMembership(user.id);
    }
    return false;
  }

  async handlePaymentEvent(event: Event) {
    let payment = event.links?.payment;
    if (!payment) {
      return false;
    }
    const user = await this.service.getUserbyPayment(payment);
    if (!user) {
      return false;
    }
    await this.service.updatePaymentStatus(user.id, event.action!);
    if (event.action === "cancelled") {
      return true;
    }
    return false;
  }
}
