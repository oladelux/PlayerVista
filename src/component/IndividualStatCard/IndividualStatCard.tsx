import { NumberStatCard } from '@/component/NumberStatCard/NumberStatCard.tsx'

interface IndividualStatCardProps {
  label: string;
  value: string;
}

export const IndividualStatCard = ({ label, value }: IndividualStatCardProps) => {
  return (
    <div className='flex items-center justify-between rounded-[6px] bg-card-stat-bg px-6 py-5'>
      <div className='text-sm text-text-grey-1'>{label}</div>
      <NumberStatCard value={value}/>
    </div>
  )
}
