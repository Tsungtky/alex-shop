"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type CartItem = {
    id: number;
    product: {
        id: number;
        nameJa: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
};

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [shippingCountry, setShippingCountry] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [couponCode, setCouponCode] = useState("");
    const router = useRouter();


    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("ログインしてください。");
            return;
        }
        const fetchCartItems = async () => {
            const res = await axios.get(`http://localhost:8080/api/cart/user/${userId}`);
            setCartItems(res.data);
        };
        fetchCartItems();
    }, []);

    useEffect(() => {
        if (!shippingCountry) return;
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const fetchShippingFee = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/orders/shipping-fee?country=${shippingCountry}&userId=${userId}`);
                setShippingFee(res.data);
            } catch (err: any) {
                alert(err.response?.data?.message || "送料の取得に失敗しました");
            }
        };
        fetchShippingFee();
    }, [shippingCountry]);

    const handlePlaceOrder = async () => {
        const userId = localStorage.getItem("userId"); 
        if (!userId) {
            alert("ログインしてください。");
            return;
        }
        try {
            const res = await axios.post("http://localhost:8080/api/payments/create-payment-intent",
                totalAmount,
             { headers: { "Content-Type": "application/json" } });
            const clientSecret = res.data;
         
            localStorage.setItem("shippingCountry", shippingCountry);
            localStorage.setItem("shippingAddress", shippingAddress);
            localStorage.setItem("couponCode", couponCode);

            router.push(`/payment?client_secret=${clientSecret}`)

        } catch (err: any) {
            alert(err.response?.data?.message || "エラーが発生しました");
        }
    };

    const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalAmount = itemTotal + (shippingFee ?? 0);


    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文確認</h1>
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xs tracking-widest text-stone-500 mb-4">注文商品</h2>
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
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
                                <p className="text-stone-700 text-sm">¥{(item.product.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>小計</span>
                            <span>¥{itemTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>送料</span>
                            <span>{shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : "—"}</span>
                        </div>
                        <div className="flex justify-between text-stone-800 font-light text-lg border-t border-stone-200 pt-2 mt-2">
                            <span>合計</span>
                            <span>{shippingFee !== null ? `¥${(itemTotal + shippingFee).toLocaleString()}` : "—"}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xs tracking-widest text-stone-500 mb-4">配送情報</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">配送国</label>
                            <select
                                value={shippingCountry}
                                onChange={(e) => setShippingCountry(e.target.value)}
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            >
                                <option value="">国を選択してください</option>
                                <option value="Japan">日本</option>
                                <option value="Taiwan">台湾</option>
                                <option value="USA">アメリカ</option>
                                <option value="Korea">韓国</option>
                                <option value="China">中国</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">配送先住所</label>
                            <input
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="東京都渋谷区..."
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">クーポンコード（任意）</label>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="クーポンコード"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            className="mt-4 bg-stone-800 hover:bg-stone-900 text-white py-3 px-8 rounded-full text-sm tracking-widest transition"
                        >
                            注文する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
