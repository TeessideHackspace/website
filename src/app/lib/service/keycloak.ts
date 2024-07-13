import KcAdminClient from "keycloak-admin";

export interface User {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  attributes?: UserAttributes;
}

export interface UserAttributes {
  nickName?: string | string[];
  gocardless?: string | string[];
}

const MEMBER_ROLE_ID = "member";

export class Keycloak {
  public keycloak: KcAdminClient;
  private keycloakClientId: string;
  private keycloakClientSecret: string;

  constructor() {
    if (!process.env.KEYCLOAK_URL) {
      throw new Error("KEYCLOAK_URL not set");
    }
    if (!process.env.KEYCLOAK_CLIENT_ID) {
      throw new Error("KEYCLOAK_CLIENT_ID not set");
    }
    if (!process.env.KEYCLOAK_SECRET) {
      throw new Error("KEYCLOAK_SECRET not set");
    }

    this.keycloakClientId = process.env.KEYCLOAK_CLIENT_ID;
    this.keycloakClientSecret = process.env.KEYCLOAK_SECRET;

    this.keycloak = new KcAdminClient({
      baseUrl: process.env.KEYCLOAK_URL!,
    });
  }

  private async reauth() {
    return await this.keycloak.auth({
      grantType: "client_credentials",
      clientId: this.keycloakClientId,
      clientSecret: this.keycloakClientSecret,
    });
  }

  async getAllUsers(): Promise<User[]> {
    await this.reauth();
    return this.keycloak.users.find();
  }

  async getUser(id: string): Promise<User> {
    await this.reauth();
    return this.keycloak.users.findOne({ id });
  }

  async listRealmRoles(userId: string) {
    await this.reauth();
    return this.keycloak.users.listRealmRoleMappings({ id: userId });
  }

  async findUsersWithRole(role: string) {
    await this.reauth();
    return this.keycloak.roles.findUsersWithRole({ name: role, max: 10000 });
  }

  async addRealmRole(userId: string, roleName: string) {
    await this.reauth();
    const availableRoles =
      await this.keycloak.users.listAvailableRealmRoleMappings({ id: userId });
    const role = availableRoles.find((role) => role.name === roleName);
    if (!role?.id || !role?.name) {
      console.warn("Tried to add realm role that was not found", roleName);
      return;
    }
    return this.keycloak.users.addRealmRoleMappings({
      id: userId,
      roles: [{ id: role.id, name: role.name }],
    });
  }

  async removeRealmRole(userId: string, roleName: string) {
    await this.reauth();
    const assignedRoles = await this.keycloak.users.listRealmRoleMappings({
      id: userId,
    });
    const role = assignedRoles.find((role) => role.name === roleName);
    if (!role?.id || !role?.name) {
      console.warn("Tried to remove realm role that was not found", roleName);
      return;
    }
    return this.keycloak.users.delRealmRoleMappings({
      id: userId,
      roles: [{ id: role.id, name: role.name }],
    });
  }

  async setUserAttributes(
    id: string,
    attributes: UserAttributes
  ): Promise<void> {
    await this.reauth();
    const user = await this.keycloak.users.findOne({ id });
    user.attributes = { ...user.attributes, ...attributes };
    return this.keycloak.users.update({ id }, user);
  }

  async deleteClientRole(userId: string, clientId: string, role: string) {
    return this.keycloak.users.delClientRoleMappings(
      await this.getRoleChangeObject(userId, clientId, role)
    );
  }

  async addClientRole(userId: string, clientId: string, role: string) {
    return this.keycloak.users.addClientRoleMappings(
      await this.getRoleChangeObject(userId, clientId, role)
    );
  }

  async getUsersWithRole(clientId: string, roleName: string) {
    await this.reauth();
    const clients = await this.keycloak.clients.find({ clientId });
    return this.keycloak.clients.findUsersWithRole({
      id: clients[0].id!,
      roleName,
    });
  }
  private async getRoleChangeObject(
    id: string,
    clientId: string,
    roleName: string
  ) {
    await this.reauth();
    const clients = await this.keycloak.clients.find({
      clientId,
    });
    const client = clients[0];
    const role = await this.keycloak.clients.findRole({
      id: client.id!,
      roleName: roleName,
    });
    return {
      id,
      clientUniqueId: clients[0].id!,
      roles: [
        {
          id: role.id!,
          name: roleName,
        },
      ],
    };
  }
}
