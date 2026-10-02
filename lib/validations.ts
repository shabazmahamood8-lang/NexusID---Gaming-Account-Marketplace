export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.trim().length >= 8;
}

export function validateListingInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  if (!data.game || typeof data.game !== 'string') {
    errors.push('Game name is required');
  }
  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    errors.push('Price must be a valid positive number');
  }
  const originalPrice = Number(data.originalPrice);
  if (isNaN(originalPrice) || originalPrice < price) {
    // Original price should ideally be >= price
    // But we can default originalPrice to price if lower
  }
  if (!data.rank || typeof data.rank !== 'string') {
    errors.push('Rank is required');
  }
  return { valid: errors.length === 0, errors };
}

export function validateOrderInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name is required');
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('A valid email address is required');
  }
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('A valid contact phone number is required');
  }
  if (!data.listingId) {
    errors.push('Listing ID is required');
  }
  if (!data.paymentMethod) {
    errors.push('Payment method is required');
  }
  return { valid: errors.length === 0, errors };
}
