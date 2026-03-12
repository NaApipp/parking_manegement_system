import AddTarifPage from "./components/AddTarif";
import TabelTarif from "./components/TabelTarif";

export default function Page() {
    return (
        <>
        <div className="grid grid-rows-2 gap-4">
            <AddTarifPage />
            <TabelTarif />
        </div>
        </>
    )
}