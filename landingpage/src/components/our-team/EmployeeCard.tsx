import Image from 'next/image'
import React from 'react'

interface EmployeeCardProps {
  employee: {
    name: string,
    imageUrl: string,
    designation: string,
  }
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <div className='flex flex-col gap-2'>
        <div className=''>

      <Image
        src={employee.imageUrl || '/images/team/user.jpg'}
        alt={employee.name}
        width={1920}
        height={1080}
        quality={100}
        className="w-full rounded-3xl object-cover"
        />
        </div>
        <div className='px-1'>
        <h6 className="text-left text-md sm:text-base md:text-[1.2rem] text-[var(--text-primary)] font-semibold capitalize leading-tight mb-1">
          {employee.name}
        </h6>
        <p className='font-secondary text-gray-500 text-sm leading-snug'>
          {employee.designation}
        </p>
      </div>
    </div>
  )
}
 
export default EmployeeCard
