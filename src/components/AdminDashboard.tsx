import React, { useState } from "react";
import { TrendingUp, ShoppingCart, AlertCircle, Sparkles, Tag, Layers, RefreshCw, Plus, Edit2, ShieldAlert, Check, CheckCircle } from "lucide-react";
import { Product, ProductVariant } from "../types";

interface AdminDashboardProps {
  products: Product[];
  onUpdateVariantStock: (productId: string, variantId: string, newStock: number) => void;
  onUpdateVariantPrice: (productId: string, variantId: string, newPrice: number) => void;
  orders: any[];
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

export default function AdminDashboard({
  products,
  onUpdateVariantStock,
  onUpdateVariantPrice,
  orders,
  onUpdateOrderStatus
}: AdminDashboardProps) {
  const [editingVar, setEditingVar] = useState<{ prodId: string; varId: string } | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Custom Coupons list in state
  const [coupons, setCoupons] = useState([
    { code: "ECO20", discount: "20%", type: "System Baseline" },
    { code: "PACK10", discount: "10%", type: "System Baseline" },
    { code: "FIRSTORDER", discount: "$5.00", type: "System Baseline" }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponVal, setNewCouponVal] = useState("");

  const handleCreateCoupon = () => {
    if (!newCouponCode || !newCouponVal) return;
    setCoupons((prev) => [
      ...prev,
      { code: newCouponCode.trim().toUpperCase(), discount: newCouponVal.trim(), type: "Admin Custom" }
    ]);
    setNewCouponCode("");
    setNewCouponVal("");
  };

  // Extract low stock variants
  const lowStockThreshold = 40;
  const lowStockItems: { prodTitle: string; variantSku: string; variantCap: string; stock: number; prodId: string; varId: string }[] = [];
  
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock < lowStockThreshold) {
        lowStockItems.push({
          prodTitle: p.title.en,
          variantSku: v.sku,
          variantCap: v.capacity,
          stock: v.stock,
          prodId: p.id,
          varId: v.id
        });
      }
    });
  });

  // KPI Calculations
  const mockInitialRevenue = 4120.00;
  const orderRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue = mockInitialRevenue + orderRevenue;
  const totalOrdersCount = 28 + orders.length;

  const handleStartEdit = (prodId: string, variant: ProductVariant) => {
    setEditingVar({ prodId, varId: variant.id });
    setTempStock(variant.stock);
    setTempPrice(variant.price);
  };

  const handleSaveEdit = () => {
    if (!editingVar) return;
    onUpdateVariantStock(editingVar.prodId, editingVar.varId, tempStock);
    onUpdateVariantPrice(editingVar.prodId, editingVar.varId, tempPrice);
    setEditingVar(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
            Operations control
          </span>
          <h2 className="mt-4 font-sans text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Store Manager Console
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Secure admin panels overseeing Packing Store inventories, low-stock warnings, discount vouchers, and direct order fulfillment pipelines.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Admin Session Secured (Owner)</span>
        </div>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Total Revenue</span>
            <span className="text-2xl font-bold text-slate-900 block mt-1">${totalRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">▲ 14.5% versus last week</span>
          </div>
          <div className="rounded-full bg-slate-50 p-3 border border-slate-100 text-slate-700">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Submissions</span>
            <span className="text-2xl font-bold text-slate-900 block mt-1">{totalOrdersCount}</span>
            <span className="text-[10px] text-pink-600 font-medium block mt-1">2 new awaiting DM confirmation</span>
          </div>
          <div className="rounded-full bg-slate-50 p-3 border border-slate-100 text-slate-700">
            <ShoppingCart size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <span className={`text-2xl font-bold block mt-1 ${lowStockItems.length > 0 ? "text-red-500 font-extrabold" : "text-slate-900"}`}>
              {lowStockItems.length} SKUs
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Threshold: &lt; {lowStockThreshold} units</span>
          </div>
          <div className={`rounded-full p-3 border ${lowStockItems.length > 0 ? "bg-red-50 border-red-100 text-red-500" : "bg-slate-50 border-slate-100 text-slate-700"}`}>
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Promo Coupons</span>
            <span className="text-2xl font-bold text-slate-900 block mt-1">{coupons.length}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Add or revoke instantly below</span>
          </div>
          <div className="rounded-full bg-slate-50 p-3 border border-slate-100 text-slate-700">
            <Tag size={22} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inventory Stock / Pricing Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider">Inventory & Variant Price Matrix</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Tweak stock levels or unit prices. Changes reflect live on customer product pages instantly.</p>
              </div>
              <Layers size={16} className="text-slate-400" />
            </div>

            <div className="divide-y divide-slate-150">
              {products.map((p) => (
                <div key={p.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {p.category.en}
                    </span>
                    <span className="font-sans text-xs font-bold text-slate-900 tracking-tight">
                      {p.title.en}
                    </span>
                  </div>

                  {/* Variants within the product */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {p.variants.map((v) => {
                      const isEditing = editingVar?.prodId === p.id && editingVar?.varId === v.id;
                      return (
                        <div key={v.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">{v.capacity}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">SKU: {v.sku}</span>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-[11px] text-slate-500">
                                Stock: <strong className={v.stock < lowStockThreshold ? "text-red-500" : "text-slate-700"}>{v.stock}</strong>
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Price: <strong>${v.price.toFixed(2)}</strong>
                              </span>
                            </div>
                          </div>

                          <div>
                            {isEditing ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400 w-8">Stk:</span>
                                  <input
                                    type="number"
                                    value={tempStock}
                                    onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                                    className="w-14 rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400 w-8">Prc:</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                                    className="w-14 rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] focus:outline-none"
                                  />
                                </div>
                                <button
                                  onClick={handleSaveEdit}
                                  className="w-full text-center rounded bg-emerald-600 text-white font-bold text-[9px] py-1 shadow-sm"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(p.id, v)}
                                className="rounded bg-white border border-slate-200 p-1.5 text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider">Order Submissions Pipeline</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Track and verify direct checkout receipts generated by the Instagram ordering bridge.</p>
              </div>
              <ShoppingCart size={16} className="text-slate-400" />
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No orders placed during this session. Checkout cart to generate active receipts.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-950 font-mono">{o.id}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Date: {o.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          ${o.totalAmount.toFixed(2)}
                        </span>
                        
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                          className={`rounded border px-2 py-0.5 text-[10px] font-bold focus:outline-none ${
                            o.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : o.status === "SHIPPED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-pink-50 text-pink-700 border-pink-200"
                          }`}
                        >
                          <option value="PENDING_IG">Awaiting DM</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 space-y-1">
                      <div><strong>Customer:</strong> {o.customerName} ({o.phone})</div>
                      <div><strong>Destination:</strong> {o.city} - {o.address}</div>
                      <div><strong>Items:</strong> {o.items.map((i: any) => `${i.productTitle} (${i.variantCap} x${i.quantity})`).join(", ")}</div>
                      {o.notes && <div><strong>Notes:</strong> <span className="italic text-slate-500">"{o.notes}"</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Control Panel */}
        <div className="space-y-6">
          
          {/* Low Stock Watchdog Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <ShieldAlert size={16} className="text-red-500" />
              <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider">Low Stock Watchdog</h4>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex items-center gap-2 text-[11px] text-slate-500 rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span>All warehouse inventory levels are healthy! No low stock alerts active.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                  Automatic monitoring spots any variant with less than <strong>{lowStockThreshold} pieces</strong> in stock:
                </div>
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-red-50 bg-red-50/10 p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px] leading-tight">{item.prodTitle}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{item.variantCap} ({item.variantSku})</span>
                    </div>
                    <div className="text-center">
                      <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 block">
                        {item.stock} left
                      </span>
                      <button
                        onClick={() => onUpdateVariantStock(item.prodId, item.varId, 150)}
                        className="text-[9px] font-bold text-emerald-600 hover:underline block mt-1"
                      >
                        Replenish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marketing Discount Vouchers Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Tag size={16} className="text-slate-800" />
              <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider">Discount Coupon Generator</h4>
            </div>

            <div className="space-y-4">
              {/* List active coupons */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {coupons.map((c) => (
                  <div key={c.code} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-950 font-mono">{c.code}</span>
                      <span className="text-[10px] text-slate-400 block">{c.type}</span>
                    </div>
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                      {c.discount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form to create new coupon */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Generate New Coupon</span>
                
                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. BRANDING50"
                    className="w-full rounded border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs focus:border-slate-950 uppercase"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1">Discount Amount</label>
                  <input
                    type="text"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    placeholder="e.g. 50% or $10.00"
                    className="w-full rounded border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs focus:border-slate-950"
                  />
                </div>

                <button
                  onClick={handleCreateCoupon}
                  disabled={!newCouponCode || !newCouponVal}
                  className="w-full rounded bg-slate-900 py-1.5 text-xs font-semibold text-white shadow hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 transition-colors cursor-pointer"
                >
                  Create Voucher
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
