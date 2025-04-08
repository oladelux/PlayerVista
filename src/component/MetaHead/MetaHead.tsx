import { FC } from 'react'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import Favicon from '../../assets/images/favicon.png'

type HTMLHeadProps = {
  title: string
}

const MetaHead: FC<HTMLHeadProps> = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <link rel='shortcut icon' href={Favicon} />
      </Helmet>
    </HelmetProvider>
  )
}

export default MetaHead
