const API_URL = 'http://192.168.107.140:5000';

export const submitLostItem = async (formData) => {
  const response = await fetch(`${API_URL}/lost-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const submitFoundItem = async (formData) => {
  const response = await fetch(`${API_URL}/found-items`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchLostItems = async () => {
  const response = await fetch(`${API_URL}/lost-items`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const registerUser = async (formData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create user');
  }

  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

export const fetchFoundItems = async () => {
  const response = await fetch(`${API_URL}/found-items`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const markItemAsFound = async (itemId) => {
  const response = await fetch(`${API_URL}/lost-items/${itemId}/mark-found`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export const generateReport = async (fromDate, toDate) => {
  const response = await fetch(`${API_URL}/generate-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fromDate, toDate }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report-${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const markFoundItemAsClaimed = async (claimData) => {
  console.log('Sending claim data:', {
    ...claimData,
    signature: claimData.signature ? 'signature_present' : 'signature_missing'
  });

  const response = await fetch(`${API_URL}/claims/${claimData.item_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      claimer_name: claimData.claimer_name,
      claim_date: claimData.claim_date,
      contact_number: claimData.contact_number,
      signature: claimData.signature
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to mark item as claimed');
  }
  
  return response.json();
};

export const getAllClaims = async () => {
  const response = await fetch(`${API_URL}/claims`);
  if (!response.ok) {
    throw new Error('Failed to fetch returned items');
  }
  return response.json();
};

