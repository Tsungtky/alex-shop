"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { lang } = useLanguage();
    const tr = t[lang];

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            const userId = localStorage.getItem("userId");
            const couponCode = localStorage.getItem("couponCode");
            const shippingFirstName = localStorage.getItem("shippingFirstName");
            const shippingLastName = localStorage.getItem("shippingLastName");
            const shippingPhoneCountryCode = localStorage.getItem("shippingPhoneCountryCode");
            const shippingPhone = localStorage.getItem("shippingPhone");
            const shippingCountry = localStorage.getItem("shippingCountry");
            const shippingAddress = localStorage.getItem("shippingAddress");
            const shippingApartment = localStorage.getItem("shippingApartment");
            const shippingCity = localStorage.getItem("shippingCity");
            const shippingState = localStorage.getItem("shippingState");
            const shippingPostalCode = localStorage.getItem("shippingPostalCode");

            try {
                await api.post("/api/orders", {
                    user: { id: Number(userId) },
                    couponCode, shippingFirstName, shippingLastName,
                    shippingPhoneCountryCode, shippingPhone, shippingCountry,
                    shippingAddress, shippingApartment, shippingCity,
                    shippingState, shippingPostalCode,
                });

                ["shippingFirstName","shippingLastName","shippingPhoneCountryCode","shippingPhone",
                 "shippingCountry","shippingAddress","shippingApartment","shippingCity",
                 "shippingState","shippingPostalCode","couponCode"].forEach((k) => localStorage.removeItem(k));

                router.push("/orders");
            } catch (err: any) {
                alert(err.response?.data?.error || tr.orderFailed);
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-8 rounded-full text-sm tracking-widest transition disabled:opacity-50"
            >
                {loading ? tr.paymentProcessing : tr.paymentBtn}
            </button>
        </form>
    );
}

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get("client_secret");
    const amount = searchParams.get("amount");
    const { lang } = useLanguage();
    const tr = t[lang];

    if (!clientSecret) return null;

    return (
        <div className="max-w-lg mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">{tr.paymentTitle}</h1>
            {amount && (
                <div className="bg-stone-100 rounded-xl px-6 py-4 mb-8 flex justify-between items-center">
                    <span className="text-stone-500 text-sm tracking-widest">{tr.paymentAmount}</span>
                    <span className="text-2xl font-light text-stone-800">¥{Number(amount).toLocaleString()}</span>
                </div>
            )}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}
