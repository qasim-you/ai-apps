import { subHours, formatISO } from "date-fns";

export const generateMockMetrics = (hours) => {
  return Array.from({ length: hours }, (_, i) => ({
    timestamp: formatISO(subHours(new Date(), hours - i - 1)),
    bandwidth: 800 + Math.random() * 400,
    latency: 20 + Math.random() * 30,
    packetLoss: Math.random() * 2,
  }));
};

export const mockAlerts = [
  {
    id: "1",
    message: "High latency detected in US-East region",
    severity: "high",
    timestamp: formatISO(subHours(new Date(), 1)),
  },
  {
    id: "2",
    message: "Bandwidth utilization above 90%",
    severity: "medium",
    timestamp: formatISO(subHours(new Date(), 2)),
  },
  {
    id: "3",
    message: "Packet loss rate increased",
    severity: "low",
    timestamp: formatISO(subHours(new Date(), 3)),
  },
];
