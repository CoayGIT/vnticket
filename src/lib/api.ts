// Em produção no Netlify, usa /api (que redireciona para Netlify Functions)
// Em desenvolvimento, usa http://localhost:3001/api
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  private loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }

  private clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.accessToken = null;
      this.refreshToken = null;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokens(data.accessToken, data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }

    this.clearTokens();
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Se receber 401, tentar renovar o token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          // Redirecionar para login se não conseguir renovar
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return { error: 'Não autenticado' };
        }
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          details: data.details,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Auth
  async register(userData: {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
  }) {
    const response = await this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.saveTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.saveTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  }

  logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Events
  async getEvents(search?: string, category?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/events${query}`);
  }

  async getEventById(id: string) {
    return this.request(`/events/${id}`);
  }

  // Orders
  async createOrder(orderData: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    buyerData: {
      name: string;
      cpf: string;
      email: string;
      phone: string;
    };
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.request('/orders');
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  // Tickets
  async getUserTickets() {
    return this.request('/tickets');
  }

  async getTicketById(id: string) {
    return this.request(`/tickets/${id}`);
  }

  async getTicketByCode(code: string) {
    return this.request(`/tickets/code/${code}`);
  }

  async getTicketQRCode(id: string) {
    return this.request(`/tickets/${id}/qrcode`);
  }

  async validateTicketQRCode(qrData: string) {
    return this.request('/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  }

  async checkPaymentStatus(orderId: string) {
    return this.request(`/payments/status/${orderId}`);
  }
}

export const api = new ApiClient(API_URL);
