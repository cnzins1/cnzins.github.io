"use client"

import type React from "react"

import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"

interface MathInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const MathInput = forwardRef<HTMLTextAreaElement, MathInputProps>(({ value, onChange, ...props }, ref) => {
  // Handle paste event to preserve special characters
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Default behavior is fine for most cases
    // The browser will handle the paste event correctly for math symbols
  }

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onPaste={handlePaste}
        rows={3}
        className="resize-none font-mono"
        {...props}
      />
    </div>
  )
})

MathInput.displayName = "MathInput"

export default MathInput

