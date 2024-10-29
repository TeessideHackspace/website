"use server";
import { getSession } from "../../api/auth/auth";
import { MembershipApiService } from "../../lib/service/service";
import { redirect } from "next/navigation";

const MIN_MONTH = 6;

const requiredFields = {
  first_name: "First name",
  last_name: "Last name",
  billing_address1: "Address line 1",
  billing_town: "Town",
  billing_postcode: "Postcode",
  emergency_contact_first_name: "Emergency Contact - First Name",
  emergency_contact_last_name: "Emergency Contact - Last Name",
  emergency_contact_phone: "Emergency Contact - Phone Number",
  subscription_amount: "Subscription amount",
};

function isRequestValid(user: any) {
  const errors = [];
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!user[field] || user[field].trim() === "") {
      errors.push(`Missing required field "${label}"`);
    }
  }

  if (user.subscription_amount < MIN_MONTH) {
    errors.push(
      `The supplied subscription amount is below the minimum of £${MIN_MONTH}/month`
    );
  }

  return errors;
}

export const signup = async (state: any, formData: FormData) => {
  state.errors = [];
  const service = new MembershipApiService();
  const user = await getSession();
  if (!user) {
    state.errors.push(
      "You must be logged in to sign up, try refreshing the page, or logging out and back in again"
    );
    return state;
  }
  const hackspaceUser = await service.dbClient.getUser(user.id);
  if (hackspaceUser) {
    redirect("/members/subscription");
  }

  const formattedUser = {
    id: user.id,
    email: user.email,
    ...Object.fromEntries(formData),
    signup_date: new Date(Date.now()).toISOString(),
    roles: [],
  };

  const errors = isRequestValid(formattedUser);
  if (errors.length > 0) {
    state.errors = errors;
    return state;
  }
  const foundUser = await service.dbClient.getUser(formattedUser.id);
  if (foundUser && foundUser.gocardless_id) {
    state.errors.push("The user is already registered");
    return state;
  }

  const dbUser = await service.dbClient.updateUser(formattedUser);
  if (!dbUser) {
    state.errors.push(
      "Failed to create your new user record, please try again"
    );
    return state;
  }

  redirect("/members/setup-direct-debit");
};
