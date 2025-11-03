import {SettingsRecord} from "@shared/types/settings";
import {useCollectionOneFilter} from "@context/CollectionOneFilterContext";
import {Flex} from "@chakra-ui/react";

export const Rules = () => {
    const {data: settings} = useCollectionOneFilter<SettingsRecord>();

    return (
        <Flex
            direction="column"
            dangerouslySetInnerHTML={{__html: settings.rules || ''}}
        />
    )
}