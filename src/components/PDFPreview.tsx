"use client";

import React from "react";
import { Document, Page, Text, View, PDFViewer } from "@react-pdf/renderer";
import { corporateTheme, creativeTheme, minimalTheme } from "@/styles/pdfThemes";

export type ThemeType = "corporate" | "creative" | "minimal";

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
}

const getStyles = (theme: ThemeType) => {
    switch (theme) {
        case "creative": return creativeTheme;
        case "minimal": return minimalTheme;
        default: return corporateTheme;
    }
};

const renderMarkdownToPDF = (markdown: string, styles: any) => {
    if (!markdown) return null;
    const lines = markdown.split("\n");

    return lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <Text key={index} style={styles.text}>{" "}</Text>;

        if (trimmed.startsWith("# ")) {
            return <Text key={index} style={styles.header}>{trimmed.replace(/^#\s/, '')}</Text>;
        } else if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
            return <Text key={index} style={styles.subHeader}>{trimmed.replace(/^#+\s/, '')}</Text>;
        } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            return <Text key={index} style={styles.text}>• {trimmed.replace(/^[\*-]\s/, '')}</Text>;
        } else if (trimmed.match(/^\d+\.\s/)) {
            return <Text key={index} style={styles.text}>{trimmed}</Text>;
        } else {
            return <Text key={index} style={styles.text}>{trimmed}</Text>;
        }
    });
};

const ProposalPDF = ({ theme, clientName, markdown, lineItems, totalAmount }: PDFPreviewProps) => {
    const styles = getStyles(theme);
    const validItems = lineItems.filter(item => item.description.trim() !== "");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.header}>Proposal for {clientName || "Client"}</Text>
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
                            <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
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
