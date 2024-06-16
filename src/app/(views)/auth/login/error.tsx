'use client';

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  console.log('*****************************************************************\n', 
    error,
    "**********************************************************************"
  );


  return (
    <div>
      <h1>Authentication Error</h1>
    </div>
  );
};

export default ErrorPage;

