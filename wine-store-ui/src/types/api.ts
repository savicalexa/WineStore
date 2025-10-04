// ---------------------------------------------
// Generic helpers
// ---------------------------------------------
export type Paged<T> = {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
};

// ---------------------------------------------
// Users
// ---------------------------------------------
export type UserReadDto = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: "Customer" | "Admin" | (string & {});
  createdAt: string;   // ISO date
  updatedAt: string;   // ISO date
};

export type UserCreateDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;          // raw, backend hashuje
  phoneNumber?: string | null;
  role?: "Customer" | "Admin";
};

export type UserUpdateDto = {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: "Customer" | "Admin";
};

// ---------------------------------------------
// Wineries
// ---------------------------------------------
export type WineryReadDto = {
  wineryId: number;
  name: string;
  country: string;
  region?: string | null;
  foundedYear?: number | null;   // short? -> number
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WineryCreateDto = {
  name: string;
  country: string;
  region?: string | null;
  foundedYear?: number | null;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
};

export type WineryUpdateDto = WineryCreateDto;

// ---------------------------------------------
// Categories (WineCategory tabela)
// ---------------------------------------------
export type CategoryReadDto = {
  categoryId: number;
  name: string;
  description?: string | null;
};

export type CategoryCreateDto = {
  name: string;
  description?: string | null;
};

export type CategoryUpdateDto = CategoryCreateDto;

// ---------------------------------------------
// Wines
// ---------------------------------------------
export type WineReadDto = {
  wineId: number;
  name: string;
  year?: number | null;
  alcoholPercentage?: number | null;
  volumeMl: number;
  price: number;
  stockQuantity: number;
  description?: string | null;
  imageUrl?: string | null;

  categoryId: number;
  categoryName: string;

  wineryId: number;
  wineryName: string;

  createdAt: string;
  updatedAt: string;
};

export type WineCreateDto = {
  name: string;
  year?: number | null;
  alcoholPercentage?: number | null;
  volumeMl: number;
  price: number;
  stockQuantity: number;
  description?: string | null;
  imageUrl?: string | null;
  categoryId: number;
  wineryId: number;
};

export type WineUpdateDto = WineCreateDto;

// ---------------------------------------------
// Order Items
// ---------------------------------------------
export type OrderItemReadDto = {
  orderItemId: number;
  orderId: number;
  wineId: number;
  wineName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderItemCreateDto = {
  wineId: number;
  quantity: number;
  unitPrice: number;
};

export type OrderItemUpdateDto = OrderItemCreateDto;

// ---------------------------------------------
// Orders
// ---------------------------------------------
export type OrderReadDto = {
  orderId: number;
  userId: number;
  userEmail: string;
  orderDate: string;       // ISO
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled" | (string & {});
  totalAmount: number;
  shippingAddress: string;
  billingAddress?: string | null;
  updatedAt: string;       // ISO
  items: OrderItemReadDto[];
};

export type OrderCreateDto = {
  userId: number;
  shippingAddress: string;
  billingAddress?: string | null;
  items?: OrderItemCreateDto[];   // opcionalno možeš odmah poslati stavke
};

export type OrderUpdateDto = {
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: string;
  billingAddress?: string | null;
};

// ---------------------------------------------
// Payments
// ---------------------------------------------
export type PaymentReadDto = {
  paymentId: number;
  orderId: number;
  provider: "Stripe" | "PayPal" | "BankTransfer" | "CashOnDelivery" | (string & {});
  amount: number;
  currency: string;         // ISO 4217, npr "EUR"
  paymentDate: string;      // ISO
  paymentMethod: "CreditCard" | "PayPal" | "BankTransfer" | "CashOnDelivery" | (string & {});
  status: "Pending" | "Completed" | "Failed" | "Refunded" | (string & {});
  transactionReference?: string | null;
  metadata?: string | null;

  stripePaymentIntentId?: string | null;
  stripePaymentMethodId?: string | null;
  stripeChargeId?: string | null;
  stripeCustomerId?: string | null;
  stripeReceiptUrl?: string | null;

  capturedAt?: string | null;   // ISO
  refundedAmount: number;
};

export type PaymentCreateDto = {
  orderId: number;
  amount: number;
  currency: string;
  paymentMethod: "CreditCard" | "PayPal" | "BankTransfer" | "CashOnDelivery";
};

export type PaymentUpdateStatusDto = {
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  refundedAmount?: number | null;
};

// ---------------------------------------------
// Stripe Webhook Events
// ---------------------------------------------
export type WebhookEventReadDto = {
  id: number;
  providerEventId: string;
  eventType: string;
  signatureVerified: boolean;
  receivedAt: string;     // ISO
  processedAt?: string | null;
  processStatus: string;
  errorMessage?: string | null;
};

export type WebhookEventCreateDto = {
  providerEventId: string;
  eventType: string;
  payload: string;           // raw JSON string
  signatureVerified: boolean;
};
