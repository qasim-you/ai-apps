import React from "react";
import { Settings as SettingsIcon, X } from "lucide-react";

export function Settings({ isOpen, onClose, updateInterval, onUpdateIntervalChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <SettingsIcon className="h-6 w-6 text-gray-600" />
                        <h2 className="ml-2 text-xl font-semibold">Dashboard Settings</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Update Interval (seconds)
                        </label>
                        <select
                            value={updateInterval / 1000}
                            onChange={(e) => onUpdateIntervalChange(Number(e.target.value) * 1000)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="5">5 seconds</option>
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}