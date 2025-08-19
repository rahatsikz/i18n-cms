import { type NextRequest, NextResponse } from "next/server"

// Mock user storage - replace with actual database
const users = [
  { id: "1", username: "admin", password: "admin123" },
  { id: "2", username: "user", password: "user123" },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Check if user already exists
    if (users.find((u) => u.username === username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
    }

    users.push(newUser)

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username },
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
