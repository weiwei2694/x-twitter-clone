import React from 'react'

const layout = ({ children }: {  children: React.ReactNode }) => {
  return (
    <main className="min-h-screen grid place-items-center">
        {children}
    </main>
  )
}

export default layout