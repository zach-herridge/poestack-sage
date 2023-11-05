import React from 'react'
import { useEffect, useState } from 'react'
import { bind } from '@react-rxjs/core'
import jwt from 'jsonwebtoken'
import { GGG_API_UTIL } from 'ggg-api'
import { ECHO_DIR } from 'echo-common'

type JwtPayload =
  | null
  | (jwt.JwtPayload & {
      [key: string]: any
    })

const [useJwt] = bind(GGG_API_UTIL.tokenSubject$, null)

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const jwt = useJwt()

  if (!jwt) {
    return <LoginPage />
  }

  return <>{children}</>
}

export function LoginPage() {
  const currentJwt = useJwt()
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleSet(input: string) {
    console.log('setting', input)
    const decoded = jwt.decode(input) as JwtPayload
    console.log('decoding', decoded)
    const oAuthCode = decoded?.['oAuthToken']
    if (oAuthCode) {
      ECHO_DIR.writeJson(['auth'], { jwt: input })
      setErrorMessage(null)
      GGG_API_UTIL.tokenSubject$.next(oAuthCode)
    } else {
      setErrorMessage('Failed to decode jwt.')
    }
  }

  useEffect(() => {
    if (ECHO_DIR.existsJson('auth')) {
      const loadedAuth = ECHO_DIR.loadJson('auth') as JwtPayload
      handleSet(loadedAuth?.['jwt'])
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center text-primary-text">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">PoeStack - Sage</div>
        <div className="text-sm">
          Enter your PoeStack token.{' '}
          <a
            className="text-primary-accent text-sm"
            href="https://poestack.com/poe-stack/development"
          >
            Get Token
          </a>
        </div>
        {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
        <input
          type="password"
          placeholder="Token"
          className="px-2 py-0.5 bg-input-surface rounded-lg shadow-md border-0 focus:outline-none focus:ring focus:border-primary-accent"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button
          className="bg-primary-accent px-1 py-0.5 rounded-lg"
          onClick={() => handleSet(inputValue)}
        >
          Login
        </button>
      </div>
    </div>
  )
}