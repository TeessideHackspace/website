export default function DoNotHackLabel(props: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}) {
  return (
    <div className="p-2 d-flex flex-column flex-grow-1">
      <div className="d-flex ">
        <img
          src="/logo.svg"
          className="flex-grow-1 "
          style={{
            maxWidth: 150,
          }}
        />
        <div
          style={{
            fontSize: 100,
            fontWeight: "bold",
          }}
          className="ms-4"
        >
          DO NOT HACK
        </div>{" "}
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <div
          style={{
            fontSize: 50,
          }}
          className="d-flex"
        >
          <strong>Name: </strong>
          <span className="text-center flex-grow-1">{props.name}</span>
        </div>

        <div
          style={{
            fontSize: 30,
          }}
          className="flex-grow-1"
        >
          {" "}
          <strong>Description: </strong>
          {props.description}
        </div>

        <div
          style={{
            fontSize: 30,
            display: "flex",
          }}
        >
          <div style={{ flex: "1" }}>
            <strong>Start: </strong>
            {props.startDate}
          </div>
          <div style={{ flex: "1" }}>
            <strong>End: </strong>
            {props.endDate}
          </div>
        </div>
      </div>
    </div>
  );
}
