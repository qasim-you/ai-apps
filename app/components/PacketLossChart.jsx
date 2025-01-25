import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function PacketLossChart({ data }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => format(parseISO(timestamp), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(timestamp) => format(parseISO(timestamp), 'HH:mm')}
                        formatter={(value) => [Number(value).toFixed(2) + '%', 'Packet Loss']}
                    />
                    <Area
                        type="monotone"
                        dataKey="packetLoss"
                        stroke="#dc2626"
                        fill="#fee2e2"
                        strokeWidth={2}
                        name="Packet Loss"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}