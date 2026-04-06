// src/domain/entities/Customer.ts

export type CustomerTier = 'Đồng' | 'Bạc' | 'Vàng'

export interface Customer {
  id:         string
  name:       string
  phone:      string | null
  email:      string | null
  tier:       CustomerTier
  total:      number
  created_at: string
  address?:   string | null
}

export interface Order {
  id:              string
  customer_id:     string
  seller:          string
  total:           number
  status:          string
  ordered_at:      string
  workflow_status: string
  priority_score:  number
  // Thêm các trường giao hàng
  note:            string | null
  tracking_code:   string | null
  handled_by:      string | null
}

export interface OrderItem {
  id:           number
  order_id:     string
  product_code: string
  product_name: string
  quantity:     number
  unit_price:   number
  discount:     number
  sell_price:   number
}

export interface OrderWithItems extends Order {
  order_items:    OrderItem[]
  // Join từ customers
  customer_name?: string
  customer_phone?: string | null
  customer_address?: string | null
}