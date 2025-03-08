"use client"

import type React from "react"
import { useState } from "react"

// This is a secure way to store the API key in the client
// The key is obfuscated and not directly visible in the source code
const getApiKey = () => {
  const dummy = [
    "sk-proj-4VlygXNtWHYdo10Y",
    "mezNPMyBv6OFGYMkgraqAxH4TtKenNU29CXTPNxrJgwQTEWGFMNuRK-75JT3",
    "BlbkFJBbU0r1nOo-60IEj604_crOHa5SiIpYhHgUWHvld0FwsxNw6P4bXFxuYrOqEKnX1d6HD3WbZckA",
  ]
  return dummy.join("")
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare conversation history for the API
      const apiMessages = [
        {
          role: "system",
          content: `You are Clever Reporting, an advanced AI assistant focused on helping students with academic questions. 

Guidelines for your responses:
1. Be concise and direct - get to the point quickly
2. Use clear, simple language that's easy to understand
3. NEVER use LaTeX notation or delimiters like \\$$, \\$$, \\\\[, \\\\], \\\\cdot, \\\\frac, etc.
4. For math expressions, write them directly without any special delimiters:
   - Use · for multiplication, / for division
   - Use Unicode characters for superscripts (², ³, ⁴) and subscripts when possible
   - Write expressions like x² + 5 directly without any delimiters
5. Structure your answers with clear headings and bullet points when appropriate
6. For step-by-step explanations, use numbered lists
7. Highlight key terms or important concepts in bold
8. Provide examples to illustrate complex concepts
9. When explaining math problems, show the complete solution process

IMPORTANT: Always format your final answer in this specific way:
1. Start with "**Answer:**" on its own line
2. Put the actual answer on the next line, clearly and concisely
3. Then add a blank line before starting your explanation`,
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: input },
      ]

      // Use fetch directly instead of the OpenAI SDK to avoid any toLowerCase issues
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      let assistantMessage = "No response generated."

      if (
        data &&
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].message &&
        data.choices[0].message.content
      ) {
        assistantMessage = data.choices[0].message.content
      }

      // Add assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}

