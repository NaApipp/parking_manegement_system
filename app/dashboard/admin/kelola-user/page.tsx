import AddUserPage from "./components/FormAddUser";
import TabelData from "./components/TabelData";

export default function Page() {
    return (
        <>
            <div className="grid grid-row-2 gap-4">
                <AddUserPage />
                <TabelData />
            </div>
        </>
    )
}