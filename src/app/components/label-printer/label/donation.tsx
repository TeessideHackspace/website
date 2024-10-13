export default function DonationLabel(props: { name: string }) {
  return (
    <div className="p-2 d-flex flex-column flex-grow-1">
      <div className="d-flex ">
        <img
          src="/logo.svg"
          style={{
            maxWidth: 150,
          }}
        />
        <div
          style={{
            fontSize: 100,
            fontWeight: "bold",
          }}
          className="ms-4 flex-grow-1 text-center"
        >
          DONATION
        </div>{" "}
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <div
          style={{
            fontSize: 50,
          }}
          className="text-center"
        >
          <strong>From: </strong>
          {props.name}
        </div>
      </div>
    </div>
  );
}
