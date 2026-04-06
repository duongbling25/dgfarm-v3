'use client'
// src/presentation/components/order/OrderDetailModal.tsx
//
// Modal hiển thị chi tiết đơn hàng — dùng chung cho:
// - Giao dịch/Đặt hàng/Khách hàng (OrderTable)
// - Giao dịch/Hóa đơn/Khách hàng (CustomerInvoiceTable)

import React from 'react'
import { Overlay } from '@/presentation/components/ui/SharedUI'
import type { OrderWithItems } from '@/domain/entities/Customer'

const fmt = (n: number) => n.toLocaleString('vi-VN')

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  'Hoàn thành':   { background: '#EAF3DE', color: '#27500A', border: '1px solid #b7d88a' },
  'Đã hủy':       { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' },
  'Từ chối':      { background: '#FCEBEB', color: '#791F1F', border: '1px solid #f8b4b4' },
  'Chờ xác nhận': { background: '#FAEEDA', color: '#633806', border: '1px solid #f5c97a' },
  'Đã xác nhận':  { background: '#E6F1FB', color: '#0C447C', border: '1px solid #93c5fd' },
  'Đang giao':    { background: '#EEEDFE', color: '#3C3489', border: '1px solid #c4b5fd' },
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      whiteSpace: 'nowrap', ...(STATUS_STYLES[status] ?? {}),
    }}>
      {status}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
      <span style={{ color: '#888', minWidth: 120 }}>{label}:</span>
      <span style={{ color: '#222', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function Summary({ items }: { items: OrderWithItems['order_items'] }) {
  const totalQty      = items.reduce((s, i) => s + i.quantity, 0)
  const totalAmt      = items.reduce((s, i) => s + i.quantity * i.sell_price, 0)
  const totalDiscount = items.reduce((s, i) => s + i.quantity * i.discount, 0)
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
      <table style={{ fontSize: 13, minWidth: 260 }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px 8px', color: '#333' }}>Tổng số lượng:</td>
            <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600 }}>{totalQty}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 8px', color: '#333' }}>Tổng tiền hàng:</td>
            <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600 }}>{fmt(totalAmt + totalDiscount)}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 8px', color: '#333' }}>Giảm giá:</td>
            <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600 }}>{totalDiscount > 0 ? fmt(totalDiscount) : '—'}</td>
          </tr>
          <tr style={{ borderTop: '1px solid #ddd' }}>
            <td style={{ padding: '8px 8px 4px', fontWeight: 700, fontSize: 14, color: '#0E176E' }}>Khách cần trả:</td>
            <td style={{ padding: '8px 8px 4px', textAlign: 'right', fontWeight: 700, fontSize: 14, color: '#0E176E' }}>{fmt(totalAmt)} ₫</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

interface Props {
  order:   OrderWithItems | null
  loading: boolean
  onClose: () => void
}

export default function OrderDetailModal({ order, loading, onClose }: Props) {
  if (!loading && !order) return null

  return (
    <Overlay>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '24px 28px 20px',
        width: 720, maxWidth: '95vw', maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.22)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0E176E' }}>
            {loading ? 'Đang tải...' : `Chi tiết đơn hàng ${order?.id}`}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        {order && !loading && (
          <>
            {/* Thông tin chung */}
            <div style={{
              background: '#f8fafc', borderRadius: 8, padding: '14px 16px',
              marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                <StatusBadge status={order.workflow_status} />
                <span style={{ fontSize: 12, color: '#666' }}>
                  🕐 {new Date(order.ordered_at).toLocaleString('vi-VN')}
                </span>
                <span style={{ fontSize: 12, color: '#666' }}>
                  👤 Người bán: {order.seller}
                </span>
              </div>

              {/* Thông tin khách hàng */}
              <InfoRow label="Khách hàng"   value={order.customer_name} />
              <InfoRow label="Số điện thoại" value={order.customer_phone} />
              <InfoRow label="Địa chỉ"      value={order.customer_address} />

              {/* Thông tin giao hàng */}
              <InfoRow label="Mã vận đơn"   value={order.tracking_code} />
              <InfoRow label="Ghi chú"      value={order.note} />
            </div>

            {/* Bảng sản phẩm */}
            <table style={{
              width: '100%', borderCollapse: 'separate', borderSpacing: 0,
              fontSize: 13, border: '1px solid #d0e4f0', borderRadius: 8, overflow: 'hidden',
            }}>
              <thead>
                <tr>
                  {['Mã hàng', 'Tên hàng', 'Số lượng', 'Đơn giá', 'Giảm giá', 'Giá bán', 'Thành tiền'].map((hd, i) => (
                    <th key={hd} style={{
                      background: '#CEE8FF', padding: '10px 12px',
                      textAlign: i >= 2 ? 'right' : 'left', fontWeight: 700, fontSize: 12,
                    }}>{hd}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid #eef2f7', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '9px 12px', color: '#253584', fontWeight: 600 }}>{item.product_code}</td>
                    <td style={{ padding: '9px 12px' }}>{item.product_name}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>{fmt(item.unit_price)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>{item.discount > 0 ? fmt(item.discount) : '—'}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>{fmt(item.sell_price)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600 }}>{fmt(item.quantity * item.sell_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Summary items={order.order_items} />
          </>
        )}
      </div>
    </Overlay>
  )
}