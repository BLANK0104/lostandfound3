import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const ClaimForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    claimer_name: '',
    contact_number: '',
    claim_date: new Date().toISOString().slice(0, 16)
  });
  const sigPad = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (sigPad.current.isEmpty()) {
      alert('Please provide a signature');
      return;
    }
  
    try {
      const signatureDataUrl = sigPad.current.toDataURL();
      console.log('Submitting form data:', {
        ...formData,
        signature: 'signature_data_present',
        item_id: item.id
      });
      
      await onSubmit({
        claimer_name: formData.claimer_name,
        claim_date: formData.claim_date,
        contact_number: formData.contact_number,
        signature: signatureDataUrl,
        item_id: item.id
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting claim: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Claim Item: {item.item_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.claimer_name}
              onChange={(e) => setFormData({...formData, claimer_name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              required
              value={formData.contact_number}
              onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="datetime-local"
              required
              value={formData.claim_date}
              onChange={(e) => setFormData({...formData, claim_date: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Signature</label>
            <div className="border rounded p-2">
              <SignatureCanvas
                ref={sigPad}
                canvasProps={{
                  className: "w-full h-40 border rounded"
                }}
              />
              <button
                type="button"
                onClick={() => sigPad.current.clear()}
                className="text-sm text-gray-600 mt-1"
              >
                Clear Signature
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-black p-2 rounded hover:bg-green-600"
            >
              Submit Claim
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;