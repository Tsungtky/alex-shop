"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderItem = {
    id: number;
    product: {
        id: number;
        nameJa: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
    unitPrice: number;
};

type Order = {
    id: number;
    status: string;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    shippingCountry: string;
    shippingAddress: string;
    createdAt: string;
    orderItems: OrderItem[];
    trackingNumber: string | null;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending:          { label: "pending",          color: "border-yellow-300 text-yellow-600" },
    processing:       { label: "processing",       color: "border-blue-300 text-blue-600" },
    shipped:          { label: "shipped",          color: "border-indigo-300 text-indigo-600" },
    delivered:        { label: "delivered",        color: "border-green-300 text-green-600" },
    cancel_requested: { label: "cancel requested", color: "border-amber-400 text-amber-600" },
    cancelled:        { label: "cancelled",        color: "border-red-300 text-red-400" },
};

export default function OrderDetailPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const { id } = useParams();

    const handleRequestCancel = async () => {
        if (!confirm("キャンセルをリクエストしますか？")) return;
        try {
            const res = await api.put(`/api/orders/${id}/request-cancel`);
            setOrder(res.data);
        } catch (err: any) {
            alert(err.response?.data?.error || "エラーが発生しました");
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("ログインしてください。");
            return;
        }
        const fetchOrder = async () => {
            const res = await api.get(`/api/orders/${id}`);
            setOrder(res.data);
        };
        fetchOrder();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-8 py-12">
            {order && (
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="text-xs tracking-widest text-stone-400 mb-2">注文番号 #{order.id}</p>
                        <h1 className="text-2xl font-light text-stone-800">注文詳細</h1>
                    </div>

                    {/* 金額サマリー */}
                    <div className="border border-stone-200 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">状態</p>
                            {(() => {
                                const s = STATUS_LABEL[order.status] ?? { label: order.status, color: "border-stone-300 text-stone-600" };
                                return (
                                    <span className={`text-xs tracking-widest px-3 py-1 rounded-full border ${s.color}`}>
                                        {s.label}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">注文日</p>
                            <p className="text-sm text-stone-700">{order.createdAt.slice(0, 10)}</p>
                        </div>
                        {order.shippingAddress && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">配送先</p>
                                <p className="text-sm text-stone-700 text-right">{order.shippingCountry} / {order.shippingAddress}</p>
                            </div>
                        )}
                        {order.shippingFee > 0 && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">送料</p>
                                <p className="text-sm text-stone-700">¥{order.shippingFee.toLocaleString()}</p>
                            </div>
                        )}
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">割引</p>
                                <p className="text-sm text-green-600">-¥{order.discountAmount.toLocaleString()}</p>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">配送追跡番号</p>
                            <p className="text-sm text-stone-700 font-mono">{order.trackingNumber ?? "—"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs tracking-widest text-stone-500">合計</p>
                            <p className="text-xl font-light text-stone-800">¥{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* キャンセルリクエスト */}
                    {["pending", "processing"].includes(order.status) && (
                        <button
                            onClick={handleRequestCancel}
                            className="w-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 py-3 rounded-full text-sm tracking-widest transition"
                        >
                            キャンセルをリクエストする
                        </button>
                    )}
                    {order.status === "cancel_requested" && (
                        <p className="text-center text-sm text-amber-500 tracking-widest py-2">
                            キャンセルリクエスト中
                        </p>
                    )}

                    {/* 注文商品明細 */}
                    <div>
                        <h2 className="text-xs tracking-widest text-stone-500 mb-4">注文商品</h2>
                        <div className="flex flex-col gap-4">
                            {order.orderItems?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b border-stone-100 pb-4">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.nameJa}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-stone-800 text-sm">{item.product.nameJa}</p>
                                        <p className="text-stone-400 text-xs">数量: {item.quantity}</p>
                                    </div>
                                    <p className="text-stone-700 text-sm">¥{(item.unitPrice * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
