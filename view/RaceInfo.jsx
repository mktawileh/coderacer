export default function RaceInfo({ code, show = true }) {
  if (!show) return "";
  return (
    <div>
      <div className="finished-header mt-3">
        <div className=" p-3">
          <h5>
            Code title: <b>{code.title}</b>
          </h5>
          {code.info ? (
            <>
              <h5>Note: </h5>
              <p>{code.info}</p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
