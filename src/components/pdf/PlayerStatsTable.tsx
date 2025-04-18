import { StyleSheet, Text, View } from '@react-pdf/renderer'

// Removing the specific MatchData import as we'll make this component more generic
// import { MatchData } from './PlayerSeasonPDF'

const styles = StyleSheet.create({
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#E5DEFF',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5DEFF',
  },
  tableHeader: {
    backgroundColor: '#F1F0FB',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    color: '#1A1F2C',
  },
  tableCellContent: {
    color: '#403E43',
  },
  highlightCell: {
    backgroundColor: '#E5DEFF',
  },
})

interface Column {
  key: string
  header: string
  width?: number
}

// Using a more flexible Record type to accommodate all the different data structures
interface PlayerStatsTableProps<T> {
  data: T[]
  columns: Column[]
  highlight?: string[]
}

/**
 * A generic table component that can display any tabular data
 * For TypeScript we're using a type constraint that ensures we can index the data with string keys
 */
function PlayerStatsTable<T extends { [key: string]: unknown }>({
  data,
  columns,
  highlight = [],
}: PlayerStatsTableProps<T>) {
  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        {columns.map((column, index) => (
          <View
            key={index}
            style={[
              styles.tableCell,
              styles.tableCellHeader,
              column.width ? { flex: column.width } : {},
            ]}
          >
            <Text>{column.header}</Text>
          </View>
        ))}
      </View>

      {/* Table Body */}
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.tableCell,
                styles.tableCellContent,
                highlight.includes(column.key) ? styles.highlightCell : {},
                column.width ? { flex: column.width } : {},
              ]}
            >
              <Text>{row[column.key] !== undefined ? String(row[column.key]) : '-'}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export default PlayerStatsTable
