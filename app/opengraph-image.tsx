import { ImageResponse } from "next/og"

// Image metadata
export const alt = "Clever Student Portal"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "#3b82f6",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: "bold", marginBottom: 20 }}>Clever</div>
      <div style={{ fontSize: 36 }}>Student Portal Dashboard</div>
    </div>,
    {
      ...size,
    },
  )
}

