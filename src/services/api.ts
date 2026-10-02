/**
 * NexusID Client API helper
 */

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nexus_auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // LISTINGS
  async getListings(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const res = await fetch(`/api/ids?${searchParams.toString()}`);
    return await res.json();
  },

  async getListingById(id: string) {
    const res = await fetch(`/api/ids/${id}`);
    return await res.json();
  },

  async createListing(data: any) {
    const res = await fetch('/api/ids', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateListing(id: string, data: any) {
    const res = await fetch(`/api/ids/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteListing(id: string) {
    const res = await fetch(`/api/ids/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // ORDERS
  async createOrder(data: {
    listingId: string;
    customerName: string;
    email: string;
    phone: string;
    paymentMethod: string;
    paymentTransactionId?: string;
    note?: string;
  }) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getOrders() {
    const res = await fetch('/api/orders', {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  async getOrderById(id: string) {
    const res = await fetch(`/api/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  async updateOrderStatus(id: string, status: string, deliveryDetails?: any) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, deliveryDetails }),
    });
    return await res.json();
  },

  // REVIEWS
  async getReviews(listingId?: string, all = false) {
    const url = `/api/reviews?${listingId ? `listingId=${listingId}&` : ''}${all ? 'all=true' : ''}`;
    const res = await fetch(url);
    return await res.json();
  },

  async submitReview(data: { orderId: string; listingId: string; rating: number; comment: string }) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateReviewStatus(id: string, isApproved: boolean) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isApproved }),
    });
    return await res.json();
  },

  async deleteReview(id: string) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // CATEGORIES & SETTINGS
  async getCategories() {
    const res = await fetch('/api/categories');
    return await res.json();
  },

  async getSettings() {
    const res = await fetch('/api/settings');
    return await res.json();
  },

  async updateSettings(data: any) {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // CONTACT
  async sendContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getContactMessages() {
    const res = await fetch('/api/contact', {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // USERS & STATS
  async getUsers() {
    const res = await fetch('/api/users', {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  async updateUserRole(id: string, role: string) {
    const res = await fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return await res.json();
  },

  async updateUserProfile(data: { name?: string; phone?: string; avatar?: string }) {
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats', {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // CLOUDINARY UPLOAD
  async uploadImage(base64OrUrl: string, folder = 'gaming_ids') {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ image: base64OrUrl, folder }),
    });
    return await res.json();
  },
};

export default api;
