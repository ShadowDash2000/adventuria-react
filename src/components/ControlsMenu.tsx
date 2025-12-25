import { IconButton, VStack } from '@chakra-ui/react';
import { GlossaryButton } from '@components/glossary/GlossaryButton';
import { LeaderboardButton } from '@components/leaderboard/LeaderboardButton';
import { RulesButton } from '@components/rules/RulesButton';
import { FaHouse } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { LoginModalButton } from '@components/LoginModalButton';
import { useAppContext } from '@context/AppContext';
import { FaSignOutAlt } from 'react-icons/fa';
import { Tooltip } from '@ui/tooltip';
import { HiCommandLine } from 'react-icons/hi2';

export const ControlsMenu = () => {
    const { isAuth, logout } = useAppContext();

    return (
        <VStack
            position="fixed"
            w="3.5rem"
            right={0}
            bottom={0}
            pr={4}
            mb={10}
            zIndex={60}
            align="right"
        >
            <VStack justify="center" align="start">
                <Tooltip content="Главная">
                    <IconButton asChild>
                        <Link to="/">
                            <FaHouse />
                        </Link>
                    </IconButton>
                </Tooltip>
                <RulesButton />
                <LeaderboardButton />
                <GlossaryButton />
                <Tooltip content="Создатели">
                    <IconButton asChild>
                        <Link to="/developers">
                            <HiCommandLine />
                        </Link>
                    </IconButton>
                </Tooltip>
                {isAuth ? (
                    <Tooltip content="Выход">
                        <IconButton onClick={() => logout()} _hover={{ bg: 'red' }}>
                            <FaSignOutAlt />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <LoginModalButton />
                )}
            </VStack>
        </VStack>
    );
};
