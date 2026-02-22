"use client";

import React, { useState, useEffect } from "react";

export interface LineItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
}

interface Props {
    items: LineItem[];
    onItemsChange: (items: LineItem[], total: number) => void;
}

export default function LineItemCalculator({ items, onItemsChange }: Props) {
    const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        const total = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        onItemsChange(newItems, total);
    };

    const addItem = () => {
        const newItems = [...items, { description: "", quantity: 1, unit_price: 0 }];
        const total = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        onItemsChange(newItems, total);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        const total = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        onItemsChange(newItems, total);
    };

    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    return (
        <div style={{ padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem", color: "#1e293b" }}>Estimate Calculator</h3>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ paddingBottom: "0.5rem", color: "#64748b" }}>Description</th>
                        <th style={{ paddingBottom: "0.5rem", color: "#64748b" }}>Qty</th>
                        <th style={{ paddingBottom: "0.5rem", color: "#64748b" }}>Price</th>
                        <th style={{ paddingBottom: "0.5rem", color: "#64748b" }}>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "0.5rem 0" }}>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                    placeholder="Service description"
                                    style={{ width: "95%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                />
                            </td>
                            <td style={{ padding: "0.5rem 0" }}>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                    style={{ width: "80%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                />
                            </td>
                            <td style={{ padding: "0.5rem 0" }}>
                                <input
                                    type="number"
                                    value={item.unit_price}
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                                    style={{ width: "80%", padding: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                />
                            </td>
                            <td style={{ padding: "0.5rem 0", color: "#334155", fontWeight: "500" }}>
                                ${(item.quantity * item.unit_price).toFixed(2)}
                            </td>
                            <td style={{ padding: "0.5rem 0", textAlign: "right" }}>
                                <button
                                    onClick={() => removeItem(index)}
                                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <button
                    onClick={addItem}
                    style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#334155", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: "500" }}>
                    + Add Line Item
                </button>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>
                    Total: ${total.toFixed(2)}
                </div>
            </div>
        </div>
    );
}
