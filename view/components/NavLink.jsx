import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function NavLink({ to = "", active = "active", className = "", children }) {
  const router = useRouter();

  className = className.split(" ") || [];
  className.push("nav-link");
  if (router.pathname == to) {
    className.push(active);
  }

  return (
    <Link href={to || ""}>
      <a className={className.join(" ")}>{children}</a>
    </Link>
  );
}

export default NavLink;
