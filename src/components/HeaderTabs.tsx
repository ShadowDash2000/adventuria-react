import {For, Tabs} from "@chakra-ui/react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {LuHouse, LuUser} from "react-icons/lu";
import {useState} from "react";
import {UserRecord} from "@shared/types/user";
import {useCollectionListAll} from "@context/CollectionListAllContext";

export const HeaderTabs = () => {
    const location = useLocation();
    const [tabValue, setTabValue] = useState(location.pathname);
    const {data: users} = useCollectionListAll<UserRecord>();
    const navigate = useNavigate();

    return (
        <Tabs.Root
            value={tabValue}
            defaultValue={'main'}
            onValueChange={(e) => setTabValue(e.value)} variant={'plain'}
            navigate={({value}) => navigate(value)}
        >
            <Tabs.List bg={'bg.muted'} rounded={'lg'}>
                <Tabs.Trigger value="/" asChild>
                    <Link to='/'>
                        <LuHouse/>
                        Главная
                    </Link>
                </Tabs.Trigger>
                <For each={Array.from(users.values())}>
                    {(item, index) => (
                        <Tabs.Trigger key={index} value={`/profile/${item.name}`} asChild>
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