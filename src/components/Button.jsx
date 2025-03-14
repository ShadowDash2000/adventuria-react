export const Button = ({children, style = 'bg-purple', onClick}) => {
    return (
        <button className={`cursor-pointer border-none uppercase ${style}`} onClick={onClick}>
            {children}
        </button>
    )
}