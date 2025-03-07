import React from 'react'

export interface ResponseType<Type = any> {
    success: boolean
    status?: number
    msg?: string
    data?: Type
}

export interface IChildren {
    children: React.ReactNode
}

export type windowSizeType = {
    width: number
    height: number
}
