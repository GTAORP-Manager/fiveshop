import { prisma, User } from "@db"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { withSessionSsr } from '@auth'


export interface Props {
    users: User[]
}

export default function Users(props: Props) {

  const router = useRouter()

  return (
    <div
      style={{
        overflowX: 'scroll',
      }}
    >
      <button onClick={() => router.back()}>Zurück</button>
      <h1>Benutzer</h1>

      <table cellPadding={7} border={1}>
        <thead>
          <tr>
            {Object.keys(props.users[0]).map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <tr key={user.identifier}>
              {Object.values(user).map((val, idx) => (
                <td key={idx}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const getServerSideProps = withSessionSsr(
  {
    ensureAuthenticated: true,
  },
  async (ctx) => {

    const users = await prisma.users.findMany();

    const dataPrivat = 'DATA_PRIVATE'

    return {
      props: {
        users: users.map((u) => ({
          ...u,
          web_password_raw: '',
          accounts: dataPrivat,
          inventory: dataPrivat,
          loadout: dataPrivat,
        })),
      },
    }
  }
);