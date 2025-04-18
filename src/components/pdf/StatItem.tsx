import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  statContainer: {
    backgroundColor: '#F1F0FB',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    minWidth: '30%',
    margin: 5,
  },
  statTitle: {
    fontSize: 10,
    color: '#8E9196',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1F2C',
  },
  statValueHighlight: {
    color: '#8B5CF6',
  },
})

interface StatItemProps {
  title: string
  value: string | number
  highlight?: boolean
}

const StatItem: React.FC<StatItemProps> = ({ title, value, highlight = false }) => {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={highlight ? [styles.statValue, styles.statValueHighlight] : styles.statValue}>
        {value}
      </Text>
    </View>
  )
}

export default StatItem
