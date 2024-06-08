"use client"

import LoginForm from "@/app/components/LoginForm"

const errorBoundary = ({error}:{error:Error}) => {
    const message = error.message;
    console.log(error)
    return (
        <>
        <LoginForm  errs={message} />
        </>
    )
}

export default errorBoundary