// app/api/network-data/route.js
export async function GET() {
  const networkData = {
    bandwidth: Math.random() * 100, // Simulated bandwidth usage
    latency: Math.random() * 200,  // Simulated latency
    downtime: Math.random() * 10,  // Simulated downtime
  };
  return Response.json(networkData);
}