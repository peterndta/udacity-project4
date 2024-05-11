import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Button } from 'semantic-ui-react'

export const LogIn = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <div>
      <h1>Please log in</h1>

      <Button onClick={() => loginWithRedirect()} size="huge" color="olive">
        Log in
      </Button>
    </div>
  )
}
