import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  conatiner: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 200,
  },
  image: {
    width: "6.2cm",
    height: "6.2cm",
    marginBottom: 20,
  },
});

export const MyDocument = ({
  images,
  orderId,
}: {
  images: (String[] | Blob[])[];
  orderId: string[] | null;
}) => {
  return (
    <Document>
      {images.map((group, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <Text
            style={{
              margin: "0 auto",
            }}
          >
            Order Id: {orderId!?.length > 0 && orderId![idx]}
          </Text>
          <View style={styles.conatiner}>
            {group?.map((i, idx: number) => (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image key={idx} src={i as any} style={styles.image} />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};
