"use server";

import { MembershipApiService } from "../../lib/service/service";
import { getUser } from "../../utils/session";

async function getUserAndAmount(
  service: MembershipApiService,
  formData: FormData
) {
  const userId = await getUser();
  if (!userId) {
    throw new Error(
      "You must be logged in to sign up, try refreshing the page, or logging out and back in again"
    );
  }
  const hackspaceUser = await service.dbClient.getUser(userId);
  if (!hackspaceUser) {
    throw new Error("You must be signed up to update your subscription");
  }

  const amount = formData.get("subscription_amount");
  if (!amount) {
    throw new Error("Subscription amount is required");
  }
  const amountString = amount.toString();
  const amountInPounds = parseInt(amountString, 10);
  const minimumSubscriptionAmountPounds =
    await service.getMinimumSubscriptionAmountPounds();
  if (amountInPounds < minimumSubscriptionAmountPounds) {
    throw new Error(
      `Subscription amount must be at least £${minimumSubscriptionAmountPounds}`
    );
  }
  return { userId, amountInPounds };
}

export const createSubscription = async (state: any, formData: FormData) => {
  try {
    const service = new MembershipApiService();
    const { userId, amountInPounds } = await getUserAndAmount(
      service,
      formData
    );
    await service.dbClient.updateUser({
      id: userId,
      subscription_amount: amountInPounds,
    });
    await service.createSubscriptionFromSavedAmount(userId);
    return state;
  } catch (e) {
    if (e instanceof Error) {
      return { errors: [e.message] };
    }
    return {
      errors: ["An unknown error occurred, please contact the trustees"],
    };
  }
};

export const updateSubscription = async (state: any, formData: FormData) => {
  try {
    const service = new MembershipApiService();
    const { userId, amountInPounds } = await getUserAndAmount(
      service,
      formData
    );
    await service.dbClient.updateUser({
      id: userId,
      subscription_amount: amountInPounds,
    });
    const subscription = await service.getActiveSubscriptionForUser(userId);
    await service.gocardless.updateSubscriptionAmount(
      subscription.id!,
      amountInPounds
    );
    return state;
  } catch (e) {
    if (e instanceof Error) {
      return { errors: [e.message] };
    }
    return {
      errors: ["An unknown error occurred, please contact the trustees"],
    };
  }
};

export const cancelSubscription = async (state: any, formData: FormData) => {
  try {
    const service = new MembershipApiService();
    const userId = await getUser();
    if (!userId) {
      return { errors: ["You must be logged in to cancel your subscription"] };
    }
    const subscription = await service.getActiveSubscriptionForUser(userId);
    await service.gocardless.cancelSubscription(subscription.id!);
    return state;
  } catch (e) {
    if (e instanceof Error) {
      return { errors: [e.message] };
    }
    return {
      errors: ["An unknown error occurred, please contact the trustees"],
    };
  }
};
