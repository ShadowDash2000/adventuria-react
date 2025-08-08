import {Board} from "../Board";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

export const Main = () => {
    const {pb} = useAppContext();

    return (
        <>
            <CollectionListAllProvider collection={pb.collection('cells')}>
                <Board/>
            </CollectionListAllProvider>
        </>
    )
}