import { Image } from 'antd'
import React from 'react'

export const Panel : React.FC = () => {
    return (
        <section className='w-full pt-5 pb-5 flex items-center justify-center'>
            <Image src='logo_cc_nemours.jpg' preview={false} width={600}/>
        </section>
    )
}
