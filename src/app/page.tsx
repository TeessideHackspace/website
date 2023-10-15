import FacebookFeed from "./components/facebook-feed";
import Header from "./components/header/header";
import SlackInvite from "./components/slackinvite";

export default function Home() {
  return (
    <main>
      <Header currentRoute="/" />

      <div className="card bg-light mb-3">
        <div className="card-body">
          <h5 className="card-title">
            Teesside Hackspace is a non-profit group running a
            community-operated workshop in Middlesbrough where members can come
            together to share tools and knowledge.
          </h5>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Get Involved</h3>
          <p>
            We hold{" "}
            <a href="https://wiki.teessidehackspace.org.uk/wiki/Weekly_Open_Evenings">
              public open evenings
            </a>{" "}
            every Tuesday from around 7pm at our space in{" "}
            <a href="https://wiki.teessidehackspace.org.uk/wiki/2D_Brighouse">
              Brighouse Business Village
            </a>
            .
          </p>
          <h3>Membership</h3>
          <p>
            Our members have a hand in the running of the organisation as well
            as 24/7 access to the space. Pay us what you think is fair —{" "}
            <a href="/members">join Teesside Hackspace.</a>
          </p>
        </div>
        <div className="col">
          <h3>Resources</h3>
          <ul>
            <li>
              <a href="https://wiki.teessidehackspace.org.uk/">The wiki</a>, for
              more about the space
            </li>
            <li>
              <a href="https://wiki.teessidehackspace.org.uk/wiki/Slack">
                Chat to us on Slack
              </a>
            </li>
            <li>
              <a href="/members">Become a member</a>
            </li>
            <li>
              <a href="/organisation">About the organisation</a>
            </li>
          </ul>
          <h3>Join us on Slack!</h3>
          <p>
            Come chat to us on{" "}
            <a href="https://wiki.teessidehackspace.org.uk/wiki/Slack">Slack</a>
            ! Enter your email address below to receive an invitation.
          </p>
          <SlackInvite />
        </div>
        <div className="col">
          <h3>Social</h3>
          <FacebookFeed />
        </div>
      </div>
    </main>
  );
}
