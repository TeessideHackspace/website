import { MembershipApiService } from "../../../lib/service/service";

export async function GET(request: Request) {
  let authHeader = request.headers.get("Authorization") || "";
  authHeader = authHeader.toLowerCase().replace("bearer ", "");
  if (!authHeader || authHeader !== process.env.INFRASTRUCTURE_SHARED_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  const service = new MembershipApiService();
  const allUsers = await service.dbClient.getAllUsers();
  const allRfids = await service.dbClient.getAllRfidTags();
  const allRoles = await service.getAllUserRoles();
  const users = allUsers.map((user) => {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      roles: allRoles[user.id] || [],
      rfids: allRfids
        .filter((rfid) => rfid.user === user.id)
        .map((rfid) => rfid.id),
    };
  });
  return Response.json(users);
}
