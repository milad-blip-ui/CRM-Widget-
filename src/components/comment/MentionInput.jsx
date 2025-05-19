// components/MentionInput.jsx
import { useState, useEffect, useRef } from "react";
import { fetchUsers } from "./mockUsers";
import UserAvatar from "./UserAvatar";

export default function MentionInput({ value = "", onChange}) {
  const [text, setText] = useState(value);
  const [caretPosition, setCaretPosition] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync with parent-controlled value
  useEffect(() => {
    if (value !== text) setText(value);
  }, [value]);

  // Handle input changes
  const handleInput = (e) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);

    const cursorPos = e.target.selectionStart;
    setCaretPosition(cursorPos);

    const beforeCursor = newText.slice(0, cursorPos);
    const mentionMatch = beforeCursor.match(/(?:^|\s)@([a-zA-Z0-9_.-]*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Fetch users with debounce
  useEffect(() => {
    if (!showSuggestions || mentionQuery === undefined) return;

    const timeout = setTimeout(async () => {
      const results = await fetchUsers(mentionQuery);
      setSuggestions(results);
      setSelectedIdx(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [mentionQuery, showSuggestions]);

  // Insert selected mention
  const insertMention = (user) => {
    const beforeCursor = text.slice(0, caretPosition);
    const afterCursor = text.slice(caretPosition);

    const mentionStart = beforeCursor.lastIndexOf(`@${mentionQuery}`);
    const newText =
      beforeCursor.slice(0, mentionStart) +
      `@${user.username} ` +
      afterCursor;

    setText(newText);
    onChange(newText);

    setCaretPosition(mentionStart + user.username.length + 2);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIdx((prev) => (prev + 1) % suggestions.length);
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIdx(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          break;

        case "Enter":
          e.preventDefault();
          if (suggestions[selectedIdx]) {
            insertMention(suggestions[selectedIdx]);
          }
          break;

        case "Escape":
          setShowSuggestions(false);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSuggestions, suggestions, selectedIdx]);

  return (
    <div className="relative inline-block w-full bg-white">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        placeholder="Type @ to mention someone..."
        className="w-full input-box min-h-[20px] font-roboto"
      />

      {/* Mention Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute bottom-[70px] z-50 max-h-60 w-64 overflow-auto rounded-md border bg-white shadow-lg"
        >
          {suggestions.map((user, idx) => (
            <div
              key={user.id}
              className={`flex cursor-pointer items-center p-2 hover:bg-gray-100 ${
                idx === selectedIdx ? "bg-indigo-50" : ""
              }`}
              onClick={() => insertMention(user)}
            >
              <UserAvatar user={user} size={6} />
              <div className="ml-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}