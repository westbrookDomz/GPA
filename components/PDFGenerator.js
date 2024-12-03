import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 12,
  },
});

const PDFGenerator = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Academic Transcript</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.text}>{item.code}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>{item.grade}</Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default PDFGenerator;
