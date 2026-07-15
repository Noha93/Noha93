import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // "home" is excluded: it's a standalone animated preview route (src/app/home)
  // that isn't part of the next-intl [locale] tree yet.
  matcher: ["/((?!api|trpc|_next|_vercel|home|.*\\..*).*)"],
};
