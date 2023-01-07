import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next";
import { users as User } from '@prisma/client'

const sessionOptions: IronSessionOptions = {
    password: String(process.env.SECRET),
    cookieName: "auth-token",
    ttl: 60 * 60 * 60 * 24 * 14,
    cookieOptions: {
        secure: false /*process.env.NODE_ENV === "production"*/,
    }
};

export type WithSessionRouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';
export interface SessionOptions {
    ensureAuthenticated?: true
    // ensureAdmin?: true
}
export function withSessionRoute(method: WithSessionRouteMethod, options: SessionOptions | undefined, handler: NextApiHandler) {
    return withIronSessionApiRoute((req, res) => {
        try {
            if (req.method !== method && method !== '*') return res.status(405).send('Method not allowed');
            if (options?.ensureAuthenticated === true && req.session.user?.identifier == null) return res.status(403).send('Not authorized')
            // if (options?.ensureAdmin === true && req.session.user?.isAdmin === true) return res.status(403).send('Not authorized')
            return handler(req, res)
        } catch (err) {
            res.status(400).send('Something went wrong')
        }
    }, sessionOptions);
}

export function withSessionSsr
    <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
        options: SessionOptions,
        handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
    ) {
    return withIronSessionSsr((ctx) => {
        try {
            if (options.ensureAuthenticated === true && ctx.req.session.user?.identifier == null) return { redirect: { destination: '/', permanent: false } }
            // if (options.ensureAdmin === true && ctx.req.session.user?.isAdmin == false) return { redirect: { destination: '/dashboard', permanent: false } }
            const result = handler(ctx)
            return result
        } catch (err) {
            console.error('[err] lib/withSession.ts::withSessionSsr() -> ', err)
            return {
                redirect: {
                    permanent: false,
                    statusCode: 301,
                    destination: '/?dest=' + encodeURIComponent(ctx.req.url || '/'),
                }
            }
        }
    }, sessionOptions);
}

export type SessionUser = { 
    web_password_raw: ''
    identifier: string
    group: String
 }

declare module "iron-session" {
    interface IronSessionData {
        user: SessionUser
    }
}