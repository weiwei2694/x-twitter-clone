"use client"

import { SignOutButton } from "@clerk/nextjs"

const Logout = () => {
  return (
    <SignOutButton signOutCallback={() => {
        window.location.href = "/"
    }} />
  )
}

export default Logout