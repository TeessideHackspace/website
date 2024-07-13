import { MembershipApiService } from "../src/app/lib/service/service";

class RoleMigrationService {
  private service = new MembershipApiService();
  async run() {
    const users = await this.service.dbClient.getAllUsers();
    for (const user of users) {
      // const newRoles = user.roles?.filter(Boolean) || [];
      // console.log(`Updating roles for ${user.email} to ${newRoles.join(", ")}`);
      // for (const role of newRoles) {
      //   await this.service.keycloak.addRealmRole(user.id, role);
      // }
    }
  }
}

const service = new RoleMigrationService();
service.run();
