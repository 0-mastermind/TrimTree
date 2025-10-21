import React from 'react'
import { Marquee } from '../ui/marquee'
import employees from './data'
import EmployeeCard from './EmployeeCard'

const Team = () => {
  return (
    <div className='py-20'>
         <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
        - Team
      </h6>
      <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
        Meet the experts behind your perfect hairs
      </h1>

      <Marquee pauseOnHover={true} >
        {employees.map((employee, index) => (
          <EmployeeCard key={index} employee={employee}/>
        ))}
      </Marquee>
    </div>
  )
}

export default Team