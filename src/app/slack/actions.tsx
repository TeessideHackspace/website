"use server";
export const slackSignup = async (state: any, formData: FormData) => {
  try {
    const email = formData.get("slack_email")?.toString();
    if (!email) {
      return { errors: ["Email is required"] };
    }
    console.log(email);
    const baseURL = "https://slack.com/api/users.admin.invite";
    const toSlack = `email=${encodeURIComponent(email)}&token=${
      process.env.SLACK_TOKEN
    }&set_active=true`;
    const response = await fetch(`${baseURL}?${toSlack}`);
    if (!response.ok) {
      return { errors: ["Failed to send invite"] };
    }
    const json = await response.json();
    if (!json.ok) {
      return { errors: ["Failed to send invite"] };
    }
    console.log(json);
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
