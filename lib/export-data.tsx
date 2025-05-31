"use client"

type EmailData = {
  recipient: string
  subject: string
  content: string
  timestamp: string
}

export async function exportData(data: EmailData[]): Promise<void> {
  // Convert data to CSV format
  const headers = ["Recipient", "Subject", "Content", "Timestamp"]
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      [
        `"${row.recipient}"`,
        `"${row.subject}"`,
        `"${row.content.replace(/"/g, '""')}"`,
        `"${new Date(row.timestamp).toLocaleString()}"`,
      ].join(","),
    ),
  ]

  const csvString = csvRows.join("\n")

  // Create a blob and download it
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", `email_data_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
