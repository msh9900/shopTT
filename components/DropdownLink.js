import React from "react";
import Link from "next/link";

export default function DropdownLink(props) {
  let { href, children } = props;
  return (
    <Link className="dropdown-link" href={href}>
      {children}
    </Link>
  );
}
