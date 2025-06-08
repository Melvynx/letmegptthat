"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AutoSearchForm } from "./auto-search-form";
import { ChatGPTInput } from "./chatgpt-input";

export function PageApp() {
  // <Suspense />
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  if (query) return <AutoSearchForm query={query} />;

  return <StarterForm />;
}

const StarterForm = () => {
  const [value, setValue] = useState("");
  const [submitValue, setSubmitValue] = useState("");

  const url = new URL(window.location.href);
  url.searchParams.set("q", submitValue);

  return (
    <div className="flex mx-8 items-center gap-12 flex-col justify-center min-h-full">
      <div className="w-full relative">
        <ChatGPTInput
          value={value}
          onChange={setValue}
          onSubmit={() => setSubmitValue(value)}
        />
        {submitValue ? (
          <Card className="w-full absolute left-0 right-0 gap-2 -bottom-30 p-4">
            <p className="text-muted-foreground text-sm">
              Share the link to your friends
            </p>
            <Input value={url.toString()} />
          </Card>
        ) : null}
      </div>
    </div>
  );
};
