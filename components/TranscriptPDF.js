import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    alignItems: "center",
    height: 24,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    width: "20%",
    padding: 5,
    fontSize: 10,
  },
});

const TranscriptPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Academic Transcript</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Course Code</Text>
            <Text style={styles.tableCell}>Course Name</Text>
            <Text style={styles.tableCell}>Grade</Text>
            <Text style={styles.tableCell}>Credits</Text>
            <Text style={styles.tableCell}>Semester</Text>
          </View>

          {data.map((course, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{course.code}</Text>
              <Text style={styles.tableCell}>{course.name}</Text>
              <Text style={styles.tableCell}>{course.grade}</Text>
              <Text style={styles.tableCell}>{course.credits}</Text>
              <Text style={styles.tableCell}>{course.semester}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default TranscriptPDF;
