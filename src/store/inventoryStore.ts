
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  contact: string;
  isActive: boolean;
  isMain: boolean;
}

export interface StockLevel {
  productId: string;
  warehouseId: string;
  quantity: number;
  reserved: number; // Tạm giữ cho đơn hàng đang chờ
  lowStockThreshold: number;
}

export type OperationType = 'adjustment' | 'transfer' | 'purchase_order' | 'stocktake';

export interface InventoryOperation {
  id: string;
  type: OperationType;
  warehouseId: string;
  targetWarehouseId?: string; // Cho nghiệp vụ chuyển kho
  reason: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface InventoryState {
  warehouses: Warehouse[];
  stockLevels: StockLevel[];
  operations: InventoryOperation[];
  
  // Actions
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => void;
  adjustStock: (warehouseId: string, productId: string, quantity: number, reason: string) => void;
  transferStock: (fromId: string, toId: string, productId: string, quantity: number) => void;
  createPurchaseOrder: (operation: InventoryOperation) => void;
  updateOperationStatus: (id: string, status: InventoryOperation['status']) => void;
  
  // Getters
  getStockByProduct: (productId: string) => number;
  getStockByWarehouse: (warehouseId: string, productId: string) => number;
  getLowStockItems: () => { productId: string, total: number, threshold: number }[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      warehouses: [
        { id: 'wh-1', name: 'Kho Tổng TP.HCM', location: 'Quận 7, TP.HCM', contact: '090111222', isActive: true, isMain: true },
        { id: 'wh-2', name: 'Kho Miền Bắc', location: 'Long Biên, Hà Nội', contact: '090333444', isActive: true, isMain: false }
      ],
      stockLevels: [
        { productId: 'p1', warehouseId: 'wh-1', quantity: 45, reserved: 2, lowStockThreshold: 10 },
        { productId: 'p1', warehouseId: 'wh-2', quantity: 20, reserved: 0, lowStockThreshold: 10 },
        { productId: 'p2', warehouseId: 'wh-1', quantity: 5, reserved: 1, lowStockThreshold: 15 }
      ],
      operations: [],

      addWarehouse: (wh) => set((state) => ({ warehouses: [...state.warehouses, wh] })),
      
      updateWarehouse: (id, updates) => set((state) => ({
        warehouses: state.warehouses.map(w => w.id === id ? { ...w, ...updates } : w)
      })),

      adjustStock: (warehouseId, productId, delta, reason) => set((state) => {
        const newStockLevels = [...state.stockLevels];
        const idx = newStockLevels.findIndex(s => s.productId === productId && s.warehouseId === warehouseId);
        
        if (idx !== -1) {
          newStockLevels[idx].quantity += delta;
        } else {
          newStockLevels.push({ productId, warehouseId, quantity: delta, reserved: 0, lowStockThreshold: 10 });
        }

        const operation: InventoryOperation = {
          id: `adj-${Date.now()}`,
          type: 'adjustment',
          warehouseId,
          reason,
          items: [{ productId, productName: 'Sản phẩm', quantity: delta }],
          status: 'completed',
          createdAt: new Date().toISOString()
        };

        return { stockLevels: newStockLevels, operations: [operation, ...state.operations] };
      }),

      transferStock: (fromId, toId, productId, qty) => set((state) => {
        const newStock = [...state.stockLevels];
        const fromIdx = newStock.findIndex(s => s.productId === productId && s.warehouseId === fromId);
        const toIdx = newStock.findIndex(s => s.productId === productId && s.warehouseId === toId);

        if (fromIdx === -1 || newStock[fromIdx].quantity < qty) return state;

        newStock[fromIdx].quantity -= qty;
        if (toIdx !== -1) {
          newStock[toIdx].quantity += qty;
        } else {
          newStock.push({ productId, warehouseId: toId, quantity: qty, reserved: 0, lowStockThreshold: 10 });
        }

        const op: InventoryOperation = {
          id: `trf-${Date.now()}`,
          type: 'transfer',
          warehouseId: fromId,
          targetWarehouseId: toId,
          reason: 'Chuyển kho định kỳ',
          items: [{ productId, productName: 'Sản phẩm', quantity: qty }],
          status: 'completed',
          createdAt: new Date().toISOString()
        };

        return { stockLevels: newStock, operations: [op, ...state.operations] };
      }),

      createPurchaseOrder: (op) => set((state) => ({
        operations: [op, ...state.operations]
      })),

      updateOperationStatus: (id, status) => set((state) => {
        const op = state.operations.find(o => o.id === id);
        if (status === 'completed' && op && op.type === 'purchase_order') {
          // Khi PO hoàn thành, cộng stock vào kho
          const newStock = [...state.stockLevels];
          op.items.forEach(item => {
            const idx = newStock.findIndex(s => s.productId === item.productId && s.warehouseId === op.warehouseId);
            if (idx !== -1) newStock[idx].quantity += item.quantity;
            else newStock.push({ productId: item.productId, warehouseId: op.warehouseId, quantity: item.quantity, reserved: 0, lowStockThreshold: 10 });
          });
          return {
            operations: state.operations.map(o => o.id === id ? { ...o, status } : o),
            stockLevels: newStock
          };
        }
        return { operations: state.operations.map(o => o.id === id ? { ...o, status } : o) };
      }),

      getStockByProduct: (productId) => {
        return get().stockLevels
          .filter(s => s.productId === productId)
          .reduce((acc, curr) => acc + curr.quantity, 0);
      },

      getStockByWarehouse: (warehouseId, productId) => {
        return get().stockLevels.find(s => s.warehouseId === warehouseId && s.productId === productId)?.quantity || 0;
      },

      getLowStockItems: () => {
        const levels = get().stockLevels;
        // Group by product
        const totals: Record<string, { total: number, threshold: number }> = {};
        levels.forEach(s => {
          if (!totals[s.productId]) totals[s.productId] = { total: 0, threshold: s.lowStockThreshold };
          totals[s.productId].total += s.quantity;
        });

        return Object.entries(totals)
          .filter(([_, data]) => data.total <= data.threshold)
          .map(([id, data]) => ({ productId: id, total: data.total, threshold: data.threshold }));
      }
    }),
    {
      name: 'scomhub-inventory-storage-v1',
    }
  )
);
