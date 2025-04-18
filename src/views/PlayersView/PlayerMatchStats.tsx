import { FC, useState } from 'react'

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { ChevronDown } from 'lucide-react'

import { Player } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExportPdfButton } from '@/components/ui/export-pdf-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createPlayerMatchPdfOptions } from '@/utils/exportPlayerPdf'

// Add a type for match data
interface MatchData {
  id: string
  date: string
  opponent: string
  result: string
  minutesPlayed: number
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number
  passAccuracy: number
  rating: number
}

interface PlayerMatchStatsProps {
  playerData: Player
  matchesData: MatchData[]
}

export const PlayerMatchStats: FC<PlayerMatchStatsProps> = ({ playerData, matchesData }) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null)
  console.log(selectedMatch)

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 100,
      valueFormatter: (value: string) => {
        const date = new Date(value)
        return date.toLocaleDateString()
      },
    },
    { field: 'opponent', headerName: 'Opponent', width: 150 },
    { field: 'result', headerName: 'Result', width: 100 },
    { field: 'minutesPlayed', headerName: 'Minutes', width: 90 },
    { field: 'goals', headerName: 'Goals', width: 90 },
    { field: 'assists', headerName: 'Assists', width: 90 },
    { field: 'shots', headerName: 'Shots', width: 90 },
    { field: 'shotsOnTarget', headerName: 'Shots on Target', width: 130 },
    {
      field: 'passAccuracy',
      headerName: 'Pass Accuracy',
      width: 120,
      valueFormatter: (value: number) => `${value}%`,
    },
    { field: 'rating', headerName: 'Rating', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams<MatchData>) => {
        const match = params.row

        // Create PDF options for this specific match
        const playerName = `${playerData.firstName} ${playerData.lastName}`
        const pdfOptions = createPlayerMatchPdfOptions(
          playerData.id,
          playerName,
          match.id,
          match.opponent,
          new Date(match.date).toLocaleDateString(),
        )

        return (
          <ExportPdfButton options={pdfOptions} variant='outline' size='sm' customLabel='Export' />
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Match History</CardTitle>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='flex items-center gap-1'>
                Filter <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Matches</DropdownMenuItem>
              <DropdownMenuItem>Last 5 Matches</DropdownMenuItem>
              <DropdownMenuItem>Home Matches</DropdownMenuItem>
              <DropdownMenuItem>Away Matches</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='table'>
          <TabsList className='mb-4'>
            <TabsTrigger value='table'>Data Table</TabsTrigger>
            <TabsTrigger value='chart'>Trend Chart</TabsTrigger>
          </TabsList>
          <TabsContent value='table' className='h-[500px] w-full'>
            <DataGrid
              rows={matchesData}
              columns={columns}
              density='compact'
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'date', sort: 'desc' }],
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              onRowClick={params => setSelectedMatch(params.row)}
              sx={{
                '& .MuiDataGrid-cell': {
                  fontSize: '0.875rem',
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#f9fafb',
                  fontWeight: 'bold',
                },
                border: 'none',
                '& .MuiDataGrid-withBorderColor': {
                  borderColor: '#e5e7eb',
                },
              }}
            />
          </TabsContent>
          <TabsContent value='chart' className='h-[500px]'>
            <div className='flex h-full items-center justify-center text-center text-muted-foreground'>
              Match performance trend chart will be displayed here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
