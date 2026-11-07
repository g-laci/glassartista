import {notFound} from "next/navigation";

// Unknown paths below a locale render the 404 page inside the localized root layout. The path is
// arbitrary, so it cannot be enumerated at build time (the layout's dynamicParams = false would
// otherwise answer with Next.js' bare error page instead of the localized one).
export const dynamicParams = true;

export default function CatchAllPage() {
    notFound();
}
