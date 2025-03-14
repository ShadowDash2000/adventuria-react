export const Avatar = ({src = '', style = 'border-white w-10 h-10'}) => {
    return (
        <img src={src} className={`rounded-full border-2 ${style}`}/>
    )
}