interface NumberStatCardProps {
  value: string;
}

export const NumberStatCard = ({ value }: NumberStatCardProps) => {
  return (
    <div className='bg-white border-b text-at-purple rounded-b-lg border-at-purple text-sm py-1.5 px-2.5'>
      {value}
    </div>
  )
}
