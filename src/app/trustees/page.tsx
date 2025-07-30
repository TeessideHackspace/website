import { redirect } from "next/navigation";
import Header from "../components/header/header";
import Link from "next/link";
import { MembershipApiService } from "../lib/service/service";
import { getSession } from "../api/auth/auth";
import { useEffect } from "react";
export default async function Page() {
  const user = await getSession();
  if (!user) {
    redirect("/");
  }
  console.log("user:", user);
  if (user.roles.indexOf("trustee") === -1) {
    redirect("/");
  }

  const serverLinks = [
    {
      name: "Portainer",
      description: "Manage docker containers",
      url: "https://portainer.server.teessidehackspace.org.uk",
    },
    {
      name: "Keycloak",
      description: "User / Auth Management",
      url: "https://auth.teessidehackspace.org.uk",
    },
    {
      name: "Nodered",
      description: "Automation workflows",
      url: "https://nodered.server.teessidehackspace.org.uk",
    },
    {
      name: "Synapse Admin",
      description: "Matrix Admin Panel - Role, Room Management etc",
      url: "https://admin.matrix.teessidehackspace.org.uk",
    },
    {
      name: "PGAdmin",
      description: "Postgres Database Web Client",
      url: "https://pgadmin.server.teessidehackspace.org.uk",
    },
  ];

  const spaceInfraLinks = [
    {
      name: "Portainer",
      description: "Manage docker containers",
      url: "https://portainer.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Nodered",
      description: "Automation workflows",
      url: "https://nodered.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Frigate",
      description: "CCTV Monitoring",
      url: "https://frigate.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Home Assistant",
      description: "IoT device automation",
      url: "https://homeassistant.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Traefik",
      description: "Reverse proxy gateway",
      url: "https://traefik.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Opnsense Router",
      description: "Main router - DHCP, Port Forwarding, VLANs etc",
      url: "https://opnsense.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Cisco Switch",
      description: "Cisco PoE Gigabit Switch",
      url: "https://cisco-switch.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Cisco Access Point",
      description: "Cisco Wireless Access Point",
      url: "https://cisco-ap.infrastructure.teessidehackspace.org.uk",
    },
    {
      name: "Automation Panel",
      description: "ESP32 Running ESPHome, triggers relays including door lock",
      url: "https://automationpanel.infrastructure.teessidehackspace.org.uk/",
    },
    {
      name: "Rear Door Sensor",
      description: "ESP32 with rear door closed sensor",
      url: "https://reardoor.infrastructure.teessidehackspace.org.uk/",
    },
    {
      name: "Quartz Heater",
      description: "ESP32 controlling quartz heater",
      url: "https://quartzheater.infrastructure.teessidehackspace.org.uk/",
    },
    {
      name: "Doorbot",
      description: "Doorbot ESP32 (web UI not currently working?)",
      url: "https://doorbot.infrastructure.teessidehackspace.org.uk/",
    },
    {
      name: "Officejet printer",
      description: "HP Officejet",
      url: "https://officejet.infrastructure.teessidehackspace.org.uk/",
    },
    {
      name: "Escam CCTV Camera",
      description: "Old janky webui, doesn't work without flash",
      url: "https://escam.infrastructure.teessidehackspace.org.uk/",
    },
  ];

  const miscLinks = [
    {
      name: "Bitwarden",
      description: "Bitwarden password manager web vault",
      url: "https://vault.bitwarden.com/",
    },
  ];

  // const dhcpLeasesReq = await fetch(
  //   "https://opnsense-api.infrastructure.teessidehackspace.org.uk/api/dhcpv4/leases/search_lease",
  //   {
  //     headers: {
  //       Authorization: `Basic ${process.env.OPNSENSE_KEY}`,
  //     },
  //   }
  // );
  // const leasesJson = await dhcpLeasesReq.json();
  // console.log(leasesJson);

  return (
    <main className="container">
      <Header currentRoute="/trustees" />

      <div className="row hs-body">
        <div className="mb-8">
          <h5>CCTV (Static snapshot, refresh page to update)</h5>
          <div className="card-group">
            <div className="card">
              <iframe
                src="https://frigate.infrastructure.teessidehackspace.org.uk/api/front/latest.webp?height=400"
                width="100%"
                height="400px"
                style={{
                  transform: "rotate(180deg)",
                }}
              />
            </div>
            <div className="card">
              <iframe
                src="https://frigate.infrastructure.teessidehackspace.org.uk/api/back/latest.webp?height=400"
                width="100%"
                height="400px"
              />
            </div>
          </div>
        </div>

        <h3>Services & Infrastructure</h3>
        <div className="card-group">
          <div className="card">
            <div className="card-header">AWS Server</div>
            <ul className="list-group list-group-flush">
              {serverLinks.map((x, index) => (
                <li key={index} className="list-group-item">
                  <h5>
                    <a href={x.url}>{x.name}</a>
                  </h5>
                  <p>{x.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">Space Infrastructure</div>
            <ul className="list-group list-group-flush">
              {spaceInfraLinks.map((x, index) => (
                <li key={index} className="list-group-item">
                  <h5>
                    <a href={x.url}>{x.name}</a>
                  </h5>
                  <p>{x.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* <div>
          <h5>Wireless AP Clients</h5>
          <iframe
            src="https://cisco-ap.infrastructure.teessidehackspace.org.uk/ap_assoc.shtml"
            width="100%"
            height="400px"
          />
        </div> */}
        {/* <div>
          <h5>Cisco Switch</h5>
          <iframe
            src="https://cisco-switch.infrastructure.teessidehackspace.org.uk/xhome.htm"
            width="100%"
            height="400px"
          />
        </div> */}

        <div>
          <h5>Nodered UI</h5>
          <iframe
            src="https://nodered.server.teessidehackspace.org.uk/ui/"
            width="100%"
            height="800px"
          />
        </div>
        {/* <div>
          <h5>Home Assistant</h5>
          <iframe
            src="https://homeassistant.infrastructure.teessidehackspace.org.uk/trustee-website-embed/0"
            width="100%"
            height="300px"
          />
        </div> */}
      </div>
    </main>
  );
}
