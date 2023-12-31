"use server";

import { MembershipApiService } from "../../lib/service/service";
import { getSession } from "../../api/auth/auth";

async function getUserAndAmount(
  service: MembershipApiService,
  formData: FormData
) {
  const user = await getSession();
  if (!user) {
    throw new Error(
      "You must be logged in to sign up, try refreshing the page, or logging out and back in again"
    );
  }
  const hackspaceUser = await service.dbClient.getUser(user.id);
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
  return { userId: user.id, amountInPounds };
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
    state.succeeded = true;
    state.errors = [];
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
    state.succeeded = true;
    state.errors = [];
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
    const user = await getSession();
    if (!user) {
      return { errors: ["You must be logged in to cancel your subscription"] };
    }
    const service = new MembershipApiService();
    const hackspaceUser = await service.dbClient.getUser(user.id);
    const subscription = await service.getActiveSubscriptionForUser(user.id);
    await service.gocardless.cancelSubscription(subscription.id!);
    state.succeeded = true;
    state.errors = [];
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
