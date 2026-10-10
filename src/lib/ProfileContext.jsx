import { createContext, useContext } from 'react'

const Ctx = createContext(null)
export const ProfileProvider = Ctx.Provider
// Returns { profile, about }: the editable name, contact details and About Me text.
export const useProfile = () => useContext(Ctx)
