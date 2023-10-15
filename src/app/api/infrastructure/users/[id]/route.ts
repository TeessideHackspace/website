import { NextRequest } from "next/server";
import { MembershipApiService } from "../../../../lib/service/service";
import { useParams } from "next/navigation";

export async function GET(request: NextRequest) {
  const params = useParams();
  const authHeader = request.headers.get("Authorization");
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
  return Response.json(user);
}
