"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@/hooks/use-chat"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [copied, setCopied] = useState<number | null>(null)
  // Start with the decoy view shown by default
  const [showDecoy, setShowDecoy] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDecoy((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Set page title
  useEffect(() => {
    document.title = "Clever | Portal"

    // Add favicon
    const link = (document.querySelector("link[rel~='icon']") as HTMLLinkElement) || document.createElement("link")
    link.type = "image/jpeg"
    link.rel = "icon"
    link.href =
      "https://resources.finalsite.net/images/f_auto,q_auto/v1689877141/mooreschoolscom/emadd6nvplrnh1vsswjf/Clever-Logo.jpg"
    document.head.appendChild(link)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await handleSubmit(e)

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const copyToClipboard = (text: string, index: number) => {
    // Extract only the answer part (between "**Answer:**" and the next blank line)
    const answerMatch = text.match(/\*\*Answer:\*\*\s*\n(.*?)(\n\n|\n$|$)/s)
    const answerText = answerMatch ? answerMatch[1].trim() : text

    navigator.clipboard.writeText(answerText)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  if (showDecoy) {
    return (
      <div className="w-full h-screen">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-SCarOLqNwyc9CyEUu0CYMOeKMyypXF.png"
          alt="Learning Management System"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-gray-200">
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4">
        <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
          <span>Study Notes</span>
          <span className="text-xs opacity-50">Press ESC to switch views</span>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 rounded-md bg-gray-800 p-2">
          {messages.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">Enter your question...</div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded text-sm ${
                      message.role === "user" ? "bg-gray-700 ml-8" : "bg-gray-900 border border-gray-700 mr-8"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="whitespace-pre-wrap math-content"
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />

                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-gray-300"
                          onClick={() => copyToClipboard(message.content, index)}
                        >
                          {copied === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700 mr-8 text-sm"
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onSubmit} className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="resize-none bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-600 h-24"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  onSubmit(e)
                }
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 h-auto"
          >
            Send
          </Button>
        </form>
      </div>
    </main>
  )
}

