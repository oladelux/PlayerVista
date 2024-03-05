import { FC } from 'react'
import './Table.scss'
import { Button } from '../Button/Button'

type Item = {
  [key: string]: string | number | boolean | JSX.Element
}

type Column = {
  key: string
  title: string
  render?: (value: any) => JSX.Element
}
type TableProps = {
  columns: Column[]
  data: Item[]

}

export const Table: FC<TableProps> = ({ columns, data }) => {
  return (
    <div className='Table'>
      <table className='Table__container'>
        <thead className='Table__container-head'>
          <tr className='Table__container-head-row'>
            {columns.map(column => <th key={column.key}
              className='Table__container-head-row-cell'>{column.title}</th>)}
          </tr>
        </thead>
        <tbody className='Table__container-body'>
          {data.length ? data.map((row, index) => (
            <tr key={index} className='Table__container-body-row'>
              {columns.map(column => <td key={column.key} className='Table__container-body-row-cell'>
                {column.render ? column.render(row[column.key]) : row[column.key]}
              </td>)}
            </tr>
          )): <tr><td colSpan={columns.length} className='Table__container-body--no-data'>There are no data available</td></tr>}
        </tbody>
      </table>
      <div className='Table__pagination'>
        <Button className='Table__pagination-btn'>Previous</Button>
        <div></div>
        <Button className='Table__pagination-btn'>Next</Button>
      </div>
    </div>
  )
}
