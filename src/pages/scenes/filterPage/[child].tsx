import Error404 from '@/components/errors/Error404';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React from 'react';

type ServerFilterChildProps = {
};

const ServerFilterChild:React.FC<ServerFilterChildProps> = () => {
    return (
        <Error404/>
    )
}

export default ServerFilterChild;