import AddAreaPage from "./components/AddArea"
import TabelArea from "./components/TabelArea"

export default function Page() {
    return (
        <>
        <div className="grid grid-rows-2 gap-4">
            <AddAreaPage />
            <TabelArea />
        </div>
        </>
    )
}