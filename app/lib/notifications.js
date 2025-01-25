import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendNotification(email, message, metrics) {
  try {
    await resend.emails.send({
      from: "Usman <usman853136@gmail.com>",
      to: email,
      subject: "Network Alert",
      html: `
        <h2>Network Alert</h2>
        <p>${message}</p>
        <h3>Current Metrics:</h3>
        <ul>
          <li>Bandwidth: ${metrics.bandwidth.toFixed(2)} Mbps</li>
          <li>Latency: ${metrics.latency.toFixed(2)} ms</li>
          <li>Packet Loss: ${metrics.packetLoss.toFixed(2)}%</li>
        </ul>
      `,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
