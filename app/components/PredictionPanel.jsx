import React from "react";
import { Brain } from "lucide-react";

export function PredictionPanel({ prediction, loading }) {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="ml-2 text-lg font-medium">AI Network Analysis</h3>
            </div>
            <div className="min-h-[100px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <p className="text-gray-700 whitespace-pre-line">{prediction}</p>
                )}
            </div>
        </div>
    );
}