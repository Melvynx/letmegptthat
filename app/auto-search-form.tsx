import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export const AutoSearchForm = (props: { query: string }) => {
  const [value, setValue] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [animationStep, setAnimationStep] = useState<
    "idle" | "moving" | "typing" | "clicking" | "done"
  >("idle");
  const [typingIndex, setTypingIndex] = useState(0);
  const [showTypingCursor, setShowTypingCursor] = useState(false);

  const [inputRef, inputBounds] = useMeasure();
  const [buttonRef, buttonBounds] = useMeasure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start animation after component mounts
  useEffect(() => {
    if (props.query && inputBounds.width > 0) {
      const timer = setTimeout(() => {
        setShowCursor(true);
        setAnimationStep("moving");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [props.query, inputBounds.width]);

  // Handle cursor movement to input
  useEffect(() => {
    if (animationStep === "moving" && inputBounds.width > 0) {
      const targetX = inputBounds.left + inputBounds.width / 2;
      const targetY = inputBounds.top + inputBounds.height / 2;

      setCursorPosition({ x: targetX, y: targetY });

      const timer = setTimeout(() => {
        setAnimationStep("typing");
        setShowTypingCursor(true);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [animationStep, inputBounds]);

  // Handle typing animation
  useEffect(() => {
    if (animationStep === "typing" && typingIndex < props.query.length) {
      const timer = setTimeout(() => {
        setValue(props.query.slice(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 100 + Math.random() * 100); // Variable typing speed

      return () => clearTimeout(timer);
    } else if (
      animationStep === "typing" &&
      typingIndex >= props.query.length
    ) {
      const timer = setTimeout(() => {
        setShowTypingCursor(false);
        setAnimationStep("clicking");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [animationStep, typingIndex, props.query]);

  // Handle cursor movement to button
  useEffect(() => {
    if (animationStep === "clicking" && buttonBounds.width > 0) {
      const targetX = buttonBounds.left + buttonBounds.width / 2;
      const targetY = buttonBounds.top + buttonBounds.height / 2;

      setCursorPosition({ x: targetX, y: targetY });

      const timer = setTimeout(() => {
        setAnimationStep("done");

        const url = new URL("https://chat.openai.com");
        url.searchParams.set("q", props.query);
        window.location.href = url.toString();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [animationStep, buttonBounds]);

  // Blinking cursor effect for typing
  useEffect(() => {
    if (showTypingCursor) {
      const interval = setInterval(() => {
        setShowTypingCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showTypingCursor, animationStep]);

  return (
    <>
      {/* Animated cursor */}
      {showCursor && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-2000 ease-out"
          style={{
            left: cursorPosition.x - 0,
            top: cursorPosition.y - 0,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src="/cursor.png"
            alt="cursor"
            className="w-6 h-6 object-contain"
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
            }}
          />
        </div>
      )}

      <div className="flex mx-8 items-center relative gap-12 flex-col justify-center min-h-full">
        <div className="w-full relative">
          <div className={cn("w-full max-w-4xl mx-auto")}>
            {/* Main heading */}
            <div className="text-center mb-8">
              <h1 className="lg:text-4xl text-3xl font-normal text-white/90 mb-2">
                What can I help with?
              </h1>
            </div>

            {/* Input container */}
            <div className="relative">
              <div
                ref={inputRef}
                className="relative flex-col flex items-center bg-card rounded-3xl shadow-lg overflow-hidden"
              >
                <div className="relative w-full">
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 w-full bg-transparent text-foreground placeholder:text-muted-foreground px-6 py-4 text-base resize-none outline-none min-h-[56px] max-h-32"
                    rows={1}
                    placeholder="Ask anything"
                    style={{
                      height: "auto",
                      minHeight: "56px",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height =
                        Math.min(target.scrollHeight, 128) + "px";
                    }}
                  />
                </div>

                {/* Send button */}
                <div className="pr-3 pb-3 w-full flex justify-end">
                  <Button
                    ref={buttonRef}
                    type="submit"
                    size="icon"
                    className={cn(
                      "size-8 rounded-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 transition-all duration-200",
                      animationStep === "clicking" && "scale-95"
                    )}
                  >
                    <ArrowUp strokeWidth={3} className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Card className="w-full p-4 absolute left-0 right-0 -bottom-20">
            {animationStep === "idle" ||
            animationStep === "moving" ||
            animationStep === "typing" ? (
              <p>Step 1 : Type your question</p>
            ) : null}
            {animationStep === "clicking" ? (
              <p>Step 2 : Click the button to submit your question</p>
            ) : null}
            {animationStep === "done" ? <p>Wasn't that easy?</p> : null}
          </Card>
        </div>
      </div>
    </>
  );
};
