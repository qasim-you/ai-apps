import { NextResponse } from "next/server"

export async function GET() {
  // Simulate fetching data from a database
  const networkStatus = [
    { school: "School A", uptime: 98.5 },
    { school: "School B", uptime: 95.2 },
    { school: "School C", uptime: 92.7 },
    { school: "School D", uptime: 97.1 },
    { school: "School E", uptime: 99.3 },
  ]

  const learningProgress = [
    { week: "Week 1", progress: 22 },
    { week: "Week 2", progress: 37 },
    { week: "Week 3", progress: 48 },
    { week: "Week 4", progress: 62 },
    { week: "Week 5", progress: 78 },
  ]

  return NextResponse.json({ networkStatus, learningProgress })
}
