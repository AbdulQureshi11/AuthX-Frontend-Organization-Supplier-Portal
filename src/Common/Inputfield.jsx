
const Inputfield = ({ id, type, name, value, label, onChange, className, placeholder }) => {
    return (
        <div>
            <label htmlFor="" className='flex mb-1 text-gray-800 text-[15px] md:font-normal font-semibold md:text-[18px] text-white ml-2 font-Robot'>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                id={id}
                value={value}
                onChange={onChange}
                className={`${className} outline-none md:placeholder:text-[14px] placeholder:text-[12px] w-full text-sm rounded-md p-[8px]`}
            />
        </div>
    )
}

export default Inputfield
