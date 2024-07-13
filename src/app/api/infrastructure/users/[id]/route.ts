import { NextRequest } from "next/server";
import { MembershipApiService } from "../../../../lib/service/service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let authHeader = request.headers.get("Authorization") || "";
  authHeader = authHeader.toLowerCase().replace("bearer ", "");
  if (!authHeader || authHeader !== process.env.INFRASTRUCTURE_SHARED_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  const service = new MembershipApiService();

  const rfidTag = await service.dbClient.getRfidTag(params.id as string);
  if (!rfidTag) {
    return Response.json(
      {
        status: 404,
        code: "RFID_NOT_FOUND",
        title: "The RFID tag was not found",
      },
      {
        status: 404,
      }
    );
  }
  const user = await service.dbClient.getUser(rfidTag.user);
  if (!user) {
    return Response.json(
      {
        status: 404,
        code: "USER_NOT_FOUND",
        title: "The user was not found",
      },
      {
        status: 404,
      }
    );
  }
  const realmRoles = await service.keycloak.listRealmRoles(user.id);
  const roles = realmRoles.map((role) => role.name);
  return Response.json({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    roles,
  });
}
