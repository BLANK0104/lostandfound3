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