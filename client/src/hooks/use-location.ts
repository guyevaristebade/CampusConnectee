import { LocationContext } from '../context'
import React from 'react'

export const useLocation = () => {
  return React.useContext(LocationContext)
}
