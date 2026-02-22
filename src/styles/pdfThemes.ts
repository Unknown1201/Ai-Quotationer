import { StyleSheet } from "@react-pdf/renderer";

export const corporateTheme = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", color: "#333", backgroundColor: "#fff" },
    header: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#1a365d", fontWeight: "bold" },
    subHeader: { fontSize: 16, marginTop: 20, marginBottom: 10, color: "#2b6cb0", fontWeight: "bold", borderBottom: 1, borderBottomColor: "#e2e8f0", paddingBottom: 5 },
    text: { fontSize: 11, lineHeight: 1.5, marginBottom: 10, color: "#4a5568" },
    table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, marginTop: 15 },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { width: "25%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, backgroundColor: "#edf2f7", padding: 5 },
    tableCol: { width: "25%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, padding: 5 },
    tableCellHeader: { margin: "auto", fontSize: 10, fontWeight: "bold", color: "#2d3748" },
    tableCell: { margin: "auto", fontSize: 10, color: "#4a5568" },
    totalRow: { flexDirection: "row", backgroundColor: "#e2e8f0", marginTop: 5, padding: 5 },
    totalText: { fontSize: 12, fontWeight: "bold", textAlign: "right", width: "100%", color: "#1a365d" }
});

export const creativeTheme = StyleSheet.create({
    page: { padding: 40, fontFamily: "Times-Roman", color: "#2d3748", backgroundColor: "#fffaf0" },
    header: { fontSize: 28, marginBottom: 20, color: "#dd6b20", fontStyle: "italic", borderBottom: 2, borderBottomColor: "#dd6b20", paddingBottom: 10 },
    subHeader: { fontSize: 18, marginTop: 20, marginBottom: 10, color: "#c05621", fontStyle: "italic" },
    text: { fontSize: 12, lineHeight: 1.6, marginBottom: 10 },
    table: { display: "flex", width: "auto", marginTop: 15, borderTopWidth: 2, borderTopColor: "#dd6b20", borderBottomWidth: 2, borderBottomColor: "#dd6b20" },
    tableRow: { margin: "auto", flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#fbd38d" },
    tableColHeader: { width: "25%", padding: 8, backgroundColor: "#feebc8" },
    tableCol: { width: "25%", padding: 8 },
    tableCellHeader: { fontSize: 11, fontStyle: "italic", color: "#9c4221" },
    tableCell: { fontSize: 11, color: "#591c0b" },
    totalRow: { flexDirection: "row", marginTop: 10, padding: 10, backgroundColor: "#feebc8", borderRadius: 4 },
    totalText: { fontSize: 14, fontStyle: "italic", textAlign: "right", width: "100%", color: "#dd6b20" }
});

export const minimalTheme = StyleSheet.create({
    page: { padding: 50, fontFamily: "Courier", color: "#000", backgroundColor: "#fff" },
    header: { fontSize: 20, marginBottom: 30, textTransform: "uppercase", letterSpacing: 2 },
    subHeader: { fontSize: 14, marginTop: 30, marginBottom: 15, textTransform: "uppercase" },
    text: { fontSize: 10, lineHeight: 1.4, marginBottom: 8 },
    table: { display: "flex", width: "auto", marginTop: 20 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 5 },
    tableColHeader: { width: "25%", padding: 5 },
    tableCol: { width: "25%", padding: 5 },
    tableCellHeader: { fontSize: 9, textTransform: "uppercase" },
    tableCell: { fontSize: 9 },
    totalRow: { flexDirection: "row", marginTop: 10, borderTopWidth: 2, borderTopColor: "#000", paddingVertical: 10 },
    totalText: { fontSize: 11, textTransform: "uppercase", textAlign: "right", width: "100%" }
});
