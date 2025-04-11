//client component
//auth0 link: https://manage.auth0.com/dashboard/us/dev-063fksim8i2gynsl/applications/ovriEczODTNQEx8FvV6kICDWEzl0n91j/quickstart/nextjs
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}

//server component

import { getSession } from '@auth0/nextjs-auth0';

export default async function ProfileServer() {
  const { user } = await getSession();

  return (
      user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
      )
  );
}