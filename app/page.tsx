"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Bell,
  ChevronDown,
  Grid,
  MessageSquare,
  Heart,
  X,
  Send,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { formatMessage, extractAnswer } from "./utils/formatMessage"

export default function CleverDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(true) // Set to true by default
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<
    { type: "user" | "bot"; content: string; timestamp: number; id: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFullSize, setIsFullSize] = useState(false)
  const resizableRef = useRef<HTMLDivElement>(null)
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null)
  const [initialSize, setInitialSize] = useState<{ width: number; height: number } | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsChatOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [message])

  // Handle message expiration
  useEffect(() => {
    const now = Date.now()
    const interval = setInterval(() => {
      setChatMessages((prevMessages) =>
        prevMessages.filter((msg) => {
          // Keep bot messages and recent user messages (less than 25 seconds old)
          return msg.type === "bot" || now - msg.timestamp < 25000
        }),
      )
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [])

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedMessageId) {
      const timeout = setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copiedMessageId])

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !initialPos || !initialSize || !resizableRef.current) return

      const width = initialSize.width - (e.clientX - initialPos.x)
      const height = initialSize.height + (e.clientY - initialPos.y)

      if (width > 300 && height > 200) {
        resizableRef.current.style.width = `${width}px`
        const chatContent = resizableRef.current.querySelector(".chat-content") as HTMLElement
        if (chatContent) {
          chatContent.style.height = `${height - 120}px` // Adjust for header and input
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setInitialPos(null)
      setInitialSize(null)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, initialPos, initialSize])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!resizableRef.current) return

    setIsResizing(true)
    setInitialPos({ x: e.clientX, y: e.clientY })
    setInitialSize({
      width: resizableRef.current.offsetWidth,
      height: resizableRef.current.offsetHeight,
    })
  }

  const toggleFullSize = () => {
    setIsFullSize(!isFullSize)
  }

  const copyAnswer = (messageId: string, content: string) => {
    const answer = extractAnswer(content)
    if (answer) {
      navigator.clipboard.writeText(answer)
      setCopiedMessageId(messageId)
    }
  }

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return

    // Generate a unique ID for the message
    const messageId = Date.now().toString()

    // Add user message with timestamp
    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: message,
        timestamp: Date.now(),
        id: `user-${messageId}`,
      },
    ])

    // Set loading state
    setIsLoading(true)

    try {
      // Use AI SDK to generate response
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: message,
        system: `You are Clever Reporting, an advanced AI assistant focused on helping students with academic questions. 

Guidelines for your responses:
1. Be concise and direct - get to the point quickly
2. Use clear, simple language that's easy to understand
3. NEVER use LaTeX notation or delimiters like \$$, \$$, \\[, \\], \\cdot, \\frac, etc.
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
3. Then add a blank line before starting your explanation

Example of correct formatting for expanding (x² + 3)(x² + 5):

**Answer:**
x⁴ + 8x² + 15

Explanation:
To expand the given expression, we can use the distributive property:

First: Multiply the first terms in each parenthesis: x² * x² = x⁴
Outer: Multiply the outer terms in the expression: x² * 5 = 5x²
Inner: Multiply the inner terms in the expression: 3 * x² = 3x²
Last: Multiply the last terms in each parenthesis: 3 * 5 = 15

Now, combine all the terms together:
x⁴ + 5x² + 3x² + 15

Finally, simplify by combining the like terms (5x² and 3x²):
x⁴ + 8x² + 15

Format your responses with proper spacing and organization. Make your explanations as clear and helpful as possible, similar to how an expert tutor would explain concepts.`,
      })

      // Add AI response with timestamp
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: text,
          timestamp: Date.now(),
          id: `bot-${messageId}`,
        },
      ])
    } catch (error) {
      console.error("Error generating response:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: Date.now(),
          id: `error-${messageId}`,
        },
      ])
    } finally {
      setIsLoading(false)
      setMessage("") // Clear the input field

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-500 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold">
            Clever
          </Link>
          <span className="hidden sm:inline-block">Beachside High School</span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#" className="flex flex-col items-center text-xs">
              <Grid className="h-5 w-5 mb-1" />
              <span>Portal</span>
            </Link>
            <Link href="#" className="flex flex-col items-center text-xs">
              <MessageSquare className="h-5 w-5 mb-1" />
              <span>Messages</span>
            </Link>
          </div>

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search" className="pl-10 pr-4 py-1 rounded-md text-black w-48 md:w-64" />
          </div>

          <button className="p-1">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-1">
            <span className="hidden sm:inline-block">Logged in</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 p-4 hidden md:block">
          <nav className="space-y-4">
            <Link href="#" className="block text-blue-600 font-medium">
              Favorite resources
            </Link>
            <Link href="#" className="block text-blue-600 font-medium">
              Teacher Pages
            </Link>
            <Link href="#" className="block text-blue-600 font-medium">
              Textbooks
            </Link>
            <Link href="#" className="block text-blue-600 font-medium">
              Student Applications
            </Link>
            <Link href="#" className="block text-blue-600 font-medium">
              Web Links
            </Link>
            <Link href="#" className="block text-blue-600 font-medium">
              ELL Resources
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Favorite Resources Section */}
          <section className="mb-10">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Favorite resources</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Resource Cards */}
              {[
                { name: "SJCSD uCertify", icon: "/placeholder.svg?height=60&width=60" },
                { name: "WIN Career Readiness", icon: "/placeholder.svg?height=60&width=60" },
                { name: "GMetrix SMS", icon: "/placeholder.svg?height=60&width=60" },
                { name: "iCEV", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Schoology", icon: "/placeholder.svg?height=60&width=60" },
                { name: "FLODE Practice Tests", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Home Access Center", icon: "/placeholder.svg?height=60&width=60" },
              ].map((resource, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative">
                    <button className="absolute -top-2 -left-2 text-red-500">
                      <Heart className="h-5 w-5 fill-red-500" />
                    </button>
                    <Image
                      src={resource.icon || "/placeholder.svg"}
                      alt={resource.name}
                      width={60}
                      height={60}
                      className="mb-2 border border-gray-200 rounded"
                    />
                  </div>
                  <span className="text-xs text-center">{resource.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Teacher Pages Section */}
          <section className="mb-10">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Teacher Pages</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <button className="absolute -top-2 -left-2 text-red-500">
                    <Heart className="h-5 w-5 fill-red-500" />
                  </button>
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Teacher Page"
                    width={60}
                    height={60}
                    className="mb-2 border border-gray-200 rounded bg-pink-500"
                  />
                </div>
                <span className="text-xs text-center">R. Whitehead's Page</span>
              </div>
            </div>
          </section>

          {/* Textbooks Section */}
          <section className="mb-10">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Textbooks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {/* Textbook Cards */}
              {[
                { name: "Order Dual Enrollment Textbooks", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Accelerate Learning", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Achieve", icon: "/placeholder.svg?height=60&width=60" },
                { name: "HMH Ed Learning Platform SSO", icon: "/placeholder.svg?height=60&width=60" },
                { name: "iCEV", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Pearson MyLab", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Savvas EasyBridge", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Schoology", icon: "/placeholder.svg?height=60&width=60" },
                { name: "VHL Central", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Vista Higher Learning", icon: "/placeholder.svg?height=60&width=60" },
              ].map((resource, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative">
                    <button className="absolute -top-2 -left-2 text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
                    <Image
                      src={resource.icon || "/placeholder.svg"}
                      alt={resource.name}
                      width={60}
                      height={60}
                      className="mb-2 border border-gray-200 rounded"
                    />
                  </div>
                  <span className="text-xs text-center">{resource.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Student Applications Section */}
          <section className="mb-10">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Student Applications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* App Cards */}
              {[
                { name: "Adobe Express", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Edmentum - Exact Learning", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Code.org", icon: "/placeholder.svg?height=60&width=60" },
                { name: "CPALMS Class Sites", icon: "/placeholder.svg?height=60&width=60" },
                { name: "CPALMS", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Desmos", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Edmentum - Courseware", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Edpuzzle", icon: "/placeholder.svg?height=60&width=60" },
                { name: "EVERFI", icon: "/placeholder.svg?height=60&width=60" },
                { name: "GMetrix SMS", icon: "/placeholder.svg?height=60&width=60" },
                { name: "GradeCam", icon: "/placeholder.svg?height=60&width=60" },
                { name: "Jobreedy WBL", icon: "/placeholder.svg?height=60&width=60" },
              ].map((app, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative">
                    <button className="absolute -top-2 -left-2 text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
                    <Image
                      src={app.icon || "/placeholder.svg"}
                      alt={app.name}
                      width={60}
                      height={60}
                      className="mb-2 border border-gray-200 rounded"
                    />
                  </div>
                  <span className="text-xs text-center">{app.name}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* AI Chat Bot */}
      <div
        className={`fixed bottom-0 right-5 transition-all duration-300 ease-in-out ${isChatOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          ref={resizableRef}
          className={`bg-white rounded-t-lg shadow-xl border border-gray-200 ${
            isFullSize ? "fixed inset-4 w-auto h-auto z-50" : "w-96 md:w-[550px]"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Clever Reporting</h3>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleFullSize}
                className="text-white hover:bg-blue-700/30 rounded-full p-1.5 transition-colors mr-1"
                aria-label={isFullSize ? "Minimize" : "Maximize"}
              >
                {isFullSize ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-blue-700/30 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Resize handle */}
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-10" onMouseDown={startResize}>
            <div className="w-2 h-2 bg-gray-400 rounded-full absolute top-1 left-1"></div>
          </div>

          {/* Chat Messages */}
          <div className={`${isFullSize ? "flex-1" : "h-[450px]"} overflow-y-auto p-3 bg-gray-800 chat-content`}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`mb-2 ${msg.type === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-3 rounded-2xl max-w-[90%] ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                      : "bg-gray-700 text-white border border-gray-600 shadow-sm"
                  }`}
                >
                  {msg.type === "bot" && extractAnswer(msg.content) && (
                    <button
                      onClick={() => copyAnswer(msg.id, msg.content)}
                      className="float-right ml-2 p-1 text-gray-300 hover:text-white transition-colors"
                      aria-label="Copy answer"
                      title="Copy answer"
                    >
                      {copiedMessageId === msg.id ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <div
                    className="formatted-text"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-700 text-white p-3 rounded-2xl border border-gray-600 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-700 flex bg-gray-800">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-600 bg-gray-700 text-white rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-gray-400 resize-none min-h-[40px] max-h-[120px] overflow-y-auto whitespace-pre-wrap"
              style={{ height: "auto" }}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className={`${isLoading ? "bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"} text-white px-4 py-2 rounded-r-xl transition-colors`}
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

