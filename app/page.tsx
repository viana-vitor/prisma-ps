import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"

export default async function Home() {
  const { userId } = auth()
  const user = await currentUser()
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {userId ? (
        <div>
          <UserButton />
          {userId}
        </div>
      ) : (
        <SignInButton mode='modal' />
      )}
    </main>
  )
}
