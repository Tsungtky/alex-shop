"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
    id: number;
    product: {
        id: number;
        nameJa: string;
    };
    quantity: number;
    unitPrice: number;
};

type Order = {
    id: number;
    user: { firstName: string; lastName: string; email: string };
    status: string;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    shippingCountry: string;
    shippingAddress: string;
    createdAt: string;
    orderItems: OrderItem[];
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];

export default function AdminOrderDetailPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/api/orders/${id}`);
                setOrder(res.data);
                setSelectedStatus(res.data.status);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();
    }, []);

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/api/orders/${id}?status=${selectedStatus}`);
            setOrder((prev) => prev ? { ...prev, status: selectedStatus } : prev);
            alert("ステータスを更新しました");
        } catch (err) {
            alert("更新に失敗しました");
        }
    };

    const handleCancel = async () => {
        if (!confirm("この注文をキャンセルしますか？")) return;
        try {
            await api.put(`/api/orders/${id}/cancel`);
            setOrder((prev) => prev ? { ...prev, status: "cancelled" } : prev);
        } catch (err) {
            alert("キャンセルに失敗しました");
        }
    };

    if (!order) return null;

    return (
        <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <p className="text-xs tracking-widest text-stone-400 mb-2">注文番号 #{order.id}</p>
                    <h1 className="text-2xl font-light text-stone-800">注文詳細</h1>
                </div>

                {/* 注文情報 */}
                <div className="border border-stone-200 rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <p className="text-xs tracking-widest text-stone-500">顧客</p>
                        <p className="text-sm text-stone-700">{order.user?.firstName} {order.user?.lastName} / {order.user?.email}</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <p className="text-xs tracking-widest text-stone-500">注文日</p>
                        <p className="text-sm text-stone-700">{order.createdAt?.slice(0, 10)}</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                        <p className="text-xs tracking-widest text-stone-500">配送先</p>
                        <p className="text-sm text-stone-700">{order.shippingCountry} / {order.shippingAddress}</p>
                    </div>
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
                    <div className="flex justify-between items-center">
                        <p className="text-xs tracking-widest text-stone-500">合計</p>
                        <p className="text-xl font-light text-stone-800">¥{order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                {/* 商品明細 */}
                <div>
                    <h2 className="text-xs tracking-widest text-stone-500 mb-4">注文商品</h2>
                    <div className="flex flex-col gap-4">
                        {order.orderItems?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b border-stone-100 pb-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-stone-800 text-sm">{item.product.nameJa}</p>
                                    <p className="text-stone-400 text-xs">商品番号 #{item.product.id} · 数量: {item.quantity}</p>
                                </div>
                                <p className="text-stone-700 text-sm">¥{(item.unitPrice * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ステータス更新 */}
                {order.status !== "cancelled" && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs tracking-widest text-stone-500">ステータス更新</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-full text-sm tracking-widest transition"
                            >
                                更新
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-6 py-2 rounded-full text-sm tracking-widest transition"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
                {order.status === "cancelled" && (
                    <p className="text-sm text-stone-400 tracking-widest text-center py-4">この注文はキャンセル済みです</p>
                )}
            </div>
        </div>
    );
}
