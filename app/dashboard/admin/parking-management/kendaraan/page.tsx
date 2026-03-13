import AddKendaraan from "./components/AddKendaraan";
import TabelKendaraan from "./components/TabelKendaraan";
export default function Page() {
    return (
        <>
        <div className="grid grid-rows-2 gap-4">
            <AddKendaraan />
            <TabelKendaraan />
        </div>
        </>
    )
}