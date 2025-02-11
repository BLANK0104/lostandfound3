import React from 'react';

const API_URL = 'http://192.168.107.140:5000';

const ReturnedItemDetail = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{item.item_name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Item Details</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Item Name:</span> {item.item_name}</p>
                            <p><span className="font-medium">Description:</span> {item.description || 'N/A'}</p>
                            <p><span className="font-medium">Location Found:</span> {item.location}</p>
                            {item.amount && (
                                <p><span className="font-medium">Amount:</span> {item.amount}</p>
                            )}
                            <p><span className="font-medium">Found Date:</span> {new Date(item.found_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Claim Details</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Claimed By:</span> {item.claimer_name}</p>
                            <p><span className="font-medium">Contact:</span> {item.contact_number}</p>
                            <p><span className="font-medium">Claim Date:</span> {new Date(item.claim_date).toLocaleDateString()}</p>
                            {item.signature_url && (
                                <div className="mt-4">
                                    <p className="font-medium mb-1">Signature:</p>
                                    <img
                                        src={`${API_URL}${item.signature_url}`}
                                        alt="Signature"
                                        className="max-h-24 border rounded p-1"
                                        onError={(e) => {
                                            console.error('Error loading signature:', e);
                                            e.target.src = 'placeholder.png';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnedItemDetail;