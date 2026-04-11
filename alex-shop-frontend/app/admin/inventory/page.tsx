"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type Product = {
    id: number;
    nameJa: string;
    nameEn: string;
    nameZh: string;
    price: number;
    stock: number;
    category: string;
    weight: number;
    imageUrl: string;
    status: string;
};

const EMPTY_FORM = {
    nameJa: "",
    nameEn: "",
    nameZh: "",
    price: "",
    stock: "",
    category: "",
    weight: "",
    imageUrl: "",
};

const FIELDS = [
    { key: "nameJa", label: "商品名（日本語）" },
    { key: "nameEn", label: "商品名（英語）" },
    { key: "nameZh", label: "商品名（中国語）" },
    { key: "category", label: "カテゴリー" },
    { key: "price", label: "価格（¥）" },
    { key: "stock", label: "在庫数" },
    { key: "weight", label: "重量（g）" },
];

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get("/api/products");
        setProducts(res.data);
    };

    const uploadImage = async (file: File | null, fallbackUrl: string): Promise<string> => {
        if (!file) return fallbackUrl;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return res.data.secure_url;
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const imageUrl = (await uploadImage(imageFile, form.imageUrl)) || "https://placehold.co/400x400?text=No+Image";
            await api.post("/api/products", {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                weight: Number(form.weight),
                imageUrl,
            });
            setForm(EMPTY_FORM);
            setImageFile(null);
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            alert("エラーが発生しました");
        }
        setUploading(false);
    };

    const handleUpdate = async () => {
        if (!editingProduct) return;
        setUploading(true);
        try {
            const imageUrl = (await uploadImage(editImageFile, editingProduct.imageUrl)) || "https://placehold.co/400x400?text=No+Image";
            await api.put(`/api/products/${editingProduct.id}`, {
                ...editingProduct,
                imageUrl,
            });
            setEditingProduct(null);
            setEditImageFile(null);
            fetchProducts();
        } catch (err) {
            alert("エラーが発生しました");
        }
        setUploading(false);
    };

    const handleArchive = async (id: number) => {
        if (!confirm("この商品を下架しますか？")) return;
        await api.put(`/api/products/${id}/archive`);
        fetchProducts();
    };

    const closeModal = () => {
        setEditingProduct(null);
        setEditImageFile(null);
    };

    return (
        <div className="max-w-5xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-light text-stone-800 tracking-widest">商品管理</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-full text-sm tracking-widest transition"
                >
                    {showForm ? "キャンセル" : "+ 新規商品"}
                </button>
            </div>

            {/* 新增表單 */}
            {showForm && (
                <div className="border border-stone-200 rounded-xl p-6 mb-8 flex flex-col gap-4">
                    <h2 className="text-xs tracking-widest text-stone-500">新規商品追加</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {FIELDS.map(({ key, label }) => (
                            <div key={key}>
                                <label className="text-xs text-stone-400 mb-1 block">{label}</label>
                                <input
                                    type="text"
                                    value={form[key as keyof typeof form]}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">商品画像</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-stone-700"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-2 rounded-full text-sm tracking-widest transition disabled:opacity-50"
                        >
                            {uploading ? "アップロード中..." : "追加する"}
                        </button>
                    </div>
                </div>
            )}

            {/* 商品列表 */}
            <div className="flex flex-col gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`border rounded-xl px-6 py-4 flex items-center gap-4 ${
                            product.status === "archived" ? "border-stone-100 opacity-50" : "border-stone-200"
                        }`}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.nameJa}
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <p className="text-stone-800 font-light">{product.nameJa}</p>
                            <p className="text-xs text-stone-400">
                                ¥{product.price?.toLocaleString()} · 在庫: {product.stock} · {product.category}
                            </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border ${
                            product.status === "archived"
                                ? "border-stone-200 text-stone-400"
                                : "border-green-200 text-green-600"
                        }`}>
                            {product.status === "archived" ? "下架済" : "販売中"}
                        </span>
                        <button
                            onClick={() => setEditingProduct(product)}
                            className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 px-3 py-1 rounded-lg transition"
                        >
                            編集
                        </button>
                        {product.status !== "archived" && (
                            <button
                                onClick={() => handleArchive(product.id)}
                                className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition"
                            >
                                下架
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* 編集 Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg flex flex-col gap-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-light text-stone-800">商品編集</h2>
                            <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 text-xl">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {FIELDS.map(({ key, label }) => (
                                <div key={key}>
                                    <label className="text-xs text-stone-400 mb-1 block">{label}</label>
                                    <input
                                        type="text"
                                        value={String(editingProduct[key as keyof Product] ?? "")}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, [key]: e.target.value })}
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs text-stone-400 mb-1 block">商品画像（変更する場合）</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-stone-700"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={closeModal}
                                className="text-sm text-stone-500 px-6 py-2 rounded-full border border-stone-200 hover:bg-stone-50 transition"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={uploading}
                                className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-2 rounded-full text-sm tracking-widest transition disabled:opacity-50"
                            >
                                {uploading ? "更新中..." : "更新する"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
