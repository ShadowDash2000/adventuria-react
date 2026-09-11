import { Link, type LinkProps } from 'react-router-dom';

interface PlayerProfileLinkProps extends Omit<LinkProps, 'to'> {
    playerName: string;
}

export const PlayerProfileLink = ({ playerName, children, ...rest }: PlayerProfileLinkProps) => {
    return (
        <Link {...rest} to={`/profile/${playerName}`}>
            {children}
        </Link>
    );
};
