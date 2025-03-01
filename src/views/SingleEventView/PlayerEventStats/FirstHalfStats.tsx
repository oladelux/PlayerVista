import { IndividualStatCard } from '@/component/IndividualStatCard/IndividualStatCard.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'

interface FirstHalfStatsProps {
  stats?: string
}
export const FirstHalfStats = ({ stats }: FirstHalfStatsProps) => {
  return (
    <Tabs defaultValue='offensive'>
      <TabsList className='mb-5 contents gap-3 bg-transparent p-0 md:grid md:grid-cols-5'>
        <TabsTrigger value='offensive' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Offensive</TabsTrigger>
        <TabsTrigger value='defensive' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Defensive</TabsTrigger>
        <TabsTrigger value='possession' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Possession</TabsTrigger>
        <TabsTrigger value='disciplinary' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Disciplinary</TabsTrigger>
        <TabsTrigger value='goalkeeping' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Goalkeeping</TabsTrigger>
      </TabsList>
      <TabsContent value='offensive'>
        <div className='grid grid-cols-1 gap-3 rounded border border-border-line p-6 md:grid-cols-3'>
          <IndividualStatCard label='Goals Scored' value='0' />
          <IndividualStatCard label='Assists' value='0' />
          <IndividualStatCard label='Penalties Taken' value='0' />
          <IndividualStatCard label='Penalty Won' value='0' />
          <IndividualStatCard label='Possession Lost' value='0' />
          <IndividualStatCard label='Shots on target' value='0' />
          <IndividualStatCard label='Shots off target' value='0' />
          <IndividualStatCard label='Dribbles completed' value='0' />
          <IndividualStatCard label='Dribbles attempted' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='defensive'>
        <div className='grid grid-cols-1 gap-3 rounded border border-border-line p-6 md:grid-cols-3'>
          <IndividualStatCard label='Interception' value='0' />
          <IndividualStatCard label='Tackles Won' value='0' />
          <IndividualStatCard label='Tackles Lost' value='0' />
          <IndividualStatCard label='Blocks' value='0' />
          <IndividualStatCard label='Ground Duels Contested' value='0' />
          <IndividualStatCard label='Ground Duels Won' value='0' />
          <IndividualStatCard label='Fouls Conceded' value='0' />
          <IndividualStatCard label='Clearance' value='0' />
          <IndividualStatCard label='Recovery' value='0' />
          <IndividualStatCard label='Aerial Duels Contested' value='0' />
          <IndividualStatCard label='Aerial Duels Won' value='0' />
          <IndividualStatCard label='Errors' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='possession'>
        <div className='grid grid-cols-1 gap-3 rounded border border-border-line p-6 md:grid-cols-3'>
          <IndividualStatCard label='Possession lost' value='0' />
          <IndividualStatCard label='Pass accuracy' value='0' />
          <IndividualStatCard label='Ball recoveries' value='0' />
          <IndividualStatCard label='Cross - Successful' value='0' />
          <IndividualStatCard label='Cross - Unsuccessful' value='0' />
          <IndividualStatCard label='Long Pass - Successful' value='0' />
          <IndividualStatCard label='Long Pass - UnSuccessful' value='0' />
          <IndividualStatCard label='Short Pass - Unsuccessful' value='0' />
          <IndividualStatCard label='Short Pass - Successful' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='disciplinary'>
        <div className='grid grid-cols-1 gap-3 rounded border border-border-line p-6 md:grid-cols-3'>
          <IndividualStatCard label='Fouls Committed' value='0' />
          <IndividualStatCard label='Yellow Card' value='0' />
          <IndividualStatCard label='Red Card' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='goalkeeping'>
        <div className='grid grid-cols-1 gap-3 rounded border border-border-line p-6 md:grid-cols-3'>
          <IndividualStatCard label='Saves' value='0' />
          <IndividualStatCard label='Inside Box Saves' value='0' />
          <IndividualStatCard label='Outside Box Saves' value='0' />
          <IndividualStatCard label='Penalty Saves' value='0' />
          <IndividualStatCard label='1 V 1 Saves' value='0' />
          <IndividualStatCard label='Freekick Saved' value='0' />
          <IndividualStatCard label='Goals Conceded' value='0' />
          <IndividualStatCard label='Attempted Aerial Clearance' value='0' />
          <IndividualStatCard label='Successful Aerial Clearance' value='0' />
          <IndividualStatCard label='Goals' value='0' />
          <IndividualStatCard label='Assist' value='0' />
          <IndividualStatCard label='Attempted Passes' value='0' />
          <IndividualStatCard label='Completed Passes' value='0' />
        </div>
      </TabsContent>
    </Tabs>
  )
}
