export default function Page({ children, className = "", sideBar = false }) {
  return (
    <div className={"page content-wrapper" + " " + className}>
      <div className="container">
        <div className="rounded bg-white mt-5 mb-5 container p-3">
          <div className="row">
            <div className={sideBar ? "col-xl-8 col-sm-16 mb-3" : "col-16"}>
              {children}
            </div>
            {sideBar ? <div className="col-xl-4">{sideBar}</div> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
