import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function MetricsChart({ data, metric, color }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => format(parseISO(timestamp), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(timestamp) => format(parseISO(timestamp), 'HH:mm')}
                        formatter={(value) => [Number(value).toFixed(2), metric]}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={metric}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        name={metric.charAt(0).toUpperCase() + metric.slice(1)}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}