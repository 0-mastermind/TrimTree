"use client"
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import employees from './data'
import EmployeeCard from './EmployeeCard'
import { useRouter } from 'next/navigation'
import { MoveRight } from 'lucide-react'

interface Employee {
  name: string;
  imageUrl: string;
  designation: string;
  id?: string | number;
  email?: string;
}

interface RawEmployeeData {
  name?: string;
  fullName?: string;
  imageUrl?: string;
  image?: string;
  avatar?: string;
  profilePicture?: string;
  designation?: string;
  position?: string;
  role?: string;
  title?: string;
  id?: string | number;
  email?: string;
  [key: string]: unknown;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomEmployees<T extends Employee>(
  array: T[], 
  count: number, 
  prevSet: Set<string> = new Set()
): T[] {
  if (array.length <= count) return [...array]
  
  let attempt = 0
  let selection: T[] = []
  const maxAttempts = 5
  
  do {
    selection = shuffleArray(array).slice(0, count)
    attempt++
    const overlap = selection.filter((e) => prevSet.has(getEmployeeId(e))).length
    if (overlap < Math.floor(count / 2) || attempt > maxAttempts) break
  } while (attempt <= maxAttempts)
  
  return selection
}

function getEmployeeId(employee: Employee): string {
  return String(employee.id || employee.email || employee.name || Math.random())
}

// Function to map your actual data to the expected Employee format
function mapToEmployeeCardFormat(data: RawEmployeeData): Employee {
  return {
    name: data.name || data.fullName || 'Unknown Employee',
    imageUrl: data.imageUrl || data.image || data.avatar || data.profilePicture || '/images/team/user.jpg',
    designation: data.designation || data.position || data.role || data.title || 'Team Member',
    id: data.id,
    email: data.email,
  }
}

const Team: React.FC = () => {
  const router = useRouter()
  
  // Map employees to the correct format expected by EmployeeCard
  const mappedEmployees = React.useMemo(() => {
    return (employees as RawEmployeeData[]).map(mapToEmployeeCardFormat)
  }, [])

  const [randomEmployees, setRandomEmployees] = useState<Employee[]>(
    () => mappedEmployees.slice(0, 6)
  )
  const [key, setKey] = useState(0)
  const prevEmployeeIds = useRef(new Set(randomEmployees.map(getEmployeeId)))

  useEffect(() => {
    const initial = getRandomEmployees(mappedEmployees, 6)
    setRandomEmployees(initial)
    prevEmployeeIds.current = new Set(initial.map(getEmployeeId))
    setKey((prev) => prev + 1)

    const interval = setInterval(() => {
      const next = getRandomEmployees(mappedEmployees, 6, prevEmployeeIds.current)
      prevEmployeeIds.current = new Set(next.map(getEmployeeId))
      setRandomEmployees(next)
      setKey((prev) => prev + 1)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [mappedEmployees])

  return (
    <div id="team" className="py-20 px-3 transition-colors duration-300">
      <h1 className="my-4 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-gray-900 dark:text-white transition-colors duration-300">
        Meet the experts behind your perfect hair
      </h1>
      <div className='grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-20 mb-10' style={{ perspective: '1500px' }}>
        <AnimatePresence mode="popLayout">
          {randomEmployees.map((employee, index) => (
            <motion.div
              key={`${key}-${getEmployeeId(employee)}`}
              initial={{ 
                rotateY: 180,
                opacity: 0,
                scale: 0.7,
                z: -100
              }}
              animate={{ 
                rotateY: 0,
                opacity: 1,
                scale: 1,
                z: 0
              }}
              exit={{ 
                rotateY: -180,
                opacity: 0,
                scale: 0.7,
                z: -100
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                type: "spring",
                stiffness: 80,
                damping: 15
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <EmployeeCard employee={employee} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-14">
        <button
          className="flex gap-2 px-8 py-2 font-semibold justify-center items-center font-secondary border-2 hover:bg-[#ffaa00] border-[#ffaa00] rounded-lg hover:text-white transition-colors duration-300 cursor-pointer text-[#ffaa00] dark:text-[#ffaa00] dark:border-[#ffaa00] dark:hover:bg-[#ffaa00] dark:hover:text-white"
          onClick={() => router.push('/team')}
          type="button"
        >
          View All <MoveRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

export default Team