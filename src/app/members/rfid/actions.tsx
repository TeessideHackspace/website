"use server";

import { MembershipApiService } from "../../lib/service/service";
import { getSession } from "../../api/auth/auth";

export const addRfid = async (state: any, formData: FormData) => {
  try {
    const service = new MembershipApiService();
    const user = await getSession();
    if (!user) {
      state.errors = ["You must be logged in to add an RFID"];
      return state;
    }
    let name = formData.get("name")?.toString();
    if (!name) {
      name = "Keyfob";
    }
    const id = formData.get("rfid")?.toString();
    if (!id) {
      state.errors = ["RFID is required"];
      return state;
    }
    const date = new Date();

    const rfid = await service.dbClient.addRifdTag({
      id,
      name,
      user: user.id,
      created_date: date.toISOString(),
    });
    if (rfid) {
      state.succeeded = true;
      state.errors = [];
      return state;
    }
    state.errors = ["Failed to add RFID, please try again"];
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

export const deleteRfid = async (state: any, formData: FormData) => {
  try {
    const service = new MembershipApiService();
    const user = await getSession();
    if (!user) {
      state.errors = ["You must be logged in to delete an RFID"];
      return state;
    }
    const id = formData.get("id")?.toString();
    if (!id) {
      state.errors = ["RFID is required"];
      return state;
    }
    const existingRfid = await service.dbClient.getRfidTag(id);
    if (!existingRfid) {
      state.errors = ["RFID not found"];
      return state;
    }
    if (existingRfid.user !== user.id) {
      state.errors = ["RFID not found"];
      return state;
    }
    const rfid = await service.dbClient.deleteRfidTag(id);
    if (rfid) {
      state.succeeded = true;
      state.errors = [];
      return state;
    }
    state.errors = ["Failed to delete RFID, please try again"];
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
