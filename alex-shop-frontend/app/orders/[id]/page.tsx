"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

type OrderItem = {
    id: number;
    product: { id: number; nameJa: string; nameEn: string; nameZh: string; price: number; imageUrl: string };
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

const STATUS_COLOR: Record<string, string> = {
    pending:          "border-yellow-300 text-yellow-600",
    processing:       "border-blue-300 text-blue-600",
    shipped:          "border-indigo-300 text-indigo-600",
    delivered:        "border-green-300 text-green-600",
    cancel_requested: "border-amber-400 text-amber-600",
    cancelled:        "border-red-300 text-red-400",
};

export default function OrderDetailPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const { id } = useParams();
    const { lang } = useLanguage();
    const tr = t[lang];

    const getStatusLabel = (status: string) =>
        tr.statusLabels[status as keyof typeof tr.statusLabels] ?? status;

    const getName = (p: OrderItem["product"]) =>
        lang === "en" ? p.nameEn : lang === "zh" ? p.nameZh : p.nameJa;

    const handleRequestCancel = async () => {
        try {
            const res = await api.put(`/api/orders/${id}/request-cancel`);
            setOrder(res.data);
            setShowConfirm(false);
        } catch (err: any) {
            alert(err.response?.data?.error || tr.errorGeneral);
            setShowConfirm(false);
        }
    };

    useEffect(() => {
        api.get(`/api/orders/${id}`).then((res) => setOrder(res.data));
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-8 py-12">
            {order && (
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="text-xs tracking-widest text-stone-400 mb-2">{tr.orderNo} #{order.id}</p>
                        <h1 className="text-2xl font-light text-stone-800">{tr.orderDetail}</h1>
                    </div>

                    <div className="border border-stone-200 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">{tr.status}</p>
                            <span className={`text-xs tracking-widest px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] ?? "border-stone-300 text-stone-600"}`}>
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">{tr.orderDate}</p>
                            <p className="text-sm text-stone-700">{order.createdAt.slice(0, 10)}</p>
                        </div>
                        {order.shippingAddress && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">{tr.shippingAddress}</p>
                                <p className="text-sm text-stone-700 text-right">{order.shippingCountry} / {order.shippingAddress}</p>
                            </div>
                        )}
                        {order.shippingFee > 0 && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">{tr.shipping}</p>
                                <p className="text-sm text-stone-700">¥{order.shippingFee.toLocaleString()}</p>
                            </div>
                        )}
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                                <p className="text-xs tracking-widest text-stone-500">{tr.discount}</p>
                                <p className="text-sm text-green-600">-¥{order.discountAmount.toLocaleString()}</p>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                            <p className="text-xs tracking-widest text-stone-500">{tr.trackingNo}</p>
                            <p className="text-sm text-stone-700 font-mono">{order.trackingNumber ?? "—"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs tracking-widest text-stone-500">{tr.total}</p>
                            <p className="text-xl font-light text-stone-800">¥{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {["pending", "processing"].includes(order.status) && (
                        <button onClick={() => setShowConfirm(true)} className="w-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 py-3 rounded-full text-sm tracking-widest transition">
                            {tr.requestCancel}
                        </button>
                    )}

                    {showConfirm && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col gap-6">
                                <p className="text-stone-700 text-sm tracking-wide text-center">{tr.requestCancel}?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 border border-stone-200 text-stone-500 py-2 rounded-full text-sm tracking-widest hover:bg-stone-50 transition"
                                    >
                                        {tr.cancelBtn}
                                    </button>
                                    <button
                                        onClick={handleRequestCancel}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full text-sm tracking-widest transition"
                                    >
                                        {tr.confirmBtn}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {order.status === "cancel_requested" && (
                        <p className="text-center text-sm text-amber-500 tracking-widest py-2">{tr.cancelRequested}</p>
                    )}

                    <div>
                        <h2 className="text-xs tracking-widest text-stone-500 mb-4">{tr.orderItemsLabel}</h2>
                        <div className="flex flex-col gap-4">
                            {order.orderItems?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b border-stone-100 pb-4">
                                    <img src={item.product.imageUrl} alt={getName(item.product)} className="w-16 h-16 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                                    <div className="flex-1">
                                        <p className="text-stone-800 text-sm">{getName(item.product)}</p>
                                        <p className="text-stone-400 text-xs">{tr.qty}: {item.quantity}</p>
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
