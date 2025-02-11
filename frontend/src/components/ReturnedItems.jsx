import React, { useState, useEffect } from 'react';
import { getAllClaims } from '../services/api';

const API_URL = 'http://192.168.107.140:5000'; // Update this to match your backend URL

const ReturnedItems = ({ setError }) => {
    const [loading, setLoading] = useState(false);
    const [returnedItems, setReturnedItems] = useState([]);

    useEffect(() => {
        loadReturnedItems();
    }, []);

    const loadReturnedItems = async () => {
        try {
            setLoading(true);
            const data = await getAllClaims();
            setReturnedItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Returned Items</h2>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {returnedItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{item.item_name}</h3>
                                    <p className="text-gray-600">Claimed by: {item.claimer_name}</p>
                                    <p className="text-gray-600">
                                        Contact: {item.contact_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        Claimed Date: {new Date(item.claim_date).toLocaleDateString()}
                                    </p>
                                    {item.signature_url && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Signature:</p>
                                            <img 
                                                src={`${API_URL}${item.signature_url}`}
                                                alt="Signature" 
                                                className="max-h-20 border rounded p-1"
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReturnedItems;