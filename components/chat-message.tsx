"use client"

import { useState } from "react"
import { User, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex gap-3 p-4 rounded-lg mb-4", role === "user" ? "bg-gray-100" : "bg-primary/10")}>
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            role === "user" ? "bg-gray-300" : "bg-primary/20",
          )}
        >
          {role === "user" ? <User className="h-4 w-4 text-gray-600" /> : <Bot className="h-4 w-4 text-primary" />}
        </div>
      </div>

      <div className="flex-1 math-content">{content}</div>

      {role === "assistant" && (
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}

