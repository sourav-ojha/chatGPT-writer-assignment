import React, { useEffect, useState, useCallback } from "react";
import generateIcon from "@/assets/generate.svg";
import insertIcon from "@/assets/insert.svg";
import regenerateIcon from "@/assets/regenerate.svg";
import wandIcon from "@/assets/wand.svg";
import Button from "./Button";
import "@/assets/global.css";

// Define types for conversation items
type ConversationItem = {
  text: string;
  sender: "ai" | "user";
};

// Utility function to create the button
const createBtn = (onClick: () => void): HTMLButtonElement => {
  const btn = document.createElement("button");
  btn.id = "ai-btn";
  btn.type = "button";
  Object.assign(btn.style, {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    display: "grid",
    placeItems: "center",
    borderRadius: "100%",
    width: "32px",
    height: "32px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "0.1s",
  });

  const icon = document.createElement("img");
  icon.src = wandIcon;
  btn.appendChild(icon);

  btn.addEventListener("click", onClick);
  return btn;
};

const App: React.FC = () => {
  const [popup, setPopup] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>("");

  const generateResponse = useCallback((): string => {
    return "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
  }, []);

  const handleConversation = useCallback(
    (text: string, sender: "ai" | "user") => {
      setConversation((prevConversation) => [
        ...prevConversation,
        { text, sender },
      ]);
    },
    []
  );

  const handleGenerate = useCallback(() => {
    if (!inputPrompt) {
      return alert("Please enter a prompt");
    }

    handleConversation(inputPrompt, "user");
    setInputPrompt("");

    const response = generateResponse();
    handleConversation(response, "ai");
  }, [inputPrompt, generateResponse, handleConversation]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputPrompt(event.target.value);
  };

  const handleInsert = (): void => {
    const response = conversation[conversation.length - 1]?.text;
    const targetElement = document.querySelector<HTMLParagraphElement>(
      ".msg-form__contenteditable p"
    );

    if (targetElement && response) {
      targetElement.textContent = response;
    }

    handleClosePopup();
  };

  const handleClosePopup = () => {
    setPopup(false);
    setConversation([]);
  };

  const handleStopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const targetElement = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    );
    if (!targetElement) return;

    const handleClick = () => {
      setPopup(true);
      console.log("btn cliked");
    };
    let btn: HTMLButtonElement | null = null;

    const createAndAppendButton = () => {
      if (!btn) {
        btn = createBtn(handleClick);
        targetElement.appendChild(btn);
        console.log("created and appended");
      } else {
        console.log("btn already created");
      }
    };

    const observer = new MutationObserver(() => {
      const isFocused =
        targetElement.getAttribute("data-artdeco-is-focused") === "true";
      if (isFocused && !btn) {
        createAndAppendButton();
      } else if (!isFocused && btn) {
        setTimeout(() => {
          btn?.remove();
          btn = null;
        }, 100);
      }
    });

    observer.observe(targetElement, { attributes: true });

    // Immediately check the focus state on mount
    if (targetElement.getAttribute("data-artdeco-is-focused") === "true") {
      createAndAppendButton();
    }

    return () => {
      observer.disconnect();
      if (btn) btn.remove();
    };
  }, []);

  return popup ? (
    <div
      className="fixed inset-0 top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-gray-300/30"
      onClick={handleClosePopup}
    >
      <div
        className="z-50 w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg"
        onClick={handleStopPropagation}
      >
        {conversation.map(({ text, sender }, index) => (
          <div
            key={index}
            className={`flex items-center p-2 w-full text-black ${
              sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-center py-2 px-4 rounded-lg w-fit max-w-[80%] ${
                sender === "user" ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              {text}
            </div>
          </div>
        ))}
        <input
          className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg"
          placeholder="Your prompt"
          value={inputPrompt}
          onChange={handleInputChange}
        />
        {conversation.length === 0 ? (
          <div className="flex justify-end gap-4 mt-4">
            <Button
              icon={generateIcon}
              title="Generate"
              onClick={handleGenerate}
            />
          </div>
        ) : (
          <div className="flex justify-end gap-4 mt-4">
            <Button
              icon={insertIcon}
              title="Insert"
              onClick={handleInsert}
              variant="outline"
            />
            <Button icon={regenerateIcon} title="Regenerate" />
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default App;
