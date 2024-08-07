import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const MEMBERS_TABLE = process.env.DYNAMODB_TABLE_MEMBERS;
if (!MEMBERS_TABLE) {
  throw new Error("DYNAMODB_TABLE_MEMBERS not set");
}

const RFID_TABLE = process.env.DYNAMODB_TABLE_RFID;
if (!RFID_TABLE) {
  throw new Error("DYNAMODB_TABLE_RFID not set");
}

export interface RfidDynamoKey {
  id: string;
}
export interface RfidTag extends RfidDynamoKey {
  user: string;
  name?: string;
  created_date?: string;
}

export interface UserDynamoKey {
  id: string;
}

export interface UserDynamoModel extends UserDynamoKey {
  billing_postcode: string;
  billing_address1: string;
  billing_address2: string;
  subscription_amount: number;
  payment_status: string;
  email: string;
  signup_date: string;
  mandate_status: string;
  emergency_contact_first_name: string;
  emergency_contact_last_name: string;
  last_name: string;
  subscription_status: string;
  first_name: string;
  gocardless_id: string;
  emergency_contact_phone: string;
  billing_town: string;
}

export class DataAccess {
  private client: DynamoDBDocument;
  constructor() {
    const dynamoClient = new DynamoDBClient({
      credentials: {
        accessKeyId: process.env.HS_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.HS_AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.HS_AWS_REGION!,
    });
    this.client = DynamoDBDocument.from(dynamoClient);
  }

  async getUser(id: string): Promise<UserDynamoModel | undefined> {
    const result = await this.client.get({
      TableName: MEMBERS_TABLE,
      Key: {
        id,
      },
    });
    if (!result || !result.Item) {
      return;
    }
    if (result.Item?.roles) {
      delete result.Item.roles;
    }
    return result.Item as unknown as UserDynamoModel;
  }

  async updateUser(
    member: UserDynamoKey & Partial<UserDynamoModel>
  ): Promise<UserDynamoModel | undefined> {
    const existingUser = await this.getUser(member.id);

    const result = await this.client.put({
      TableName: MEMBERS_TABLE,
      Item: {
        ...existingUser,
        ...member,
      },
    });
    return this.getUser(member.id);
  }

  async addRifdTag(tag: RfidTag): Promise<RfidTag | undefined> {
    await this.client.put({
      TableName: RFID_TABLE,
      Item: {
        ...tag,
      },
    });
    return this.getRfidTag(tag.id);
  }

  async deleteRfidTag(id: string): Promise<Boolean | undefined> {
    await this.client.delete({
      TableName: RFID_TABLE,
      Key: {
        id,
      },
    });
    return true;
  }

  async getRfidTag(rfid: string): Promise<RfidTag | undefined> {
    const result = await this.client.get({
      TableName: RFID_TABLE,
      Key: {
        id: rfid,
      },
    });
    if (!result || !result.Item) {
      return;
    }
    return result.Item as unknown as RfidTag;
  }

  async getAllRfidTags(): Promise<RfidTag[]> {
    const result = await this.client.scan({
      TableName: RFID_TABLE,
    });
    if (!result || !result.Items) {
      return [];
    }
    return result.Items as unknown as RfidTag[];
  }

  async getAllUsers(): Promise<UserDynamoModel[]> {
    const result = await this.client.scan({
      TableName: MEMBERS_TABLE,
    });
    if (!result || !result.Items) {
      return [];
    }
    result.Items = result.Items.map((item) => {
      if (item.roles) {
        delete item.roles;
      }
      return item;
    });
    return result.Items as unknown as UserDynamoModel[];
  }

  async getRfidsForUser(userId: string): Promise<RfidTag[]> {
    const result = await this.client.scan({
      TableName: RFID_TABLE,
      ScanFilter: {
        user: {
          ComparisonOperator: "EQ",
          AttributeValueList: [userId],
        },
      },
    });

    if (!result || !result.Items) {
      return [];
    }
    return result.Items as unknown as RfidTag[];
  }
}
