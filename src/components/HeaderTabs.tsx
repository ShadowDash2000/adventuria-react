import {For, Tabs} from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";
import {LuHouse, LuUser} from "react-icons/lu";
import {useState} from "react";
import {UserRecord} from "@shared/types/user";
import {useCollectionListAll} from "@context/CollectionListAllContext";

export const HeaderTabs = () => {
    const params = useParams();
    const [tabValue, setTabValue] = useState(params.login || 'main');
    const {data: users} = useCollectionListAll<UserRecord>();

    return (
        <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)} variant={'plain'}>
            <Tabs.List bg={'bg.muted'} rounded={'lg'}>
                <Tabs.Trigger value="main" asChild>
                    <Link to={`/`}>
                        <LuHouse/>
                        Главная
                    </Link>
                </Tabs.Trigger>
                <For each={Array.from(users.values())}>
                    {(item, index) => (
                        <Tabs.Trigger key={index} value={item.name} asChild>
                            <Link to={`/profile/${item.name}`}>
                                <LuUser/>
                                {item.name}
                            </Link>
                        </Tabs.Trigger>
                    )}
                </For>
                <Tabs.Indicator rounded={'lg'} bg={'purple.400'}/>
            </Tabs.List>
        </Tabs.Root>
    )
}