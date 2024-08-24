import { taintUniqueValue } from 'next/dist/server/app-render/rsc/taint';

type userDTOProps = {
  id: string;
  email: string;
  password: string;
};

export const userDTO = (user: userDTOProps) => {
  //   taintUniqueValue(
  //     'Do not pass a user session token to the client.',
  //     user,
  //     user.session.token,
  //    auditTrail: canViewAudit(user.auditTrail, user.role)
  //   );
  return {
    id: user.id,
    email: user.email,
    password: user.password,
  };
};

const canViewAudit = (auditTrail: string, role: string) => {
  return role === 'admin' ? auditTrail : role;
};
