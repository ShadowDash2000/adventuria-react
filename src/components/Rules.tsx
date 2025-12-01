import {type SettingsRecord} from "@shared/types/settings";
import {Flex, Text} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {useQuery} from "@tanstack/react-query";
import {LuLoader} from "react-icons/lu";

export const Rules = () => {
    const {pb} = useAppContext();
    const settings = useQuery({
        queryFn: () => {
            return pb.collection('settings').getFirstListItem<SettingsRecord>('', {
                fields: 'rules',
            });
        },
        queryKey: ['rules'],
    });

    if (settings.isPending) return <LuLoader/>;
    if (settings.isError) return <Text>Error: {settings.error?.message}</Text>;

    return (
        <Flex
            direction="column"
            dangerouslySetInnerHTML={{__html: settings.data.rules || ''}}
        />
    )
}