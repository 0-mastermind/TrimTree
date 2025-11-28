import Image from 'next/image'
import React from 'react'

/* 
@type EmployeeCardProps
@props name: string;
@props image: string;
@props designation: string;
*/
interface EmployeeCardProps {
  name: string;
  image?: string;
  designation: string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ name, image, designation }) => {
  return (
    <div className='flex flex-col gap-2'>
        <div className=''>

      <Image
        src={image || '/images/team/user-placeholder.png'}
        alt="Employee Image"
        width={1920}
        height={1080}
        quality={100}
        className="w-full rounded-3xl object-cover"
        />
        </div>
        <div className='px-1 text-center'>
        <h6 className="text-md sm:text-base md:text-[1.2rem] text-[var(--text-primary)] font-semibold capitalize leading-tight mb-1">
          {name}
        </h6>
        <p className='font-secondary text-gray-500 text-sm leading-snug mt-2 capitalize'>
          {designation}
        </p>
      </div>
    </div>
  )
}
 
export default EmployeeCard
