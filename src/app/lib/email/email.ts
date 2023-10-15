import { readFileSync } from "fs";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import Handlebars from "handlebars";
import { resolve } from "path";

const template = Handlebars.compile(
  readFileSync(resolve("./src/app/resources/templates/template.html"), {
    encoding: "utf8",
  })
);
const textTemplate = Handlebars.compile(
  readFileSync(resolve("./src/app/resources/templates/text.txt"), {
    encoding: "utf8",
  })
);
const link = Handlebars.compile(
  '<a href="{{href}}" style="text-decoration: underline;">{{text}}</a>'
);

const trusteesAddress = "trustees@teessidehackspace.org.uk";

export interface EmailBody {
  html: string;
  text: string;
}

export class EmailClient {
  private ses: SESClient;
  constructor() {
    this.ses = new SESClient();
  }
  welcome(name: string, email: string) {
    console.log("Sending welcome email to: " + email);
    return this.sendEmail(
      email,
      "Welcome to Teesside Hackspace!",
      this.welcomeEmail(name)
    );
  }

  subscriptionLapsed(name: string, email: string) {
    console.log("Sending subscription lapsed email to: " + email);
    return this.sendEmail(
      email,
      "Teesside Hackspace membership cancelled",
      this.membershipLapsed(name)
    );
  }

  async sendEmail(address: string, subject: string, body: EmailBody) {
    if (process.env.SERVERLESS_STAGE === "dev") {
      subject = "[DEV ENVIRONMENT] " + subject;
    }
    let eParams = {
      Destination: {
        ToAddresses: [address],
        BccAddresses: [trusteesAddress],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body.html,
          },
          Text: {
            Charset: "UTF-8",
            Data: body.text,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: trusteesAddress,
    };

    const command = new SendEmailCommand(eParams);
    const result = await this.ses.send(command);
    return result;
  }

  welcomeEmail(name: string) {
    let context = {
      title: "Welcome to Teesside Hackspace!",
      preheader: "Welcome to Teesside Hackspace!",
      text: [
        "Welcome to Teesside Hackspace, " + name + "!",
        "To get 24/7 access to the space, you will need to attend an open evening and collect an RFID access card. If you're unable to attend an open evening, please contact us at trustees@teessidehackspace.org.uk and we will send you a card in the post.",
        "Feel free to claim an empty plastic storage box to keep your stuff in, and label it with your name.",
        "If you haven't already joined the discussion on Slack, " +
          link({
            href: "http://slacksignup.teessidehackspace.org.uk/",
            text: "click here",
          }) +
          " for an invitation.",
        "Please familiarise yourself with the " +
          link({
            href: "https://wiki.teessidehackspace.org.uk/wiki/Notes_for_Members",
            text: "Notes for Members",
          }) +
          ".",
      ],
    };
    return { html: template(context), text: textTemplate(context) };
  }

  membershipLapsed(name: string) {
    let context = {
      title: "Your membership to Teesside Hackspace has been cancelled",
      preheader: "Your membership to Teesside Hackspace has been cancelled",
      text: [
        "We're sorry to see you leave, " +
          name +
          ". Your membership has been cancelled, either directly or by cancelling your direct debit. If this is a mistake, please click below to reactivate your membership.",
      ],
      button: {
        label: "Reactivate Membership",
        link: "https://www.teessidehackspace.org.uk/members#changeSubscription",
        afterText: [
          "If Teesside Hackspace didn't live up to your expectations, please " +
            link({ href: "mailto:" + trusteesAddress, text: "email us" }) +
            " and let us know how we can improve.",
        ],
      },
    };
    return { html: template(context), text: textTemplate(context) };
  }
}
