import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { IndividualStatCard } from '@/component/IndividualStatCard/IndividualStatCard.tsx'

interface FirstHalfStatsProps {
  stats?: string
}
export const FirstHalfStats = ({ stats }: FirstHalfStatsProps) => {
  return (
    <Tabs defaultValue='offensive'>
      <TabsList className='bg-transparent contents md:grid md:grid-cols-5 gap-3 p-0 mb-5'>
        <TabsTrigger value='offensive' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Offensive</TabsTrigger>
        <TabsTrigger value='defensive' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Defensive</TabsTrigger>
        <TabsTrigger value='possession' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Possession</TabsTrigger>
        <TabsTrigger value='disciplinary' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Disciplinary</TabsTrigger>
        <TabsTrigger value='goalkeeping' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Goalkeeping</TabsTrigger>
      </TabsList>
      <TabsContent value='offensive'>
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-border-line rounded'>
          <IndividualStatCard label='Goals Scored' value='0' />
          <IndividualStatCard label='Assists' value='0' />
          <IndividualStatCard label='Penalties Taken' value='0' />
          <IndividualStatCard label='Assists' value='0' />
          <IndividualStatCard label='Penalty Won' value='0' />
          <IndividualStatCard label='Possession Lost' value='0' />
          <IndividualStatCard label='Shots on target' value='0' />
          <IndividualStatCard label='Shots off target' value='0' />
          <IndividualStatCard label='Dribbles completed' value='0' />
          <IndividualStatCard label='Dribbles attempted' value='0' />
          <IndividualStatCard label='Chances created' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='defensive'>
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-border-line rounded'>
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
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-border-line rounded'>
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
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-border-line rounded'>
          <IndividualStatCard label='Fouls Committed' value='0' />
          <IndividualStatCard label='Yellow Card' value='0' />
          <IndividualStatCard label='Red Card' value='0' />
        </div>
      </TabsContent>
      <TabsContent value='goalkeeping'>
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-border-line rounded'>
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
