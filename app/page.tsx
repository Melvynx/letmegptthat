import { Suspense } from "react";
import { PageApp } from "./page-app";

export default function Home() {
  return (
    <Suspense>
      {" "}
      <PageApp />
    </Suspense>
  );
}
