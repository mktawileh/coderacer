import React from "react";
import L from "next/link";

function Link({ to = "", className = "", children }) {
  return (
    <L href={to || ""}>
      <a className={className}>{children}</a>
    </L>
  );
}

export default Link;
