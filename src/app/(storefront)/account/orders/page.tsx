
"use client";

import { useOrderStore, Order } from "@/store/orderStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CreditCard, Calendar, User, MapPin } from "lucide-react";
import Image from "next/image";

export default function MyOrdersPage() {
  const { orders } = useOrderStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ và lịch sử mua hàng.</p>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="bg-card/50 border-white/5 overflow-hidden hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Mã đơn hàng: <span className="text-foreground font-bold">{order.code || `#${order.id}`}</span></div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <StatusBadge status={order.status} />
                    <div className="font-bold text-lg text-primary">{formatVND(order.total)}</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="relative h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-10 w-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <OrderDetailsDialog order={order} />
                    <Button variant="ghost" size="sm" className="rounded-full">Liên hệ hỗ trợ</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const configs: any = {
    created: { label: "Chờ xác nhận", class: "bg-yellow-500/10 text-yellow-500" },
    confirmed: { label: "Đã xác nhận", class: "bg-indigo-500/10 text-indigo-500" },
    processing: { label: "Đang xử lý", class: "bg-blue-500/10 text-blue-500" },
    shipped: { label: "Đang giao", class: "bg-orange-500/10 text-orange-500" },
    delivered: { label: "Đã nhận", class: "bg-emerald-500/10 text-emerald-500" },
    completed: { label: "Hoàn thành", class: "bg-green-500/10 text-green-500" },
    cancelled: { label: "Đã hủy", class: "bg-red-500/10 text-red-500" },
  };
  const config = configs[status] || configs.created;
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
      {config.label}
    </span>
  );
}

function OrderDetailsDialog({ order }: { order: Order }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full px-6">Chi tiết</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            Chi tiết đơn hàng <span className="text-primary">{order.code}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Trạng thái hiện tại</p>
                <p className="font-bold text-primary uppercase">{order.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Ngày đặt</p>
              <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                <User className="w-4 h-4" /> Thông tin nhận hàng
              </h4>
              <div className="space-y-1">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                <p className="text-sm">{order.shippingAddress.phone}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <p>{order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                <CreditCard className="w-4 h-4" /> Thanh toán & Vận chuyển
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Đơn vị giao:</span>
                  <span className="font-medium">{order.shippingMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Package className="w-4 h-4" /> Danh sách sản phẩm
            </h4>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Số lượng: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">{formatVND(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Tạm tính</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-red-400 text-sm">
                <span>Giảm giá</span>
                <span>-{formatVND(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Phí vận chuyển</span>
              <span>{formatVND(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-2">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatVND(order.total)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
