import { type NextRequest, NextResponse } from "next/server"

// Mock user data - replace with actual database
const users = [
  { username: "admin", password: "admin123" },
  { username: "user", password: "user123" },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you'd create a JWT token or session here
    const response = NextResponse.json({ success: true })

    // Set a simple auth cookie (in production, use proper JWT)
    response.cookies.set("auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
