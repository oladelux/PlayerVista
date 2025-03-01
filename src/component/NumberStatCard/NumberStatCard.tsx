interface NumberStatCardProps {
  value: string;
}

export const NumberStatCard = ({ value }: NumberStatCardProps) => {
  return (
    <div className='rounded-b-lg border-b border-at-purple bg-white px-2.5 py-1.5 text-sm text-at-purple'>
      {value}
    </div>
  )
}
