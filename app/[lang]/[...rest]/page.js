import {notFound} from "next/navigation";

// Unknown paths below a locale render the 404 page inside the localized root layout.
export default function CatchAllPage() {
    notFound();
}
