import { em } from 'framer-motion/client'
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
        <div className='w-[30vw]  md:w-[25vw] lg:w-[18vw] xl:w-[16vw]'>

      <Image
        src={employee.imageUrl}
        alt={employee.name}
        width={1920}
        height={1080}
        quality={100}
        className="w-full rounded-3xl object-cover"
        />
        </div>
        <div>
            
         <h6 className="text-left text-md sm:text-base md:text-[1.3rem] text-[var(--text-primary)] font-semibold capitalize">
        {employee.name}
        </h6>
        <p className='font-secondary text-gray-500 text-md'>
            {employee.designation}
        </p>
        </div>
    </div>
  )
}
 
export default EmployeeCard
