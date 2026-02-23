"use client";

import React from "react";
import { Document, Page, Text, View, PDFViewer, Image } from "@react-pdf/renderer";
import { corporateTheme, creativeTheme, minimalTheme, modernTheme, elegantTheme } from "@/styles/pdfThemes";

export type ThemeType = "corporate" | "creative" | "minimal" | "modern" | "elegant";

interface LineItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
}

interface PDFPreviewProps {
    theme: ThemeType;
    clientName: string;
    markdown: string;
    lineItems: LineItem[];
    totalAmount: number;
    showConversion?: boolean;
    convertedTotal?: number;
    currencySymbol?: string;
    terms?: string;
    showSignatures?: boolean;
    logoUrl?: string;
}

const getStyles = (theme: ThemeType) => {
    switch (theme) {
        case "creative": return creativeTheme;
        case "minimal": return minimalTheme;
        case "modern": return modernTheme;
        case "elegant": return elegantTheme;
        default: return corporateTheme;
    }
};

const parseInlineStyles = (text: string) => {
    // Simple parser for bold and italic markdown elements in react-pdf
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Using standard bold logic within the parent <Text> block's inherited font
            return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
        } else if (part.startsWith('*') && part.endsWith('*')) {
            return <Text key={index} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
        }
        return <Text key={index}>{part}</Text>;
    });
};

const renderMarkdownToPDF = (markdown: string, styles: any) => {
    if (!markdown) return null;
    const lines = markdown.split("\n");

    return lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <Text key={index} style={styles.text}>{" "}</Text>;

        if (trimmed.startsWith("# ")) {
            return <Text key={index} style={styles.header}>{parseInlineStyles(trimmed.replace(/^#\s/, ''))}</Text>;
        } else if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
            return <Text key={index} style={styles.subHeader}>{parseInlineStyles(trimmed.replace(/^#+\s/, ''))}</Text>;
        } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            return <Text key={index} style={styles.text}>• {parseInlineStyles(trimmed.replace(/^[\*-]\s/, ''))}</Text>;
        } else if (trimmed.match(/^\d+\.\s/)) {
            return <Text key={index} style={styles.text}>{parseInlineStyles(trimmed)}</Text>;
        } else {
            return <Text key={index} style={styles.text}>{parseInlineStyles(trimmed)}</Text>;
        }
    });
};

const ProposalPDF = ({ theme, clientName, markdown, lineItems, totalAmount, showConversion, convertedTotal, currencySymbol, terms, showSignatures, logoUrl }: PDFPreviewProps) => {
    const styles = getStyles(theme);
    const validItems = lineItems.filter(item => item.description.trim() !== "");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={styles.header}>Proposal for {clientName || "Client"}</Text>
                    {logoUrl && <Image src={logoUrl} style={{ width: 80, height: 'auto', objectFit: 'contain' }} />}
                </View>

                <View>
                    {renderMarkdownToPDF(markdown, styles)}
                </View>

                {validItems.length > 0 && (
                    <View style={{ marginTop: 20 }} wrap={false}>
                        <Text style={styles.subHeader}>Estimated Investment</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableColHeader, { width: "40%" }]}><Text style={styles.tableCellHeader}>Description</Text></View>
                                <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Quantity</Text></View>
                                <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Unit Price</Text></View>
                                <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.tableCellHeader}>Total</Text></View>
                            </View>
                            {validItems.map((item, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.tableCell}>{item.description}</Text></View>
                                    <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                                    <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.tableCell}>${item.unit_price.toFixed(2)}</Text></View>
                                    <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.tableCell}>${(item.quantity * item.unit_price).toFixed(2)}</Text></View>
                                </View>
                            ))}
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>
                                Total: ${totalAmount.toFixed(2)}
                            </Text>
                            {showConversion && convertedTotal ? (
                                <Text style={[styles.totalText, { fontSize: 10, color: "#64748b", marginTop: 4 }]}>
                                    (Approx: {currencySymbol}{convertedTotal.toFixed(0)})
                                </Text>
                            ) : null}
                        </View>
                    </View>
                )}

                {terms && (
                    <View style={{ marginTop: 30 }} wrap={false}>
                        <Text style={styles.subHeader}>Terms & Conditions</Text>
                        <Text style={styles.text}>{terms}</Text>
                    </View>
                )}

                {showSignatures && (
                    <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
                        <View style={{ width: '40%' }}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 5, height: 40 }} />
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Prepared By</Text>
                        </View>
                        <View style={{ width: '40%' }}>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 5, height: 40 }} />
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Accepted By: {clientName || "Client"}</Text>
                            <Text style={{ fontSize: 10, color: '#666', marginTop: 3 }}>Date: ________________________</Text>
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default function PDFPreview(props: PDFPreviewProps) {
    return (
        <PDFViewer width="100%" height="600px" style={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <ProposalPDF {...props} />
        </PDFViewer>
    );
}
