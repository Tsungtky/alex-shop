"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Toast from "@/components/Toast";

type CartItem = {
    id: number;
    product: { id: number; nameJa: string; price: number; imageUrl: string };
    quantity: number;
};

type Coupon = {
    type: string;
    value: number;
    minOrder: number;
    isActive: boolean;
};

type ShippingInfo = {
    firstName: string;
    lastName: string;
    phoneCountryCode: string;
    phone: string;
    country: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
};

const COUNTRIES = [
    { code: "Taiwan", label: "台湾" },
    { code: "Japan", label: "日本" },
    { code: "Korea", label: "韓国" },
    { code: "USA", label: "アメリカ" },
    { code: "Thailand", label: "タイ" },
];

const PHONE_CODES = [
    { code: "+886", label: "+886 (TW)" },
    { code: "+81", label: "+81 (JP)" },
    { code: "+82", label: "+82 (KR)" },
    { code: "+1", label: "+1 (US)" },
    { code: "+66", label: "+66 (TH)" },
];

const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
    "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
    "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
    "Wisconsin","Wyoming",
];

const empty: ShippingInfo = {
    firstName: "", lastName: "", phoneCountryCode: "+81", phone: "",
    country: "", address: "", apartment: "", city: "", state: "", postalCode: "",
};

const inputClass = "w-full border-0 border-b border-stone-200 bg-transparent p-2 focus:outline-none focus:border-stone-500 text-stone-700 placeholder-stone-300 text-sm transition";
const selectClass = "w-full border-0 border-b border-stone-200 bg-transparent p-2 focus:outline-none focus:border-stone-500 text-stone-700 text-sm transition";
const labelClass = "text-xs text-stone-400 tracking-widest mb-1 block";

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [shipping, setShipping] = useState<ShippingInfo>(empty);
    const [sameAsBuyer, setSameAsBuyer] = useState(false);
    const [savedInfo, setSavedInfo] = useState<ShippingInfo>(empty);
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) { router.push("/login"); return; }

        api.get(`/api/cart/user/${userId}`).then((res) => setCartItems(res.data));

        api.get(`/api/users/${userId}`).then((res) => {
            const u = res.data;
            const info: ShippingInfo = {
                firstName: u.firstName ?? "",
                lastName: u.lastName ?? "",
                phoneCountryCode: u.phoneCountryCode ?? "+81",
                phone: u.phone ?? "",
                country: u.country ?? "",
                address: u.address ?? "",
                apartment: u.apartment ?? "",
                city: u.city ?? "",
                state: u.state ?? "",
                postalCode: u.postalCode ?? "",
            };
            setSavedInfo(info);
        });
    }, []);

    useEffect(() => {
        if (!shipping.country) return;
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        api.get(`/api/orders/shipping-fee?country=${shipping.country}&userId=${userId}`)
            .then((res) => setShippingFee(res.data))
            .catch(() => setShippingFee(null));
    }, [shipping.country]);

    const set = (field: keyof ShippingInfo, value: string) =>
        setShipping((prev) => ({ ...prev, [field]: value }));

    const handleSameAsBuyer = (checked: boolean) => {
        setSameAsBuyer(checked);
        setShipping(checked ? savedInfo : empty);
    };

    const handleApplyCoupon = async () => {
        try {
            const res = await api.get(`/api/coupons/${couponCode}`);
            const coupon: Coupon = res.data;
            if (!coupon.isActive) { alert("このクーポンは無効です"); return; }
            if (itemTotal < coupon.minOrder) { alert(`最低注文金額は¥${coupon.minOrder.toLocaleString()}です`); return; }
            setAppliedCoupon(coupon);
        } catch {
            alert("クーポンが見つかりません");
        }
    };

    const handlePlaceOrder = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) { router.push("/login"); return; }
        if (!shipping.firstName || !shipping.lastName || !shipping.country || !shipping.address || !shipping.city || !shipping.postalCode) {
            setToast({ message: "配送先を入力してください", type: "error" });
            return;
        }
        try {
            await api.get(`/api/orders/check-stock?userId=${userId}`);
            const res = await api.post("/api/payments/create-payment-intent",
                { userId: Number(userId), shippingCountry: shipping.country, couponCode });
            const clientSecret = res.data;

            localStorage.setItem("shippingFirstName", shipping.firstName);
            localStorage.setItem("shippingLastName", shipping.lastName);
            localStorage.setItem("shippingPhoneCountryCode", shipping.phoneCountryCode);
            localStorage.setItem("shippingPhone", shipping.phone);
            localStorage.setItem("shippingCountry", shipping.country);
            localStorage.setItem("shippingAddress", shipping.address);
            localStorage.setItem("shippingApartment", shipping.apartment);
            localStorage.setItem("shippingCity", shipping.city);
            localStorage.setItem("shippingState", shipping.state);
            localStorage.setItem("shippingPostalCode", shipping.postalCode);
            localStorage.setItem("couponCode", couponCode);

            router.push(`/payment?client_secret=${clientSecret}&amount=${finalAmount}`);
        } catch (err: any) {
            setToast({ message: err.response?.data?.error || "エラーが発生しました", type: "error" });
        }
    };

    const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalAmount = itemTotal + (shippingFee ?? 0);
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === "percent") discountAmount = Math.floor(totalAmount * appliedCoupon.value / 100);
        else if (appliedCoupon.type === "fixed") discountAmount = appliedCoupon.value;
        else if (appliedCoupon.type === "free_shipping") discountAmount = shippingFee ?? 0;
    }
    const finalAmount = totalAmount - discountAmount;

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文確認</h1>
            <div className="grid grid-cols-2 gap-12">

                {/* 注文商品 */}
                <div>
                    <h2 className="text-xs tracking-widest text-stone-500 mb-4">注文商品</h2>
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-stone-100 pb-4">
                                <img src={item.product.imageUrl} alt={item.product.nameJa} className="w-16 h-16 object-cover rounded-lg" />
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
                            <span>小計</span><span>¥{itemTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>送料</span><span>{shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : "—"}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>割引</span><span>-¥{discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-stone-800 font-light text-lg border-t border-stone-200 pt-2 mt-2">
                            <span>合計</span><span>{shippingFee !== null ? `¥${finalAmount.toLocaleString()}` : "—"}</span>
                        </div>
                    </div>
                </div>

                {/* 配送情報 */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-xs tracking-widest text-stone-500">配送先</h2>

                    {/* 購買者と同じ */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sameAsBuyer}
                            onChange={(e) => handleSameAsBuyer(e.target.checked)}
                            className="accent-stone-800"
                        />
                        <span className="text-sm text-stone-600">購入者と同じ住所</span>
                    </label>

                    {/* フォーム */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input className={inputClass} value={shipping.firstName} onChange={(e) => set("firstName", e.target.value)} disabled={sameAsBuyer} />
                            </div>
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input className={inputClass} value={shipping.lastName} onChange={(e) => set("lastName", e.target.value)} disabled={sameAsBuyer} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>電話番号</label>
                            <div className="flex gap-2">
                                <select
                                    className="border-0 border-b border-stone-200 bg-transparent p-2 focus:outline-none focus:border-stone-500 text-stone-700 text-sm transition"
                                    value={shipping.phoneCountryCode}
                                    onChange={(e) => set("phoneCountryCode", e.target.value)}
                                    disabled={sameAsBuyer}
                                >
                                    {PHONE_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                                </select>
                                <input
                                    className={inputClass}
                                    placeholder="90-0000-0000"
                                    value={shipping.phone}
                                    onChange={(e) => set("phone", e.target.value.replace(/^0+/, ""))}
                                    disabled={sameAsBuyer}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>国</label>
                            <select className={selectClass} value={shipping.country} onChange={(e) => set("country", e.target.value)} disabled={sameAsBuyer}>
                                <option value="">選択してください</option>
                                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>住所</label>
                            <input className={inputClass} value={shipping.address} onChange={(e) => set("address", e.target.value)} disabled={sameAsBuyer} />
                        </div>
                        <div>
                            <label className={labelClass}>アパート・部屋番号（任意）</label>
                            <input className={inputClass} value={shipping.apartment} onChange={(e) => set("apartment", e.target.value)} disabled={sameAsBuyer} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>市区町村</label>
                                <input className={inputClass} value={shipping.city} onChange={(e) => set("city", e.target.value)} disabled={sameAsBuyer} />
                            </div>
                            <div>
                                <label className={labelClass}>郵便番号</label>
                                <input className={inputClass} value={shipping.postalCode} onChange={(e) => set("postalCode", e.target.value)} disabled={sameAsBuyer} />
                            </div>
                        </div>
                        {shipping.country === "US" && (
                            <div>
                                <label className={labelClass}>州</label>
                                <select className={selectClass} value={shipping.state} onChange={(e) => set("state", e.target.value)} disabled={sameAsBuyer}>
                                    <option value="">選択してください</option>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* クーポン */}
                    <div>
                        <label className={labelClass}>クーポンコード（任意）</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => { setCouponCode(e.target.value); setAppliedCoupon(null); }}
                                placeholder="クーポンコード"
                                className="flex-1 border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                            <button onClick={handleApplyCoupon} className="border border-stone-300 text-stone-600 px-4 py-2 rounded-lg text-sm hover:bg-stone-50 transition">
                                適用
                            </button>
                        </div>
                        {appliedCoupon && <p className="text-xs text-green-600 mt-1">クーポン適用済 -¥{discountAmount.toLocaleString()}</p>}
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-8 rounded-full text-sm tracking-widest transition"
                    >
                        注文する
                    </button>
                </div>
            </div>
        </div>
    );
}
