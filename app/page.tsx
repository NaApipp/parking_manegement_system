import { redirect } from "next/navigation";
import MaintenancePage from "./components/Maintenance";

export default function Home() {
    // redirect("/login");
    return (
        <>
        <MaintenancePage />
        </>
    )
}