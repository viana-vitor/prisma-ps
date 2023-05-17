import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs"

export default async function Home() {
  const { userId } = auth()
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <UserButton />
      <div>User Id: {userId}</div>
    </main>
  )
}
