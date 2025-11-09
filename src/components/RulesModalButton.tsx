import {Modal} from "@ui/modal"
import {Rules} from "./Rules";
import {CollectionOneFilterProvider} from "@context/CollectionOneFilterContext";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Button} from "@ui/button";

export const RulesModalButton = () => {
    const {pb} = useAppContext();

    return (
        <Modal
            title="Правила"
            trigger={
                <Button rounded={'lg'} colorPalette={'green'}>Правила</Button>
            }
        >
            <CollectionOneFilterProvider collection={pb.collection('settings')}>
                <Rules/>
            </CollectionOneFilterProvider>
        </Modal>
    )
}