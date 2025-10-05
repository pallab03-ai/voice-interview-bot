import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Mic, MicOff, Loader2, Volume2, User } from "lucide-react";

const VoiceBot = () => {
  // State management
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [browserSupported, setBrowserSupported] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState("en-US"); // Default to English
  const [conversationHistory, setConversationHistory] = useState([]); // Memory feature

  // Language options (memoized to prevent re-creation)
  const languages = useMemo(
    () => ({
      "en-US": { name: "English", voice: "en-US", flag: "🇺🇸" },
      "hi-IN": { name: "हिंदी (Hindi)", voice: "hi-IN", flag: "🇮🇳" },
      "bn-IN": { name: "বাংলা (Bengali)", voice: "bn-IN", flag: "🇧🇩" },
    }),
    []
  );

  // Refs for speech recognition
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const conversationEndRef = useRef(null); // For auto-scroll to bottom

  // Text-to-speech function
  const speakResponse = useCallback(
    (text, lang) => {
      if (!text) return;

      try {
        // Cancel any ongoing speech
        if (synthRef.current) {
          synthRef.current.cancel();
        }

        // Wait a bit after cancel to avoid race conditions
        setTimeout(() => {
          // Load voices
          const voices = synthRef.current.getVoices();

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.lang = lang || language; // Use provided language or current selection

          // Select a voice for the specified language
          const targetLang = lang || language;

          // Try to find a voice matching the language
          if (voices.length > 0) {
            const langCode = targetLang.split("-")[0]; // Get 'hi', 'bn', or 'en'

            // First, try to find ANY voice for the target language
            // This is more reliable than searching for male-specific voices
            let selectedVoice = voices.find((voice) =>
              voice.lang.startsWith(langCode)
            );

            // If we have multiple voices for this language, prefer male voices
            if (selectedVoice) {
              const allLangVoices = voices.filter((voice) =>
                voice.lang.startsWith(langCode)
              );

              if (allLangVoices.length > 1) {
                const maleVoice = allLangVoices.find(
                  (voice) =>
                    voice.name.toLowerCase().includes("male") ||
                    voice.name.toLowerCase().includes("man") ||
                    voice.name.toLowerCase().includes("david") ||
                    voice.name.toLowerCase().includes("mark") ||
                    voice.name.toLowerCase().includes("ravi") ||
                    voice.name.toLowerCase().includes("hemant") ||
                    voice.name.toLowerCase().includes("prabhat") ||
                    voice.name.toLowerCase().includes("daniel") ||
                    voice.name.toLowerCase().includes("alex") ||
                    voice.name.toLowerCase().includes("george")
                );

                if (maleVoice) {
                  selectedVoice = maleVoice;
                }
              }
            }

            if (selectedVoice) {
              utterance.voice = selectedVoice;
            }
          }

          utterance.onstart = () => {
            setIsSpeaking(true);
            setError(""); // Clear any previous errors
          };

          utterance.onend = () => {
            setIsSpeaking(false);
          };

          utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event.error);
            setIsSpeaking(false);
            // Ignore cancellation errors as they're intentional
            if (event.error !== "canceled" && event.error !== "interrupted") {
              // Don't show error to user for minor issues
            }
          };

          if (synthRef.current) {
            synthRef.current.speak(utterance);
          }
        }, 50); // Small delay after cancel
      } catch (err) {
        console.error("Error in speakResponse:", err);
        setIsSpeaking(false);
        // Don't show speech errors to user - text is already displayed
      }
    },
    [language]
  );

  // Handle question submission to API
  const handleQuestion = useCallback(
    async (question) => {
      setError("");
      setIsLoading(true);

      try {
        // Use local API server for development, Vercel API for production
        const apiUrl =
          process.env.NODE_ENV === "production"
            ? "/api/chat"
            : "http://localhost:3001/api/chat";

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            language: languages[language].name,
            conversationHistory, // Send conversation memory
          }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setResponse(data.answer);
        speakResponse(data.answer, languages[language].voice);

        // Update conversation history
        setConversationHistory((prev) => [
          ...prev,
          { role: "user", content: question },
          { role: "assistant", content: data.answer },
        ]);

        // Clear text input after successful response
        setTextInput("");
      } catch (err) {
        console.error("Error calling API:", err);
        setError(`Failed to get response: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [speakResponse, language, languages, conversationHistory]
  );

  // Auto-scroll to bottom when conversation history updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      synthRef.current.getVoices();
    };

    loadVoices();

    // Some browsers load voices asynchronously
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, []);

  // Check browser compatibility and setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupported(false);
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language; // Use selected language

    // Handle speech recognition results
    recognition.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setTranscript(transcriptText);
      setTextInput(transcriptText); // Also fill the text input field
      setIsListening(false);
      handleQuestion(transcriptText);
    };

    // Handle speech recognition errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone access denied. Please enable microphone permissions."
        );
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    // Handle speech recognition end
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [handleQuestion, language]);

  // Start listening
  const startListening = () => {
    if (!browserSupported || !recognitionRef.current) {
      setError("Speech recognition not available");
      return;
    }

    setError("");
    setTranscript("");
    setResponse("");

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Error starting recognition:", err);
      setError("Failed to start listening. Please try again.");
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setTranscript(textInput);
    handleQuestion(textInput);
    setTextInput("");
  };

  // Clear conversation memory
  const clearMemory = () => {
    setConversationHistory([]);
    setResponse("");
    setTranscript("");
    setError("");
  };

  // Get status message
  const getStatusMessage = () => {
    if (isListening) return "Listening... Speak now!";
    if (isLoading) return "Thinking...";
    if (isSpeaking) return "Speaking...";
    return "Click the microphone to ask a question";
  };

  // Get button color based on state
  const getButtonColor = () => {
    if (isListening) return "bg-red-500 hover:bg-red-600 animate-pulse";
    if (isLoading || isSpeaking) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-blue-500 hover:bg-blue-600";
  };

  return (
    <div className="voice-bot-container">
      <div className="voice-bot-header">
        <h1>Talk to Pallab Sar</h1>
        <p>Ask me about my background, skills, and experience</p>
      </div>

      {/* Language Selector */}
      <div className="language-selector">
        <label htmlFor="language-select">
          <Volume2 size={20} />
          <span>Language:</span>
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening || isSpeaking || isLoading}
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Message */}
      <div className="status-message">
        <p>{getStatusMessage()}</p>
      </div>

      {/* Microphone Button */}
      <div className="mic-button-container">
        <button
          className={`mic-button ${getButtonColor()}`}
          onClick={isListening ? stopListening : startListening}
          disabled={!browserSupported || isLoading}
        >
          {isLoading ? (
            <Loader2 className="icon spinning" />
          ) : isListening ? (
            <MicOff className="icon" />
          ) : isSpeaking ? (
            <Volume2 className="icon" />
          ) : (
            <Mic className="icon" />
          )}
        </button>
      </div>

      {/* Text Input Option */}
      <div className="text-input-container">
        <p className="or-text">OR type your question</p>
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading || isListening}
            className="text-input"
          />
          <button
            type="submit"
            disabled={isLoading || isListening || !textInput.trim()}
            className="text-submit-button"
          >
            {isLoading ? "Sending..." : "Ask"}
          </button>
        </form>
      </div>

      {/* Stop Speaking Button */}
      {isSpeaking && (
        <div className="stop-speaking-container">
          <button className="stop-button" onClick={stopSpeaking}>
            Stop Speaking
          </button>
        </div>
      )}

      {/* Clear Memory Button */}
      {conversationHistory.length > 0 && (
        <div className="clear-memory-container">
          <button
            className="clear-memory-button"
            onClick={clearMemory}
            disabled={isLoading || isListening}
          >
            🧹 Clear Memory ({conversationHistory.length / 2} messages)
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && !error.toLowerCase().includes("speech") && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Conversation Display - Full Chat History */}
      <div className="conversation-container">
        {conversationHistory.length > 0 ? (
          <>
            {conversationHistory.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.role === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-icon">
                  {msg.role === "user" ? (
                    <User size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-label">
                    {msg.role === "user" ? "You asked:" : "Pallab:"}
                  </div>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {/* Invisible div for auto-scroll */}
            <div ref={conversationEndRef} />
          </>
        ) : (
          // Show current question/response if no history yet
          <>
            {transcript && (
              <div className="message user-message">
                <div className="message-icon">
                  <User size={20} />
                </div>
                <div className="message-content">
                  <div className="message-label">You asked:</div>
                  <p>{transcript}</p>
                </div>
              </div>
            )}
            {response && (
              <div className="message bot-message">
                <div className="message-icon">
                  <Volume2 size={20} />
                </div>
                <div className="message-content">
                  <div className="message-label">Pallab:</div>
                  <p>{response}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Example Questions */}
      {conversationHistory.length === 0 && !transcript && !response && (
        <div className="example-questions">
          <h3>Try asking:</h3>
          <ul>
            <li>"Tell me about yourself"</li>
            <li>"What's your superpower?"</li>
            <li>"Why do you want to join 100x?"</li>
            <li>"What are you working to improve?"</li>
            <li>"Tell me about your experience with AI"</li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .voice-bot-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

        .voice-bot-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .voice-bot-header h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .voice-bot-header p {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .status-message {
          text-align: center;
          margin-bottom: 20px;
        }

        .status-message p {
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
        }

        .language-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .language-selector label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #667eea;
        }

        .language-selector select {
          padding: 10px 16px;
          font-size: 16px;
          border: 2px solid #667eea;
          border-radius: 8px;
          background: white;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          font-weight: 500;
        }

        .language-selector select:hover:not(:disabled) {
          border-color: #764ba2;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .language-selector select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .language-selector select option {
          padding: 10px;
        }

        .mic-button-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .mic-button {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .mic-button:hover {
          transform: scale(1.05);
        }

        .mic-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mic-button .icon {
          width: 50px;
          height: 50px;
          color: white;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .bg-blue-500 {
          background-color: #3b82f6;
        }
        .bg-blue-500:hover {
          background-color: #2563eb;
        }
        .bg-red-500 {
          background-color: #ef4444;
        }
        .bg-red-500:hover {
          background-color: #dc2626;
        }
        .bg-yellow-500 {
          background-color: #f59e0b;
        }
        .bg-yellow-500:hover {
          background-color: #d97706;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .text-input-container {
          max-width: 600px;
          margin: 0 auto 20px;
          text-align: center;
        }

        .or-text {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .text-input-form {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .text-input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .text-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .text-input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .text-input::placeholder {
          color: #9ca3af;
        }

        .text-submit-button {
          padding: 14px 30px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .text-submit-button:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .text-submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .text-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .stop-speaking-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .stop-button {
          padding: 10px 30px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .stop-button:hover {
          background-color: #dc2626;
        }

        .clear-memory-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .clear-memory-button {
          padding: 10px 24px;
          background-color: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.938rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clear-memory-button:hover:not(:disabled) {
          background-color: #7c3aed;
          transform: translateY(-2px);
        }

        .clear-memory-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          text-align: center;
        }

        .error-message p {
          color: #991b1b;
          margin: 0;
        }

        .conversation-container {
          margin: 30px 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 250px;
          width: 100%;
          overflow-y: auto;
          padding: 10px;
          background-color: #f9fafb;
          border-radius: 12px;
          scroll-behavior: smooth;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .conversation-container::-webkit-scrollbar {
          width: 8px;
        }

        .conversation-container::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }

        .conversation-container::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
        }

        .conversation-container::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        .message {
          display: flex;
          gap: 15px;
          padding: 20px;
          border-radius: 12px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-message {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .bot-message {
          background-color: #f0fdf4;
          border-left: 4px solid #22c55e;
        }

        .message-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .message-content {
          flex: 1;
        }

        .message-label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message-content p {
          margin: 0;
          line-height: 1.6;
          color: #1f2937;
        }

        .example-questions {
          background-color: #f9fafb;
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
        }

        .example-questions h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .example-questions ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .example-questions li {
          padding: 10px 0;
          color: #4b5563;
          font-size: 0.938rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .example-questions li:last-child {
          border-bottom: none;
        }

        @media (max-width: 640px) {
          .voice-bot-header h1 {
            font-size: 2rem;
          }

          .mic-button {
            width: 100px;
            height: 100px;
          }

          .mic-button .icon {
            width: 40px;
            height: 40px;
          }

          .message {
            padding: 15px;
          }

          .text-input-form {
            flex-direction: column;
            gap: 8px;
          }

          .text-submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceBot;
