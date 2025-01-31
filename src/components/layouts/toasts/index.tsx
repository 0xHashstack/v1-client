'use client'
import { useWaitForTransaction } from '@starknet-react/core'
import { ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type LayoutProps = {
  children: ReactNode
}
export const useFetchToastStatus = ({ hash }: any) => {
  return useWaitForTransaction({
    hash,
    watch: true,
  })
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      {children}
      <ToastContainer theme="dark" limit={5} />
    </div>
  )
}

export default Layout
