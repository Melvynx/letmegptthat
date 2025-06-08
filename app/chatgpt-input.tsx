"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import * as React from "react";

interface ChatGPTInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export function ChatGPTInput({
  value,
  onChange,
  onSubmit,
  placeholder = "What can I help with?",
  className,
}: ChatGPTInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && onSubmit) {
        onSubmit();
      }
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* Main heading */}
      <div className="text-center mb-8">
        <h1 className="lg:text-4xl text-3xl font-normal text-white/90 mb-2">
          What can I help with?
        </h1>
      </div>

      {/* Input container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex-col flex items-center bg-card rounded-3xl shadow-lg overflow-hidden">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 w-full bg-transparent text-foreground placeholder:text-muted-foreground px-6 py-4 text-base resize-none outline-none min-h-[56px] max-h-32"
            rows={1}
            style={{
              height: "auto",
              minHeight: "56px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />

          {/* Send button */}
          <div className="pr-3 pb-3 w-full flex justify-end">
            <Button
              type="submit"
              size="icon"
              // disabled={!value.trim()}
              className="size-8 rounded-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50"
            >
              <ArrowUp strokeWidth={3} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
