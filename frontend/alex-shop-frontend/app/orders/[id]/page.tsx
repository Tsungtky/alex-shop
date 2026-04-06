"use client";

import axios from "axios";
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
};

export default function OrderDetailPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("ログインしてください。");
            return;
        }
        const fetchOrder = async () => {
            const res = await axios.get(`http://localhost:8080/api/orders/${id}`);
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
                            <span className="text-xs tracking-widest px-3 py-1 rounded-full border border-stone-300 text-stone-600">
                                {order.status}
                            </span>
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
                        <div className="flex justify-between items-center">
                            <p className="text-xs tracking-widest text-stone-500">合計</p>
                            <p className="text-xl font-light text-stone-800">¥{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

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
