// /src/app/auth/error.tsx
"use client"
import React from "react"

const ErrorPage = (errors: any) => {
  return(
    <div>
        Errores Returned:  {JSON.stringify(errors)}
    </div>
  )
}

export default ErrorPage