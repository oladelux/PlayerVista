import { NumberStatCard } from '@/component/NumberStatCard/NumberStatCard.tsx'

interface IndividualStatCardProps {
  label: string;
  value: string;
}

export const IndividualStatCard = ({ label, value }: IndividualStatCardProps) => {
  return (
    <div className='flex bg-card-stat-bg rounded-[6px] py-5 px-6 justify-between items-center'>
      <div className='text-text-grey-1 text-sm'>{label}</div>
      <NumberStatCard value={value}/>
    </div>
  )
}
