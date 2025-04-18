import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1F2C',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E9196',
  },
  logoContainer: {
    width: 60,
    height: 60,
  },
  reportDate: {
    fontSize: 10,
    color: '#8E9196',
    marginTop: 5,
  },
})

interface PDFHeaderProps {
  title: string
  subtitle?: string
  logoUrl?: string
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ title, subtitle, logoUrl }) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.reportDate}>Generated on {currentDate}</Text>
      </View>

      {logoUrl && (
        <View style={styles.logoContainer}>
          <Image src={logoUrl} />
        </View>
      )}
    </View>
  )
}

export default PDFHeader
