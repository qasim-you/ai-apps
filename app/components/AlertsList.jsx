import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const severityIcons = {
    low: AlertTriangle,
    medium: AlertCircle,
    high: AlertOctagon,
};

const severityColors = {
    low: 'text-yellow-500',
    medium: 'text-orange-500',
    high: 'text-red-500',
};

export function AlertsList({ alerts }) {
    return (
        <div className="space-y-4">
            {alerts.map((alert) => {
                const Icon = severityIcons[alert.severity];
                return (
                    <div
                        key={alert.id}
                        className="flex items-start gap-3 p-4 bg-white rounded-lg shadow"
                    >
                        <Icon className={`w-5 h-5 mt-0.5 ${severityColors[alert.severity]}`} />
                        <div className="flex-1">
                            <p className="text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(parseISO(alert.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}