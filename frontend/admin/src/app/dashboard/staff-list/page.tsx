import StaffCard from "@/components/StaffCard"

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold ">Staff Members</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StaffCard />
        <StaffCard />
        <StaffCard />
      </div>
    </div>
  )
}

export default page