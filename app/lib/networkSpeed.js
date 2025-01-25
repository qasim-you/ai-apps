// URLs for speed testing
const SPEED_TEST_URLS = {
  download: "https://proof.ovh.net/files/1Mb.dat", // Reliable 1 MB test file
  upload: "https://httpbin.org/post",
  ping: "https://www.cloudflare.com",
};

// Helper function to measure download speed
async function measureDownloadSpeed() {
  const startTime = Date.now();
  try {
    const response = await fetch(SPEED_TEST_URLS.download);
    const data = await response.blob(); // Use blob to measure size accurately
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // seconds
    const fileSizeInBits = data.size * 8; // Convert bytes to bits
    const speedMbps = fileSizeInBits / duration / 1_000_000; // Convert to Mbps
    return Math.min(speedMbps, 1000); // Cap at 1000 Mbps to avoid unrealistic values
  } catch (error) {
    console.error("Download speed measurement failed:", error);
    return 0;
  }
}

// Helper function to measure latency
async function measureLatency() {
  const samples = 3;
  const latencies = [];

  for (let i = 0; i < samples; i++) {
    const startTime = Date.now();
    try {
      await fetch(SPEED_TEST_URLS.ping, { mode: "no-cors" });
      const latency = Date.now() - startTime;
      latencies.push(latency);
    } catch (error) {
      console.error("Latency measurement failed:", error);
      latencies.push(1000); // Default to 1000ms on error
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait between measurements
  }

  // Return the average latency, excluding any outliers
  const validLatencies = latencies.filter((l) => l < 1000);
  return validLatencies.length > 0
    ? validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length
    : 1000;
}

// Helper function to simulate packet loss based on network conditions
function simulatePacketLoss(latency, bandwidth) {
  // Higher latency and lower bandwidth typically correlate with higher packet loss
  const basePacketLoss = (latency / 1000) * (1 / Math.max(bandwidth, 1));
  return Math.min(Math.max(basePacketLoss * 100, 0), 100); // Convert to percentage and clamp between 0-100
}

export async function measureNetworkSpeed() {
  try {
    // Measure metrics
    const [bandwidth, latency] = await Promise.all([
      measureDownloadSpeed(),
      measureLatency(),
    ]);

    // Calculate packet loss based on network conditions
    const packetLoss = simulatePacketLoss(latency, bandwidth);

    return {
      timestamp: new Date().toISOString(),
      bandwidth: Math.max(bandwidth, 0.1), // Ensure minimum bandwidth of 0.1 Mbps
      latency: Math.max(latency, 1), // Ensure minimum latency of 1ms
      packetLoss: Math.max(packetLoss, 0), // Ensure minimum packet loss of 0%
    };
  } catch (error) {
    console.error("Error measuring network speed:", error);
    // Return fallback values instead of null
    return {
      timestamp: new Date().toISOString(),
      bandwidth: 0.1,
      latency: 1000,
      packetLoss: 0,
    };
  }
}
