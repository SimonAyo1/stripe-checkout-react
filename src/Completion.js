function Completion(props) {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div class="card" style={{ textAlign: "center" }}>
          <div
            style={{
              borderRadius: "200px",
              height: "200px",
              width: "200px",
              background: "#F8FAF5",
              margin: "0 auto",
            }}
          >
            <i class="checkmark">✓</i>
          </div>
          <h1>Success</h1>
          <p>We received your payment</p>
        </div>
      </div>
    </>
  );
}

export default Completion
