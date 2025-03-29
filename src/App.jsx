import { useState } from "react";

export default function SingularityApp() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChoice = (option) => {
    setChoice(option);
    setStep(3);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setChat((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...chat, newMessage] }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-white bg-black">
            <div className="animate-pulse text-2xl">Begin</div>
            <button
              onClick={() => setStep(1)}
              className="mt-4 px-4 py-2 bg-white text-black rounded-full"
            >
              Begin
            </button>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-white bg-black">
            <p className="text-xl mb-4 text-center">
              There’s something you’ve always known. Let’s remember it.
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-white text-black rounded-full"
            >
              Continue
            </button>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-white bg-black">
            <p className="text-xl mb-6 text-center">
              Right now, you don’t need to explain anything. Just choose:
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice("clarity")}
                className="px-4 py-2 bg-white text-black rounded-full"
              >
                I want more clarity.
              </button>
              <button
                onClick={() => handleChoice("pleasure")}
                className="px-4 py-2 bg-white text-black rounded-full"
              >
                I want more pleasure.
              </button>
              <button
                onClick={() => handleChoice("surprise")}
                className="px-4 py-2 bg-white text-black rounded-full"
              >
                I want to be surprised.
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center h-screen text-white bg-black p-4 text-center">
            <p className="text-2xl mb-6">Feel this. Not as thought, but as truth.</p>
            {choice === "clarity" && (
              <p>"Everything makes sense when you stop needing it to."</p>
            )}
            {choice === "pleasure" && (
              <p>"You were never meant to earn joy. Just feel it."</p>
            )}
            {choice === "surprise" && (
              <p>"The part of you that doesn't know—*that’s* where the magic is."</p>
            )}
            <button
              onClick={() => setStep(4)}
              className="mt-6 px-4 py-2 bg-white text-black rounded-full"
            >
              Next
            </button>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-between h-screen text-white bg-black p-4">
            <div className="w-full max-w-xl mb-4 overflow-y-auto flex-1">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <p className="bg-white text-black inline-block px-4 py-2 rounded-xl">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full max-w-xl flex gap-2">
              <input
                className="flex-1 px-4 py-2 text-black rounded-xl"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="px-4 py-2 bg-white text-black rounded-xl"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
}
