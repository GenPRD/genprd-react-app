/**
 * Menangani error API dengan cara yang konsisten
 * @param {Error} error - Error yang ditangkap dari axios
 * @param {Function} setError - Fungsi untuk mengatur pesan error
 * @returns {string} - Pesan error yang diformat
 */
export const handleApiError = (error, setError = null) => {
  // Error umum non-HTTP
  if (!error.response) {
    const message = error.message || 'Network error, please check your connection';
    if (setError) setError(message);
    return message;
  }
  
  // Error berbasis HTTP status
  const status = error.response.status;
  let message;
  
  switch(status) {
    case 400:
      message = error.response.data?.message || 'Invalid request parameters';
      break;
    case 401:
      message = 'Authentication required. Please log in again.';
      // Potentially trigger logout here
      break;
    case 403:
      message = 'You do not have permission to access this resource';
      break;
    case 404:
      message = 'The requested resource was not found';
      break;
    case 422:
      message = error.response.data?.message || 'Validation error in your request';
      break;
    case 500:
      message = 'Server error. Please try again later';
      break;
    default:
      message = error.response.data?.message || `Error: ${status}`;
  }
  
  if (setError) setError(message);
  return message;
};