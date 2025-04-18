import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    fontSize: 10,
    textAlign: 'center',
    color: '#8E9196',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5DEFF',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: '#8E9196',
  },
  branding: {
    position: 'absolute',
    bottom: 10,
    left: 40,
    fontSize: 8,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
})

interface PDFFooterProps {
  text?: string
  pageNumber?: number
  totalPages?: number
}

const PDFFooter: React.FC<PDFFooterProps> = ({
  text = 'Confidential Football Analysis Report - For Internal Use Only',
  pageNumber,
  totalPages,
}) => {
  return (
    <View>
      <Text style={styles.footer}>{text}</Text>
      {pageNumber && totalPages && (
        <Text style={styles.pageNumber}>
          Page {pageNumber} of {totalPages}
        </Text>
      )}
      <Text style={styles.branding}>PlayerVista™</Text>
    </View>
  )
}

export default PDFFooter
